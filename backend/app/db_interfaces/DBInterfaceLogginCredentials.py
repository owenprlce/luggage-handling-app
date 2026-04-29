import bcrypt
from app.database import get_connection

class DBInterfaceLoginCredentials:

    def validate_login(self, username: str, password: str) -> bool:
        conn, cursor = get_connection()
        try:
            cursor.execute(
                "SELECT user_password FROM Staff_Login WHERE username = %s",
                (username,)
            )
            record = cursor.fetchone()
            if not record:
                return False
            return bcrypt.checkpw(password.encode(), record["user_password"].encode())
        finally:
            cursor.close()
            conn.close()

    def get_role(self, username: str) -> str | None:
        conn, cursor = get_connection()
        try:
            cursor.execute(
                "SELECT user_role FROM Staff_Login WHERE username = %s",
                (username,)
            )
            record = cursor.fetchone()
            return record["user_role"] if record else None
        finally:
            cursor.close()
            conn.close()

    def store_credentials(self, username: str, password_hash: str, role: str) -> None:
        conn, cursor = get_connection()
        try:
            cursor.execute(
                "INSERT INTO Staff_Login (username, user_password, user_role) VALUES (%s, %s, %s)",
                (username, password_hash, role)
            )
            conn.commit()
        finally:
            cursor.close()
            conn.close()

    def update_password(self, username: str, new_password_hash: str) -> None:
        conn, cursor = get_connection()
        try:
            cursor.execute(
                "UPDATE Staff_Login SET user_password = %s WHERE username = %s",
                (new_password_hash, username)
            )
            conn.commit()
        finally:
            cursor.close()
            conn.close()

    def remove_credentials(self, username: str) -> None:
        conn, cursor = get_connection()
        try:
            cursor.execute("DELETE FROM Staff_Login WHERE username = %s", (username,))
            conn.commit()
        finally:
            cursor.close()
            conn.close()