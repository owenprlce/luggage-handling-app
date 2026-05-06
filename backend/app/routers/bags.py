from flask import Blueprint, request, jsonify
from app.AirportSystemMain import get_airport_system
from app.enums import BagLocationType, StaffRole
from app.utils.auth import jwt_required, role_required, get_jwt_identity
from app.utils.validators import validate_required

bp = Blueprint("bags", __name__, url_prefix="/bags")


@bp.get("")
@jwt_required
def get_bags():
    """
    Returns bags. Supports query params:
      ?ticket_number=  — all bags for a passenger
      ?flight_id=      — all bags on a flight
      ?terminal=&gate_number=  — all bags at a gate
    """
    ticket_number = request.args.get("ticket_number")
    flight_id     = request.args.get("flight_id")
    terminal      = request.args.get("terminal")
    gate_number   = request.args.get("gate_number")

    system = get_airport_system()
    bags   = system.get_bags(
        ticket_number = ticket_number,
        flight_id     = flight_id,
        terminal      = terminal,
        gate_number   = gate_number,
    )
    return jsonify([b.to_dict() for b in bags]), 200


@bp.get("/<bag_id>")
@jwt_required
def get_bag(bag_id):
    """Returns a single bag by bag_id."""
    system = get_airport_system()
    bags   = system.get_bags(bag_id=bag_id)
    if not bags:
        return jsonify({"error": f"Bag {bag_id} not found"}), 404
    return jsonify(bags[0].to_dict()), 200


@bp.put("/<bag_id>/location")
@role_required(StaffRole.GroundStaff)
def update_bag_location(bag_id):
    """
    Ground Staff: updates a bag's location.
    Body: {"new_type": "<BagLocationType value>", "detail": "<optional string>"}
    Valid new_type values: "Check-in counter", "Security check", "Gate", "Loaded"
    """
    data = request.get_json(silent=True)
    if not data:
        return jsonify({"error": "Request body must be JSON"}), 400

    try:
        validate_required(data, "new_type")
        new_type = BagLocationType(data["new_type"])
    except ValueError as e:
        valid = [t.value for t in BagLocationType]
        return jsonify({"error": f"Invalid new_type. Must be one of: {valid}"}), 400

    detail = data.get("detail", "")
    system = get_airport_system()
    try:
        system.update_bag_location(bag_id, new_type, detail)
    except ValueError as e:
        return jsonify({"error": str(e)}), 404

    return jsonify({"message": f"Bag {bag_id} location updated to '{new_type.value}'"}), 200


@bp.put("/<bag_id>/load")
@role_required(StaffRole.GroundStaff)
def load_bag(bag_id):
    """
    Ground Staff at gate: loads a bag onto the plane.
    The passenger must already be boarded before this will succeed.
    """
    system = get_airport_system()
    try:
        system.load_bag(bag_id)
    except ValueError as e:
        return jsonify({"error": str(e)}), 409
    return jsonify({"message": f"Bag {bag_id} loaded onto plane"}), 200


@bp.delete("/<bag_id>")
@role_required(StaffRole.Admin, StaffRole.AirlineStaff)
def remove_bag(bag_id):
    """Admin or Airline Staff: removes a single bag (e.g. after a security violation)."""
    system = get_airport_system()

    user = get_jwt_identity()
    if user.get("role") == StaffRole.AirlineStaff.value:
        bags = system.get_bags(bag_id=bag_id)
        if not bags:
            return jsonify({"error": f"Bag {bag_id} not found"}), 404
        if bags[0].airline_code != user.get("airline_code"):
            return jsonify({"error": "Cannot remove bags from a different airline"}), 403

    try:
        system.remove_bag(bag_id)
    except ValueError as e:
        return jsonify({"error": str(e)}), 404
    return jsonify({"message": f"Bag {bag_id} removed"}), 200


@bp.delete("/passenger/<ticket_number>")
@role_required(StaffRole.Admin, StaffRole.AirlineStaff)
def remove_bags_by_passenger(ticket_number):
    """Removes all bags for a passenger. Used as part of the security violation flow."""
    system = get_airport_system()

    user = get_jwt_identity()
    if user.get("role") == StaffRole.AirlineStaff.value:
        try:
            passenger = system.get_passenger(ticket_number)
        except ValueError as e:
            return jsonify({"error": str(e)}), 404
        if passenger.airline_code != user.get("airline_code"):
            return jsonify({"error": "Cannot remove bags from a different airline"}), 403

    system.remove_bags_by_passenger(ticket_number)
    return jsonify({"message": f"All bags for passenger {ticket_number} removed"}), 200