from flask import Blueprint, jsonify
from app.AirportSystemMain import get_airport_system
from app.enums import StaffRole
from app.utils.auth import role_required, get_jwt_identity

bp = Blueprint("departure", __name__, url_prefix="/departure")


@bp.get("/<flight_id>/ready")
@role_required(StaffRole.GateStaff, StaffRole.Admin)
def check_departure_readiness(flight_id):
    """
    Gate Staff: checks whether all passengers are boarded and all bags loaded.
    Returns a detailed breakdown so gate staff can see exactly what is still pending.
    Delegates to AirportSystemMain.report_ready_for_departure().
    """
    system = get_airport_system()

    try:
        flight = system.get_flight(flight_id)
    except ValueError as e:
        return jsonify({"error": str(e)}), 404

    # Gate staff may only check their own airline's flights
    user         = get_jwt_identity()
    role         = user.get("role")
    airline_code = user.get("airline_code")
    if role == "Gate Staff" and flight.airline_code != airline_code:
        return jsonify({"error": "This flight belongs to a different airline"}), 403

    ready      = system.report_ready_for_departure(flight_id)
    passengers = system.get_all_passengers(flight_id=flight_id)
    bags       = system.get_bags(flight_id=flight_id)

    not_boarded = [
        {"ticket_number": p.ticket_number, "name": f"{p.first_name} {p.last_name}"}
        for p in passengers
        if p.status.value != "Boarded"
    ]
    not_loaded = [b.bag_id for b in bags if not b.is_loaded()]

    return jsonify({
        "flight_id":              flight_id.upper(),
        "ready_for_departure":    ready,
        "passengers_not_boarded": not_boarded,
        "bags_not_loaded":        not_loaded,
        "total_passengers":       len(passengers),
        "total_bags":             len(bags),
    }), 200


@bp.post("/<flight_id>/depart")
@role_required(StaffRole.Admin)
def confirm_departure(flight_id):
    """
    Admin: confirms departure and removes the flight plus all associated
    passengers and bags from the system (via DB cascade).
    Gate staff should call GET /departure/<id>/ready first to confirm readiness,
    then post a message to the Admin board, then admin calls this endpoint.
    """
    system = get_airport_system()
    try:
        system.remove_flight(flight_id)
    except ValueError as e:
        return jsonify({"error": str(e)}), 404

    return jsonify({
        "message": f"Flight {flight_id.upper()} has departed. All records removed from the system."
    }), 200