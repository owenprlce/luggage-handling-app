from __future__ import annotations
from datetime import datetime, timezone
from typing import Optional
from app.enums import BoardType


class Message:
    def __init__(
        self,
        message_id:      int,
        content:         str,
        category:        str,
        created_at:      datetime,
        sender_username: str,
        sender_role:     str,
        sender_airline:  Optional[str] = None,
    ):
        self.message_id      = message_id
        self.content         = content
        self.category        = category
        self.created_at      = created_at
        self.sender_username = sender_username
        self.sender_role     = sender_role
        self.sender_airline  = sender_airline

    # Getters
    def get_message_id(self)      -> int:             return self.message_id
    def get_content(self)         -> str:             return self.content
    def get_category(self)        -> str:             return self.category
    def get_created_at(self)      -> datetime:        return self.created_at
    def get_sender_username(self) -> str:             return self.sender_username
    def get_sender_role(self)     -> str:             return self.sender_role
    def get_sender_airline(self)  -> Optional[str]:   return self.sender_airline

    def to_dict(self) -> dict:
        return {
            "message_id":      self.message_id,
            "content":         self.content,
            "category":        self.category,
            "created_at":      self.created_at.isoformat(),
            "sender_username": self.sender_username,
            "sender_role":     self.sender_role,
            "sender_airline":  self.sender_airline,
        }

    @classmethod
    def from_dict(cls, data: dict) -> "Message":
        created_at = data.get("created_at")
        if isinstance(created_at, str):
            created_at = datetime.fromisoformat(created_at)
        elif created_at is None:
            created_at = datetime.now(timezone.utc)

        return cls(
            message_id      = data.get("msg_id", 0),
            content         = data["content"],
            category        = data["category"],
            created_at      = created_at,
            sender_username = data.get("sender_username", data.get("username", "")),
            sender_role     = data.get("sender_role", ""),
            sender_airline  = data.get("sender_airline", data.get("airline_code")),
        )


