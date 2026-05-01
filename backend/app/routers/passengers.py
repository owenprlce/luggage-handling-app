from flask import Blueprint, request, jsonify
from app.AirportSystemMain import get_airport_system
from app.domain.Passenger import Passenger
from app.domain.Bag import Bag
from app.enums import PassengerStatus, BagLocationType, StaffRole
from app.utils.auth import jwt_required, role_required, get_jwt_identity
from app.utils.validators import (
    validate_passenger_body, validate_bag_body, validate_required
)

bp = Blueprint("passengers", __name__, url_prefix="/passengers")


@bp.get("")
@jwt_required
def get_all_passengers():
    """
    Returns passengers. Supports ?flight_id= query param.
    Airline/gate staff only see their own airline's passengers.
    """
    flight_id    = request.args.get("flight_id")
    user         = get_jwt_identity()
    role         = user.get("role")
    airline_code = user.get("airline_code")
    filter_code  = airline_code if role in ("Airline Staff", "Gate Staff") else None

    system     = get_airport_system()
    passengers = system.get_all_passengers(flight_id=flight_id, airline_code=filter_code)
    return jsonify([p.to_dict() for p in passengers]), 200


@bp.get("/<ticket_number>")
@jwt_required
def get_passenger(ticket_number):
    """Returns a single passenger by ticket number."""
    system = get_airport_system()
    try:
        passenger = system.get_passenger(ticket_number)
    except ValueError as e:
        return jsonify({"error": str(e)}), 404

    user         = get_jwt_identity()
    role         = user.get("role")
    airline_code = user.get("airline_code")
    if role in ("Airline Staff", "Gate Staff") and airline_code:
        if passenger.airline_code != airline_code:
            return jsonify({"error": "Access denied: different airline"}), 403

    return jsonify(passenger.to_dict()), 200


@bp.post("")
@role_required(StaffRole.Admin)
def add_passenger():
    """Admin only: adds a passenger to the system (equivalent to purchasing a ticket)."""
    data = request.get_json(silent=True)
    if not data:
        return jsonify({"error": "Request body must be JSON"}), 400

    try:
        clean = validate_passenger_body(data)
    except ValueError as e:
        return jsonify({"error": str(e)}), 400

    passenger = Passenger(
        ticket_number  = clean["ticket_number"],
        first_name     = clean["firstname"],
        last_name      = clean["lastname"],
        identification = clean["identification"],
        flight_id      = clean["flight_id"],
        airline_code   = clean["airline_code"],
        status         = PassengerStatus.NotCheckedIn,
    )

    system = get_airport_system()
    try:
        system.add_passenger(passenger)
    except ValueError as e:
        return jsonify({"error": str(e)}), 409

    return jsonify({
        "message": f"Passenger {clean['firstname']} {clean['lastname']} added successfully"
    }), 201


@bp.delete("/<ticket_number>")
@role_required(StaffRole.Admin)
def remove_passenger(ticket_number):
    """Admin only: removes a passenger and all their bags."""
    system = get_airport_system()
    try:
        system.remove_passenger(ticket_number)
    except ValueError as e:
        return jsonify({"error": str(e)}), 404
    return jsonify({"message": f"Passenger {ticket_number} removed"}), 200


@bp.post("/<ticket_number>/checkin")
@role_required(StaffRole.AirlineStaff)
def check_in_passenger(ticket_number):
    """
    Airline Staff: checks in a passenger and optionally registers their bags.
    Request body: {"bags": [...]}  — bags list may be empty.
    """
    data = request.get_json(silent=True) or {}
    user_airline = get_jwt_identity().get("airline_code")

    # Verify passenger exists and belongs to this airline before doing anything
    system = get_airport_system()
    try:
        passenger = system.get_passenger(ticket_number)
    except ValueError as e:
        return jsonify({"error": str(e)}), 404

    if passenger.airline_code != user_airline:
        return jsonify({"error": "Cannot check in passengers from a different airline"}), 403

    # Validate and build Bag domain objects
    bags      = []
    bag_items = data.get("bags", [])

    for item in bag_items:
        try:
            clean = validate_bag_body(item)
        except ValueError as e:
            return jsonify({"error": f"Bag validation error: {e}"}), 400

        bags.append(Bag(
            bag_id        = clean["bag_id"],
            ticket_number = clean["ticket_number"],
            flight_id     = clean["flight_id"],
            airline_code  = clean["airline_code"],
            location_type = BagLocationType.CheckInCounter,
            location      = BagLocationType.CheckInCounter.value,
        ))

    try:
        system.check_in_passenger(ticket_number, bags)
    except ValueError as e:
        return jsonify({"error": str(e)}), 409

    return jsonify({
        "message":         "Passenger checked in successfully",
        "ticket_number":   ticket_number,
        "bags_registered": [b.bag_id for b in bags],
    }), 200


@bp.post("/<ticket_number>/board")
@role_required(StaffRole.GateStaff)
def board_passenger(ticket_number):
    """Gate Staff: boards a passenger after verifying check-in and bag status."""
    user_airline = get_jwt_identity().get("airline_code")
    system       = get_airport_system()

    try:
        passenger = system.get_passenger(ticket_number)
    except ValueError as e:
        return jsonify({"error": str(e)}), 404

    if passenger.airline_code != user_airline:
        return jsonify({"error": "Cannot board passengers from a different airline"}), 403

    try:
        system.board_passenger(ticket_number)
    except ValueError as e:
        return jsonify({"error": str(e)}), 409

    return jsonify({"message": f"Passenger {ticket_number} boarded successfully"}), 200


@bp.post("/security-violation")
@role_required(StaffRole.GroundStaff)
def report_security_violation():
    """
    Ground Staff: flags a bag as a security violation.
    Posts a notice to the Airline message board so airline staff can act.
    Body: {"ticket_number": "...", "bag_id": "...", "sender_username": "..."}
    """
    data = request.get_json(silent=True)
    if not data:
        return jsonify({"error": "Request body must be JSON"}), 400

    try:
        validate_required(data, "ticket_number", "bag_id", "sender_username")
    except ValueError as e:
        return jsonify({"error": str(e)}), 400

    system = get_airport_system()
    try:
        system.report_security_violation(
            data["ticket_number"],
            data["bag_id"],
            data["sender_username"],
        )
    except ValueError as e:
        return jsonify({"error": str(e)}), 404

    return jsonify({"message": "Security violation reported to airline message board"}), 200


@bp.post("/<ticket_number>/checkin-issue")
@role_required(StaffRole.AirlineStaff)
def report_check_in_issue(ticket_number):
    """Airline Staff: reports a check-in problem to the Admin board."""
    system = get_airport_system()
    system.report_check_in_issue(ticket_number)
    return jsonify({"message": "Check-in issue reported to administrator"}), 200


# ── Bonus: passenger self-service ─────────────────────────────────────────────

@bp.get("/<ticket_number>/bags")
@jwt_required
def trace_passenger_bags(ticket_number):
    """[Bonus] Returns the current location of all bags for a passenger."""
    system = get_airport_system()
    bags   = system.trace_passenger_bags(ticket_number)
    return jsonify([b.to_dict() for b in bags]), 200


@bp.get("/<ticket_number>/gate")
@jwt_required
def view_passenger_gate(ticket_number):
    """[Bonus] Returns the gate info string for a passenger's flight."""
    system = get_airport_system()
    try:
        gate_info = system.view_passenger_gate(ticket_number)
    except ValueError as e:
        return jsonify({"error": str(e)}), 404
    return jsonify({"gate_info": gate_info}), 200