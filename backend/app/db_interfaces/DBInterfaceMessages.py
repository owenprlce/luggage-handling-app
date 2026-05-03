from datetime import datetime, timezone
from app.database import get_connection
from app.domain.Message import Message 
from app.domain.MessageBoard import MessageBoard
from app.enums import BoardType


class DBInterfaceMessages:

    def store_message(self, message: Message, board_type: BoardType, airline_code: str | None = None) -> None:
        conn, cursor = get_connection()
        try:
            cursor.execute(
                """INSERT INTO Message
                   (content, category, created_at, board_type, sender_username,
                    sender_role, airline_code)
                   VALUES (%s, %s, %s, %s, %s, %s, %s)""",
                (
                    message.content,
                    message.category,
                    message.created_at,
                    board_type.value,
                    message.sender_username,
                    message.sender_role,
                    airline_code or message.sender_airline,
                )
            )
            conn.commit()
        finally:
            cursor.close()
            conn.close()

    def retrieve_messages(self, board_type: BoardType, airline_code: str | None = None) -> list[Message]:
        conn, cursor = get_connection()
        try:
            if board_type == BoardType.AirlineBoard and airline_code:
                cursor.execute(
                    """SELECT * FROM Message
                       WHERE board_type = %s AND (airline_code = %s OR airline_code IS NULL)
                       ORDER BY created_at DESC""",
                    (board_type.value, airline_code)
                )
            else:
                cursor.execute(
                    "SELECT * FROM Message WHERE board_type = %s ORDER BY created_at DESC",
                    (board_type.value,)
                )
            return [Message.from_dict(row) for row in cursor.fetchall()]
        finally:
            cursor.close()
            conn.close()

    def get_message_board(self, board_type: BoardType, airline_code: str | None = None) -> MessageBoard:
        messages = self.retrieve_messages(board_type, airline_code)
        return MessageBoard(board_type=board_type, messages=messages)