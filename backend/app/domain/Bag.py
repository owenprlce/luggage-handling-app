from __future__ import annotations
from app.enums import BagLocationType


class Bag:
    def __init__(
        self,
        bag_id:        str,
        ticket_number: str,
        flight_id:     str,
        airline_code:  str,
        location_type: BagLocationType = BagLocationType.CheckInCounter,
        location:      str = "Check-in counter",
    ):
        self.bag_id        = bag_id
        self.ticket_number = ticket_number
        self.flight_id     = flight_id
        self.airline_code  = airline_code
        self.location_type = location_type
        self.location      = location

    # Getters
    def get_bag_id(self)        -> str:            return self.bag_id
    def get_ticket_number(self) -> str:            return self.ticket_number
    def get_flight_id(self)     -> str:            return self.flight_id
    def get_airline_code(self)  -> str:            return self.airline_code
    def get_location_type(self) -> BagLocationType: return self.location_type
    def get_location(self)      -> str:            return self.location

    # Business logic
    def update_location(self, new_type: BagLocationType, detail: str = "") -> None:
        self.location_type = new_type
        if detail:
            self.location = f"{new_type.value} - {detail}"
        else:
            self.location = new_type.value

    def is_at_gate(self) -> bool:
        return self.location_type == BagLocationType.Gate

    def is_loaded(self) -> bool:
        return self.location_type == BagLocationType.Loaded

    def get_bag_location(self) -> str:
        return self.location

    def to_dict(self) -> dict:
        return {
            "bag_id":        self.bag_id,
            "ticket_number": self.ticket_number,
            "flight_id":     self.flight_id,
            "airline_code":  self.airline_code,
            "location":      self.location,
        }

    @classmethod
    def from_dict(cls, data: dict) -> "Bag":
        location_str = data.get("location", "Check-in counter")

        # Infer the enum type from the stored location string
        if location_str.startswith(BagLocationType.Loaded.value):
            loc_type = BagLocationType.Loaded
        elif location_str.startswith(BagLocationType.Gate.value):
            loc_type = BagLocationType.Gate
        elif location_str.startswith(BagLocationType.SecurityCheck.value):
            loc_type = BagLocationType.SecurityCheck
        else:
            loc_type = BagLocationType.CheckInCounter

        return cls(
            bag_id        = data["bag_id"],
            ticket_number = data["ticket_number"],
            flight_id     = data["flight_id"],
            airline_code  = data["airline_code"],
            location_type = loc_type,
            location      = location_str,
        )