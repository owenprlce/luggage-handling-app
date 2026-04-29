from __future__ import annotations
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    pass  # avoid circular imports if needed later

class Flight:
    def __init__(
        self,
        flight_id: str,
        airline_name: str,
        destination: str,
        terminal: str,
        gate_number: str,
        airline_code: str,
        ticket_numbers: list[str] | None = None,
        flight_status: str = "Not Departed",
    ):
        self.flight_id      = flight_id
        self.airline_name   = airline_name
        self.destination    = destination
        self.terminal       = terminal
        self.gate_number    = gate_number
        self.airline_code   = airline_code
        self.ticket_numbers = ticket_numbers or []
        self.flight_status  = flight_status

    # Getters
    def get_flight_id(self)      -> str:        return self.flight_id
    def get_airline_name(self)   -> str:        return self.airline_name
    def get_destination(self)    -> str:        return self.destination
    def get_terminal(self)       -> str:        return self.terminal
    def get_gate_number(self)    -> str:        return self.gate_number
    def get_airline_code(self)   -> str:        return self.airline_code
    def get_ticket_numbers(self) -> list[str]:  return self.ticket_numbers
    def get_flight_status(self)  -> str:        return self.flight_status

    # Business Logic
    def update_gate(self, new_terminal: str, new_gate_number: str) -> None:
        self.terminal    = new_terminal
        self.gate_number = new_gate_number

    def add_passenger(self, ticket_number: str) -> None:
        if ticket_number not in self.ticket_numbers:
            self.ticket_numbers.append(ticket_number)

    def remove_passenger(self, ticket_number: str) -> None:
        if ticket_number in self.ticket_numbers:
            self.ticket_numbers.remove(ticket_number)

    def all_passengers_boarded(self, passengers: list) -> bool:
        from app.enums import PassengerStatus
        return all(p.status == PassengerStatus.Boarded for p in passengers)

    def all_bags_loaded(self, bags: list) -> bool:
        from app.enums import BagLocationType
        return all(b.location_type == BagLocationType.Loaded for b in bags)

    def to_dict(self) -> dict:
        return {
            "flight_id":      self.flight_id,
            "airline_name":   self.airline_name,
            "destination":    self.destination,
            "terminal":       self.terminal,
            "gate_number":    self.gate_number,
            "airline_code":   self.airline_code,
            "ticket_numbers": self.ticket_numbers,
            "flight_status":  self.flight_status,
        }

    @classmethod
    def from_dict(cls, data: dict) -> "Flight":
        return cls(
            flight_id      = data["flight_id"],
            airline_name   = data.get("airline_name", ""),
            destination    = data["destination"],
            terminal       = data["terminal"],
            gate_number    = data["gate_number"],
            airline_code   = data["airline_code"],
            ticket_numbers = data.get("ticket_numbers", []),
            flight_status  = data.get("flight_status", "Not Departed"),
        )