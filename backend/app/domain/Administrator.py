from __future__ import annotations
from typing import Optional
from app.enums import BoardType
from app.domain.Staff import _StaffBase

class Administrator(_StaffBase):
    def __init__(self, username: str, password_hash: str):
        super().__init__(username, password_hash)

    # Getters
    def get_username(self)      -> str: return self.username
    def get_password_hash(self) -> str: return self.password_hash