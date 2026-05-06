from flask import Flask, request
from dotenv import load_dotenv
import os

load_dotenv()


def create_app() -> Flask:
    """Creates and returns the configured Flask application."""
    app = Flask(__name__)

    # JWT secret used by app/utils/auth.py (also read directly from env there)
    app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET", "changeme")
    app.config["SECRET_KEY"]     = os.getenv("JWT_SECRET", "changeme")

    @app.before_request
    def handle_cors_preflight():
        if request.method == "OPTIONS":
            return ("", 204)

    @app.after_request
    def add_cors_headers(response):
        allowed_origins = {
            "http://localhost:5173",
            "http://127.0.0.1:5173",
        }
        configured_origin = os.getenv("CORS_ORIGIN")
        if configured_origin:
            allowed_origins.add(configured_origin)

        origin = request.headers.get("Origin")
        if origin in allowed_origins:
            response.headers["Access-Control-Allow-Origin"] = origin
            response.headers["Vary"] = "Origin"
        response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
        response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
        return response

    # Register blueprints (one per resource, equivalent to FastAPI routers)
    from app.routers.auth       import bp as auth_bp
    from app.routers.flights    import bp as flights_bp
    from app.routers.passengers import bp as passengers_bp
    from app.routers.bags       import bp as bags_bp
    from app.routers.staff      import bp as staff_bp
    from app.routers.messages   import bp as messages_bp
    from app.routers.departure  import bp as departure_bp

    app.register_blueprint(auth_bp)
    app.register_blueprint(flights_bp)
    app.register_blueprint(passengers_bp)
    app.register_blueprint(bags_bp)
    app.register_blueprint(staff_bp)
    app.register_blueprint(messages_bp)
    app.register_blueprint(departure_bp)

    # Simple health-check routes
    @app.get("/")
    def index():
        from flask import jsonify
        return jsonify({"message": "Airport Luggage Handling API is running"})

    @app.get("/health")
    def health():
        from flask import jsonify
        return jsonify({"status": "ok"})

    return app
