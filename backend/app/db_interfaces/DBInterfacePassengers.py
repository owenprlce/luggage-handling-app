from app.database import get_connection
from app.domain.Passenger import Passenger
from app.enums import PassengerStatus


class DBInterfacePassengers:

    def store_passenger(self, passenger: Passenger) -> None:
        conn, cursor = get_connection()
        try:
            # One entry per passenger (no duplicate identification)
            cursor.execute(
                "SELECT ticket_number FROM Passenger WHERE identification = %s",
                (passenger.identification,)
            )
            if cursor.fetchone():
                raise ValueError("Passenger already has a ticket in the system")

            # Flight must exist
            cursor.execute(
                "SELECT flight_id FROM Flight WHERE flight_id = %s",
                (passenger.flight_id,)
            )
            if not cursor.fetchone():
                raise ValueError(f"Flight {passenger.flight_id} not found in the system")

            cursor.execute(
                """INSERT INTO Passenger
                   (ticket_number, firstname, lastname, identification,
                    passenger_status, flight_id, airline_code)
                   VALUES (%s, %s, %s, %s, %s, %s, %s)""",
                (
                    passenger.ticket_number,
                    passenger.first_name,
                    passenger.last_name,
                    passenger.identification,
                    passenger.status.value,
                    passenger.flight_id,
                    passenger.airline_code,
                )
            )
            conn.commit()
        finally:
            cursor.close()
            conn.close()

    def retrieve_passenger(self, ticket_number: str) -> Passenger | None:
        conn, cursor = get_connection()
        try:
            cursor.execute(
                "SELECT * FROM Passenger WHERE ticket_number = %s",
                (ticket_number,)
            )
            row = cursor.fetchone()
            return Passenger.from_dict(row) if row else None
        finally:
            cursor.close()
            conn.close()

    def retrieve_passengers_by_flight(self, flight_id: str) -> list[Passenger]:
        conn, cursor = get_connection()
        try:
            cursor.execute(
                "SELECT * FROM Passenger WHERE flight_id = %s",
                (flight_id.upper(),)
            )
            return [Passenger.from_dict(row) for row in cursor.fetchall()]
        finally:
            cursor.close()
            conn.close()

    def retrieve_all_passengers(self, airline_code: str | None = None) -> list[Passenger]:
        conn, cursor = get_connection()
        try:
            if airline_code:
                cursor.execute(
                    "SELECT * FROM Passenger WHERE airline_code = %s",
                    (airline_code,)
                )
            else:
                cursor.execute("SELECT * FROM Passenger")
            return [Passenger.from_dict(row) for row in cursor.fetchall()]
        finally:
            cursor.close()
            conn.close()

    def update_passenger_status(
        self, ticket_number: str, status: PassengerStatus
    ) -> None:
        conn, cursor = get_connection()
        try:
            cursor.execute(
                "UPDATE Passenger SET passenger_status = %s WHERE ticket_number = %s",
                (status.value, ticket_number)
            )
            conn.commit()
        finally:
            cursor.close()
            conn.close()

    def remove_passenger(self, ticket_number: str) -> None:
        conn, cursor = get_connection()
        try:
            cursor.execute(
                "DELETE FROM Passenger WHERE ticket_number = %s",
                (ticket_number,)
            )
            conn.commit()
        finally:
            cursor.close()
            conn.close()