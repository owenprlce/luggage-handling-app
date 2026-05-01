from flask import Blueprint, request, jsonify
from app.AirportSystemMain import get_airport_system
from app.domain.Flight import Flight
from app.enums import StaffRole
from app.utils.auth import jwt_required, role_required, get_jwt_identity
from app.utils.validators import validate_flight_body, validate_required

bp = Blueprint("flights", __name__, url_prefix="/flights")


@bp.get("")
@jwt_required
def get_all_flights():
    """
    Returns all flights.
    Airline staff and gate staff only see their own airline's flights.
    Admin and ground staff see all flights.
    """
    user         = get_jwt_identity()
    role         = user.get("role")
    airline_code = user.get("airline_code")
    filter_code  = airline_code if role in ("Airline Staff", "Gate Staff") else None

    system  = get_airport_system()
    flights = system.get_all_flights(filter_code)
    return jsonify([f.to_dict() for f in flights]), 200


@bp.get("/<flight_id>")
@jwt_required
def get_flight(flight_id):
    """Returns a single flight by flight_id."""
    system = get_airport_system()
    try:
        flight = system.get_flight(flight_id)
    except ValueError as e:
        return jsonify({"error": str(e)}), 404

    # Airline/gate staff may only view their own airline's flights
    user         = get_jwt_identity()
    role         = user.get("role")
    airline_code = user.get("airline_code")
    if role in ("Airline Staff", "Gate Staff") and airline_code:
        if flight.airline_code != airline_code:
            return jsonify({"error": "Access denied: different airline"}), 403

    return jsonify(flight.to_dict()), 200


@bp.get("/gate/<terminal>/<gate_number>")
@jwt_required
def get_flight_at_gate(terminal, gate_number):
    """Returns the flight currently assigned to a specific gate."""
    system = get_airport_system()
    try:
        flight = system.get_flight_at_gate(terminal, gate_number)
    except ValueError as e:
        return jsonify({"error": str(e)}), 404
    return jsonify(flight.to_dict()), 200


@bp.post("")
@role_required(StaffRole.Admin)
def add_flight():
    """Admin only: adds a new flight."""
    data = request.get_json(silent=True)
    if not data:
        return jsonify({"error": "Request body must be JSON"}), 400

    try:
        clean = validate_flight_body(data)
    except ValueError as e:
        return jsonify({"error": str(e)}), 400

    flight = Flight(
        flight_id    = clean["flight_id"],
        airline_name = "",  # resolved from DB via JOIN on retrieve
        destination  = clean["destination"],
        terminal     = clean["terminal"],
        gate_number  = clean["gate_number"],
        airline_code = clean["airline_code"],
    )

    system = get_airport_system()
    try:
        system.add_flight(flight)
    except ValueError as e:
        return jsonify({"error": str(e)}), 409

    return jsonify({"message": f"Flight {clean['flight_id']} added successfully"}), 201


@bp.delete("/<flight_id>")
@role_required(StaffRole.Admin)
def remove_flight(flight_id):
    """Admin only: removes a flight and all associated passengers and bags."""
    system = get_airport_system()
    try:
        system.remove_flight(flight_id)
    except ValueError as e:
        return jsonify({"error": str(e)}), 404
    return jsonify({"message": f"Flight {flight_id} and all associated data removed"}), 200


@bp.put("/<flight_id>/gate")
@role_required(StaffRole.Admin, StaffRole.GateStaff)
def update_flight_gate(flight_id):
    """Admin or Gate Staff: updates the gate assignment for a flight."""
    data = request.get_json(silent=True)
    if not data:
        return jsonify({"error": "Request body must be JSON"}), 400

    try:
        validate_required(data, "new_terminal", "new_gate_number")
    except ValueError as e:
        return jsonify({"error": str(e)}), 400

    system = get_airport_system()
    try:
        system.change_flight_gate(
            flight_id,
            data["new_terminal"].strip().upper(),
            str(data["new_gate_number"]).strip(),
        )
    except ValueError as e:
        return jsonify({"error": str(e)}), 409

    return jsonify({"message": f"Gate for flight {flight_id} updated successfully"}), 200