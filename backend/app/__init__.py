from flask import Flask
from dotenv import load_dotenv
import os

load_dotenv()


def create_app() -> Flask:
    """Creates and returns the configured Flask application."""
    app = Flask(__name__)

    # JWT secret used by app/utils/auth.py (also read directly from env there)
    app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET", "changeme")
    app.config["SECRET_KEY"]     = os.getenv("JWT_SECRET", "changeme")

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