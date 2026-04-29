from __future__ import annotations
from datetime import datetime, timezone
from typing import Optional
from app.enums import BoardType
from app.domain.Message import Message

class MessageBoard:
    def __init__(self, board_type: BoardType, messages: list[Message] | None = None):
        self.board_type = board_type
        self.messages   = messages or []

    # Getters
    def get_board_type(self) -> BoardType:       return self.board_type
    def get_messages(self)   -> list[Message]:   return self.messages

    # Business logic
    def add_message(self, message: Message) -> None:
        self.messages.append(message)

    def get_messages_by_type(self, board_type: BoardType) -> list[Message]:
        if self.board_type == board_type:
            return self.messages
        return []