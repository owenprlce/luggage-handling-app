from __future__ import annotations
from typing import Optional
from app.enums import BoardType
from app.domain.Staff import _StaffBase

class AirlineStaff(_StaffBase):
    def __init__(
        self,
        username:      str,
        password_hash: str,
        first_name:    str,
        last_name:     str,
        email:         str,
        phone:         str,
        airline_code:  str,
    ):
        super().__init__(username, password_hash)
        self.first_name   = first_name
        self.last_name    = last_name
        self.email        = email
        self.phone        = phone
        self.airline_code = airline_code

    # Getters
    def get_first_name(self)   -> str: return self.first_name
    def get_last_name(self)    -> str: return self.last_name
    def get_email(self)        -> str: return self.email
    def get_phone(self)        -> str: return self.phone
    def get_airline_code(self) -> str: return self.airline_code

    def to_dict(self) -> dict:
        return {
            "username":     self.username,
            "firstname":    self.first_name,
            "lastname":     self.last_name,
            "email":        self.email,
            "phone":        self.phone,
            "airline_code": self.airline_code,
            "role":         "Airline Staff",
        }
