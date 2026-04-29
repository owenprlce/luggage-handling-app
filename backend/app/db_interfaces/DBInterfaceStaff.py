import random
import string
import bcrypt

from app.database import get_connection
from app.domain.Administrator import Administrator
from app.domain.AirlineStaff import AirlineStaff
from app.domain.GateStaff import GateStaff
from app.domain.GroundStaff import GroundStaff
from app.domain.Staff import _StaffBase

from app.enums import StaffRole

class DBInterfaceStaff:

    # Username / password generation ---
    @staticmethod
    def generate_username(first_name: str, last_name: str, cursor) -> str:
        base = (first_name[0] + last_name[:4]).title()
        for _ in range(10):
            digits   = "".join(random.choices(string.digits, k=2))
            username = f"{base}{digits}"
            cursor.execute(
                "SELECT username FROM Staff_Login WHERE username = %s", (username,)
            )
            if not cursor.fetchone():
                return username
        raise RuntimeError("Could not generate a unique username after 10 attempts")

    @staticmethod
    def generate_password() -> str:
        upper = random.choice(string.ascii_uppercase)
        lower = random.choice(string.ascii_lowercase)
        digit = random.choice(string.digits)
        rest  = "".join(random.choices(string.ascii_letters + string.digits, k=5))
        chars = list(upper + lower + digit + rest)
        random.shuffle(chars)
        return "".join(chars)

    # --- DB interface methods from design document ---

    def store_staff(self, staff_data: object, db_login) -> dict:
        conn, cursor = get_connection()
        try:
            # Determine role string from the domain object type
            if isinstance(staff_data, AirlineStaff):
                role = StaffRole.AirlineStaff.value
            elif isinstance(staff_data, GateStaff):
                role = StaffRole.GateStaff.value
            elif isinstance(staff_data, GroundStaff):
                role = StaffRole.GroundStaff.value
            else:
                raise ValueError("Unknown staff type")

            username       = self.generate_username(staff_data.first_name, staff_data.last_name, cursor)
            plain_password = self.generate_password()
            password_hash  = bcrypt.hashpw(plain_password.encode(), bcrypt.gensalt()).decode()

            # Insert login credentials first (Staff has a FK to Staff_Login)
            cursor.execute(
                "INSERT INTO Staff_Login (username, user_password, user_role) VALUES (%s, %s, %s)",
                (username, password_hash, role)
            )

            # Insert staff details
            airline_code = getattr(staff_data, "airline_code", None)
            cursor.execute(
                """INSERT INTO Staff (username, firstname, lastname, email, phone, airline_code)
                   VALUES (%s, %s, %s, %s, %s, %s)""",
                (
                    username,
                    staff_data.first_name,
                    staff_data.last_name,
                    staff_data.email,
                    staff_data.phone,
                    airline_code,
                )
            )
            conn.commit()

            return {
                "username":           username,
                "temporary_password": plain_password,  # send via email in production
            }
        finally:
            cursor.close()
            conn.close()

    def retrieve_staff(self, username: str) -> dict | None:
        conn, cursor = get_connection()
        try:
            cursor.execute(
                """SELECT s.username, s.firstname, s.lastname, s.email, s.phone,
                          s.airline_code, sl.user_role AS role
                   FROM Staff s
                   JOIN Staff_Login sl ON s.username = sl.username
                   WHERE s.username = %s""",
                (username,)
            )
            return cursor.fetchone()
        finally:
            cursor.close()
            conn.close()

    def retrieve_all_staff(self, role: str | None = None) -> list[dict]:
        conn, cursor = get_connection()
        try:
            if role:
                cursor.execute(
                    """SELECT s.username, s.firstname, s.lastname, s.email, s.phone,
                              s.airline_code, sl.user_role AS role
                       FROM Staff s
                       JOIN Staff_Login sl ON s.username = sl.username
                       WHERE sl.user_role = %s""",
                    (role,)
                )
            else:
                cursor.execute(
                    """SELECT s.username, s.firstname, s.lastname, s.email, s.phone,
                              s.airline_code, sl.user_role AS role
                       FROM Staff s
                       JOIN Staff_Login sl ON s.username = sl.username"""
                )
            return cursor.fetchall()
        finally:
            cursor.close()
            conn.close()

    def remove_staff(self, username: str) -> None:
        conn, cursor = get_connection()
        try:
            cursor.execute(
                "DELETE FROM Staff_Login WHERE username = %s", (username,)
            )
            conn.commit()
        finally:
            cursor.close()
            conn.close()