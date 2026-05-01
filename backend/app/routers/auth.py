from flask import Blueprint, request, jsonify
from app.AirportSystemMain import get_airport_system
from app.utils.auth import create_token, jwt_required, get_jwt_identity
from app.utils.validators import validate_password, validate_required

bp = Blueprint("auth", __name__, url_prefix="/auth")


@bp.post("/login")
def login():
    """
    Staff login. Validates credentials via AirportSystemMain.login_staff(),
    then returns a signed JWT token.
    """
    data = request.get_json(silent=True)
    if not data:
        return jsonify({"error": "Request body must be JSON"}), 400

    username = data.get("username", "").strip()
    password = data.get("password", "")

    if not username or not password:
        return jsonify({"error": "username and password are required"}), 400

    system = get_airport_system()

    if not system.login_staff(username, password):
        return jsonify({"error": "Invalid username or password"}), 401

    role         = system.get_staff_role(username)
    airline_code = system.get_staff_airline(username)
    token        = create_token(username, role, airline_code)

    return jsonify({
        "access_token": token,
        "token_type":   "bearer",
        "role":         role,
        "username":     username,
        "airline_code": airline_code,
    }), 200


@bp.post("/login/passenger")
def login_passenger():
    """
    [Bonus] Passenger login using identification number + ticket number.
    No username or password required.
    """
    data = request.get_json(silent=True)
    if not data:
        return jsonify({"error": "Request body must be JSON"}), 400

    identification = data.get("identification", "").strip()
    ticket_number  = data.get("ticket_number",  "").strip()

    if not identification or not ticket_number:
        return jsonify({"error": "identification and ticket_number are required"}), 400

    system = get_airport_system()

    if not system.login_passenger(identification, ticket_number):
        return jsonify({"error": "Invalid identification or ticket number"}), 401

    token = create_token(ticket_number, "Passenger", None)
    return jsonify({
        "access_token": token,
        "token_type":   "bearer",
        "role":         "Passenger",
    }), 200


@bp.put("/change-password")
@jwt_required
def change_password():
    """Any logged-in user can change their own password."""
    data = request.get_json(silent=True)
    if not data:
        return jsonify({"error": "Request body must be JSON"}), 400

    current_password = data.get("current_password", "")
    new_password     = data.get("new_password", "")

    if not current_password or not new_password:
        return jsonify({"error": "current_password and new_password are required"}), 400

    try:
        validate_password(new_password)
    except ValueError as e:
        return jsonify({"error": str(e)}), 400

    username = get_jwt_identity()["sub"]
    system   = get_airport_system()

    try:
        system.change_staff_password(username, current_password, new_password)
    except ValueError as e:
        return jsonify({"error": str(e)}), 400

    return jsonify({"message": "Password changed successfully"}), 200


@bp.post("/logout")
@jwt_required
def logout():
    """
    Logout endpoint. JWTs are stateless so logout is handled client-side
    by discarding the token. This endpoint exists for design compliance.
    """
    user    = get_jwt_identity()
    system  = get_airport_system()
    system.logout(user["sub"])
    return jsonify({"message": "Logged out successfully"}), 200