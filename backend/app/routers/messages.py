from flask import Blueprint, request, jsonify
from app.AirportSystemMain import get_airport_system
from app.enums import BoardType, StaffRole
from app.utils.auth import jwt_required, get_jwt_identity
from app.utils.validators import validate_message_body

bp = Blueprint("messages", __name__, url_prefix="/messages")

# Maps BoardType → which roles may read it
BOARD_READ_PERMISSIONS = {
    BoardType.AirlineBoard: ["Airline Staff", "Admin"],
    BoardType.GateBoard:    ["Gate Staff",    "Admin"],
    BoardType.GroundBoard:  ["Ground Staff",  "Admin"],
    BoardType.AdminBoard:   ["Admin"],
}


@bp.get("")
@jwt_required
def get_messages():
    """
    Returns messages for the given ?board_type= query param.
    Enforces read permissions based on the caller's role.
    Airline staff also only see messages for their own airline.

    Valid board_type values: "Airline", "Gate", "Ground", "Admin"
    """
    board_type_str = request.args.get("board_type", "").strip()
    if not board_type_str:
        return jsonify({"error": "board_type query parameter is required"}), 400

    try:
        board_enum = BoardType(board_type_str)
    except ValueError:
        valid = [b.value for b in BoardType]
        return jsonify({"error": f"Invalid board_type. Must be one of: {valid}"}), 400

    user = get_jwt_identity()
    role = user.get("role")

    allowed = BOARD_READ_PERMISSIONS.get(board_enum, [])
    if role not in allowed:
        return jsonify({"error": f"Access denied. This board is restricted to: {allowed}"}), 403

    # Airline staff only see messages for their own airline
    airline_code = user.get("airline_code") if role == "Airline Staff" else None

    system = get_airport_system()
    board  = system.get_board_messages(board_enum, airline_code)
    return jsonify([m.to_dict() for m in board.get_messages()]), 200


@bp.post("")
@jwt_required
def post_message():
    """
    Posts a message to a board. Any logged-in staff member can post.
    Body: {"board_type", "sender_username", "sender_role", "content",
           "category", "airline_code" (optional)}
    """
    data = request.get_json(silent=True)
    if not data:
        return jsonify({"error": "Request body must be JSON"}), 400

    try:
        clean = validate_message_body(data)
    except ValueError as e:
        return jsonify({"error": str(e)}), 400

    try:
        board_enum = BoardType(clean["board_type"])
    except ValueError:
        valid = [b.value for b in BoardType]
        return jsonify({"error": f"Invalid board_type. Must be one of: {valid}"}), 400

    system = get_airport_system()
    system.post_board_message(
        board_type      = board_enum,
        sender_username = clean["sender_username"],
        sender_role     = clean["sender_role"],
        content         = clean["content"],
        category        = clean["category"],
        airline_code    = clean.get("airline_code"),
    )
    return jsonify({"message": "Message posted successfully"}), 201