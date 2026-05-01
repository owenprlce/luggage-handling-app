from functools import wraps
from flask import request, jsonify, current_app, g
from app.enums import StaffRole
import jwt as pyjwt
from datetime import datetime, timedelta, timezone
from dotenv import load_dotenv
import os

load_dotenv()

JWT_SECRET         = os.getenv("JWT_SECRET", "changeme")
JWT_ALGORITHM      = os.getenv("JWT_ALGORITHM", "HS256")
JWT_EXPIRE_MINUTES = int(os.getenv("JWT_EXPIRE_MINUTES", 480))


# Token creation

def create_token(username: str, role: str, airline_code: str | None) -> str:
    """Creates a signed JWT containing the user's identity."""
    expire  = datetime.now(timezone.utc) + timedelta(minutes=JWT_EXPIRE_MINUTES)
    payload = {
        "sub":          username,
        "role":         role,
        "airline_code": airline_code,
        "exp":          expire,
    }
    return pyjwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


# Token decoding helper

def _decode_token() -> dict | None:
    """
    Extracts and decodes the JWT from the Authorization header.
    Returns the payload dict on success, None if missing or invalid.
    Expected header format: Authorization: Bearer <token>
    """
    auth_header = request.headers.get("Authorization", "")
    if not auth_header.startswith("Bearer "):
        return None
    token = auth_header.split(" ", 1)[1]
    try:
        return pyjwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
    except pyjwt.ExpiredSignatureError:
        return None
    except pyjwt.InvalidTokenError:
        return None


def get_jwt_identity() -> dict | None:
    """
    Returns the decoded JWT payload stored on Flask's g object.
    Only valid inside a route decorated with @jwt_required or @role_required.
    Returns a dict with keys: sub, role, airline_code.
    """
    return getattr(g, "jwt_payload", None)


# Decorators

def jwt_required(f):
    """
    Decorator: requires a valid JWT in the Authorization header.
    Stores the decoded payload in g.jwt_payload for the route to access
    via get_jwt_identity().
    Returns 401 if the token is missing or invalid.
    """
    @wraps(f)
    def decorated(*args, **kwargs):
        payload = _decode_token()
        if payload is None:
            return jsonify({"error": "Missing or invalid token. Please log in."}), 401
        g.jwt_payload = payload
        return f(*args, **kwargs)
    return decorated


def role_required(*allowed_roles: StaffRole):
    """
    Decorator factory: requires the current user's role to be one of the
    allowed roles. Implies @jwt_required (no need to stack both).
    Returns 401 if not logged in, 403 if the role does not match.

    Usage:
        @bp.delete("/flights/<flight_id>")
        @role_required(StaffRole.Admin)
        def delete_flight(flight_id):
            ...
    """
    def decorator(f):
        @wraps(f)
        def decorated(*args, **kwargs):
            payload = _decode_token()
            if payload is None:
                return jsonify({"error": "Missing or invalid token. Please log in."}), 401
            g.jwt_payload = payload
            allowed_values = [r.value for r in allowed_roles]
            if payload.get("role") not in allowed_values:
                return jsonify({
                    "error": f"Access denied. Required role(s): {allowed_values}"
                }), 403
            return f(*args, **kwargs)
        return decorated
    return decorator