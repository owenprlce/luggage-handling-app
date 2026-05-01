import re
from typing import Optional


# Validators, we might validate in the frontend

def validate_flight_id(value: str) -> str:
    """Must be exactly 2 letters + 4 digits, e.g. 'AA1000'."""
    if not re.match(r"^[A-Za-z]{2}\d{4}$", value):
        raise ValueError("flight_id must be 2 letters followed by 4 digits (e.g. AA1000)")
    return value.upper()


def validate_airline_code(value: str) -> str:
    """Must be exactly 2 uppercase letters, e.g. 'AA'."""
    if not re.match(r"^[A-Za-z]{2}$", value):
        raise ValueError("airline_code must be exactly 2 letters (e.g. AA)")
    return value.upper()


def validate_ticket_number(value: str) -> str:
    """Must be exactly 10 digits."""
    if not re.match(r"^\d{10}$", str(value)):
        raise ValueError("ticket_number must be exactly 10 digits")
    return str(value)


def validate_identification(value: str) -> str:
    """Must be exactly 6 digits."""
    if not re.match(r"^\d{6}$", str(value)):
        raise ValueError("identification must be exactly 6 digits")
    return str(value)


def validate_bag_id(value: str) -> str:
    """Must be exactly 6 digits."""
    if not re.match(r"^\d{6}$", str(value)):
        raise ValueError("bag_id must be exactly 6 digits")
    return str(value)


def validate_name(value: str, field: str = "Name") -> str:
    """Must be at least 2 non-whitespace characters."""
    if len(value.strip()) < 2:
        raise ValueError(f"{field} must be at least 2 characters long")
    return value.strip()


def validate_phone(value: str) -> str:
    """Must be exactly 10 digits, first digit not zero."""
    if not re.match(r"^[1-9]\d{9}$", str(value)):
        raise ValueError("Phone must be 10 digits and must not start with 0")
    return str(value)


def validate_email(value: str) -> str:
    """Minimal format check: must match X@X.X pattern."""
    if not re.match(r"^[^@\s]+@[^@\s]+\.[^@\s]+$", value):
        raise ValueError("Email must be in a valid format (e.g. user@example.com)")
    return value.strip()


def validate_password(value: str) -> str:
    """
    Must be at least 6 characters and contain at least one uppercase letter,
    one lowercase letter, and one digit.
    """
    if len(value) < 6:
        raise ValueError("Password must be at least 6 characters long")
    if not re.search(r"[A-Z]", value):
        raise ValueError("Password must contain at least one uppercase letter")
    if not re.search(r"[a-z]", value):
        raise ValueError("Password must contain at least one lowercase letter")
    if not re.search(r"\d", value):
        raise ValueError("Password must contain at least one number")
    return value


# ── Request body validators ───────────────────────────────────────────────────
# Each function accepts a parsed JSON dict and returns a cleaned copy,
# or raises ValueError if any field is invalid or missing.

def validate_required(data: dict, *fields: str) -> None:
    """Raises ValueError if any of the given fields are missing from data."""
    missing = [f for f in fields if f not in data or data[f] is None]
    if missing:
        raise ValueError(f"Missing required fields: {', '.join(missing)}")


def validate_flight_body(data: dict) -> dict:
    validate_required(data, "flight_id", "destination", "gate_number", "terminal", "airline_code")
    return {
        "flight_id":    validate_flight_id(data["flight_id"]),
        "destination":  data["destination"].strip(),
        "gate_number":  str(data["gate_number"]).strip(),
        "terminal":     data["terminal"].strip().upper(),
        "airline_code": validate_airline_code(data["airline_code"]),
    }


def validate_passenger_body(data: dict) -> dict:
    validate_required(data, "ticket_number", "firstname", "lastname",
                      "identification", "flight_id", "airline_code")
    return {
        "ticket_number":  validate_ticket_number(data["ticket_number"]),
        "firstname":      validate_name(data["firstname"], "First name"),
        "lastname":       validate_name(data["lastname"],  "Last name"),
        "identification": validate_identification(data["identification"]),
        "flight_id":      validate_flight_id(data["flight_id"]),
        "airline_code":   validate_airline_code(data["airline_code"]),
    }


def validate_bag_body(data: dict) -> dict:
    validate_required(data, "bag_id", "ticket_number", "flight_id", "airline_code")
    return {
        "bag_id":        validate_bag_id(data["bag_id"]),
        "ticket_number": validate_ticket_number(data["ticket_number"]),
        "flight_id":     validate_flight_id(data["flight_id"]),
        "airline_code":  validate_airline_code(data["airline_code"]),
    }


def validate_staff_body(data: dict) -> dict:
    validate_required(data, "firstname", "lastname", "email", "phone", "role")
    cleaned = {
        "firstname":    validate_name(data["firstname"], "First name"),
        "lastname":     validate_name(data["lastname"],  "Last name"),
        "email":        validate_email(data["email"]),
        "phone":        validate_phone(str(data["phone"])),
        "role":         data["role"].strip(),
        "airline_code": None,
    }
    if data.get("airline_code"):
        cleaned["airline_code"] = validate_airline_code(data["airline_code"])
    return cleaned


def validate_message_body(data: dict) -> dict:
    validate_required(data, "board_type", "sender_username", "sender_role", "content", "category")
    return {
        "board_type":      data["board_type"].strip(),
        "sender_username": data["sender_username"].strip(),
        "sender_role":     data["sender_role"].strip(),
        "content":         data["content"].strip(),
        "category":        data["category"].strip(),
        "airline_code":    data.get("airline_code"),
    }