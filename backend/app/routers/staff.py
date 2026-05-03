from flask import Blueprint, request, jsonify
from app.AirportSystemMain import get_airport_system
from app.domain.Staff import _StaffBase
from app.domain.AirlineStaff import AirlineStaff
from app.domain.GateStaff import GateStaff
from app.domain.GroundStaff import GroundStaff
from app.enums import StaffRole
from app.utils.auth import role_required
from app.utils.validators import validate_staff_body

bp = Blueprint("staff", __name__, url_prefix="/staff")

# Valid role strings accepted in the request body
VALID_ROLES = {r.value for r in StaffRole} - {StaffRole.Admin.value}


@bp.get("")
@role_required(StaffRole.Admin)
def get_all_staff():
    """Admin only: returns all staff, optionally filtered by ?role="""
    role_filter = request.args.get("role")
    system      = get_airport_system()
    return jsonify(system.get_all_staff(role_filter)), 200


@bp.get("/<username>")
@role_required(StaffRole.Admin)
def get_staff_member(username):
    """Admin only: returns a single staff member's details."""
    system = get_airport_system()
    try:
        return jsonify(system.get_staff_member(username)), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 404


@bp.post("")
@role_required(StaffRole.Admin)
def add_staff():
    """
    Admin only: creates a new staff member.
    Username and password are auto-generated — returned in the response for testing.
    In production the temporary password should be emailed to the new user.
    """
    data = request.get_json(silent=True)
    if not data:
        return jsonify({"error": "Request body must be JSON"}), 400

    try:
        clean = validate_staff_body(data)
    except ValueError as e:
        return jsonify({"error": str(e)}), 400

    role = clean["role"]
    if role not in VALID_ROLES:
        return jsonify({"error": f"role must be one of: {sorted(VALID_ROLES)}"}), 400

    # Validate airline requirements
    if role in ("Airline Staff", "Gate Staff"):
        if not clean["airline_code"]:
            return jsonify({"error": f"{role} must be associated with an airline"}), 400
    elif role == "Ground Staff" and clean["airline_code"]:
        return jsonify({"error": "Ground staff are not associated with any airline"}), 400

    # Construct the appropriate domain object
    # Username and password_hash are left empty — DBInterfaceStaff.store_staff() fills them
    if role == "Airline Staff":
        staff_data = AirlineStaff(
            "", "", clean["firstname"], clean["lastname"],
            clean["email"], clean["phone"], clean["airline_code"]
        )
    elif role == "Gate Staff":
        staff_data = GateStaff(
            "", "", clean["firstname"], clean["lastname"],
            clean["email"], clean["phone"], clean["airline_code"]
        )
    else:
        staff_data = GroundStaff(
            "", "", clean["firstname"], clean["lastname"],
            clean["email"], clean["phone"]
        )

    system = get_airport_system()
    try:
        result = system.add_staff(role, staff_data)
    except ValueError as e:
        return jsonify({"error": str(e)}), 404

    return jsonify({
        "message":            "Staff member created successfully",
        "username":           result["username"],
        "temporary_password": result["temporary_password"],
        "note":               "User must change password on first login",
    }), 201


@bp.delete("/<username>")
@role_required(StaffRole.Admin)
def remove_staff(username):
    """Admin only: removes a staff member and their login credentials."""
    system = get_airport_system()
    try:
        system.remove_staff(username)
    except ValueError as e:
        return jsonify({"error": str(e)}), 404
    return jsonify({"message": f"Staff member {username} removed"}), 200