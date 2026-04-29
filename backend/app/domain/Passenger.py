from __future__ import annotations
from app.enums import PassengerStatus


class Passenger:

    def __init__(
        self,
        ticket_number:  str,
        first_name:     str,
        last_name:      str,
        identification: str,
        flight_id:      str,
        airline_code:   str,
        status:         PassengerStatus = PassengerStatus.NotCheckedIn,
    ):
        self.ticket_number  = ticket_number
        self.first_name     = first_name
        self.last_name      = last_name
        self.identification = identification
        self.flight_id      = flight_id
        self.airline_code   = airline_code
        self.status         = status

    # Getters
    def get_ticket_number(self)  -> str:             return self.ticket_number
    def get_first_name(self)     -> str:             return self.first_name
    def get_last_name(self)      -> str:             return self.last_name
    def get_identification(self) -> str:             return self.identification
    def get_flight_id(self)      -> str:             return self.flight_id
    def get_airline_code(self)   -> str:             return self.airline_code
    def get_status(self)         -> PassengerStatus: return self.status

    # Business logic
    def update_status(self, new_status: PassengerStatus) -> None:
        self.status = new_status

    def to_dict(self) -> dict:
        return {
            "ticket_number":  self.ticket_number,
            "firstname":      self.first_name,
            "lastname":       self.last_name,
            "identification": self.identification,
            "flight_id":      self.flight_id,
            "airline_code":   self.airline_code,
            "passenger_status": self.status.value,
        }

    @classmethod
    def from_dict(cls, data: dict) -> "Passenger":
        return cls(
            ticket_number  = data["ticket_number"],
            first_name     = data["firstname"],
            last_name      = data["lastname"],
            identification = data["identification"],
            flight_id      = data["flight_id"],
            airline_code   = data["airline_code"],
            status         = PassengerStatus(data.get("passenger_status", "Not-checked-in")),
        )