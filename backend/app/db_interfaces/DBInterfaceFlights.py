from app.database import get_connection
from app.domain.Flight import Flight


class DBInterfaceFlights:

    def store_flight(self, flight: Flight) -> None:

        conn, cursor = get_connection()
        try:
            # Enforce: at most one flight per gate
            cursor.execute(
                "SELECT flight_id FROM Flight WHERE terminal = %s AND gate_number = %s",
                (flight.terminal, flight.gate_number)
            )
            if cursor.fetchone():
                raise ValueError(
                    f"Gate {flight.gate_number} in Terminal {flight.terminal} is already occupied"
                )

            cursor.execute(
                """INSERT INTO Flight (flight_id, destination, gate_number, terminal,
                   flight_status, airline_code)
                   VALUES (%s, %s, %s, %s, %s, %s)""",
                (
                    flight.flight_id,
                    flight.destination,
                    flight.gate_number,
                    flight.terminal,
                    flight.flight_status,
                    flight.airline_code,
                )
            )
            conn.commit()
        finally:
            cursor.close()
            conn.close()

    def retrieve_flight(self, flight_id: str) -> Flight | None:
        conn, cursor = get_connection()
        try:
            cursor.execute(
                """SELECT f.*, a.airline_name
                   FROM Flight f
                   JOIN Airline a ON f.airline_code = a.airline_code
                   WHERE f.flight_id = %s""",
                (flight_id.upper(),)
            )
            row = cursor.fetchone()
            return Flight.from_dict(row) if row else None
        finally:
            cursor.close()
            conn.close()

    def retrieve_all_flights(self, airline_code: str | None = None) -> list[Flight]:
        conn, cursor = get_connection()
        try:
            if airline_code:
                cursor.execute(
                    """SELECT f.*, a.airline_name FROM Flight f
                       JOIN Airline a ON f.airline_code = a.airline_code
                       WHERE f.airline_code = %s""",
                    (airline_code,)
                )
            else:
                cursor.execute(
                    "SELECT f.*, a.airline_name FROM Flight f JOIN Airline a ON f.airline_code = a.airline_code"
                )
            return [Flight.from_dict(row) for row in cursor.fetchall()]
        finally:
            cursor.close()
            conn.close()

    def retrieve_flight_at_gate(self, terminal: str, gate_number: str) -> Flight | None:
        conn, cursor = get_connection()
        try:
            cursor.execute(
                """SELECT f.*, a.airline_name FROM Flight f
                   JOIN Airline a ON f.airline_code = a.airline_code
                   WHERE f.terminal = %s AND f.gate_number = %s""",
                (terminal.upper(), gate_number)
            )
            row = cursor.fetchone()
            return Flight.from_dict(row) if row else None
        finally:
            cursor.close()
            conn.close()

    def update_flight_gate(
        self, flight_id: str, new_terminal: str, new_gate_number: str
    ) -> None:
        conn, cursor = get_connection()
        try:
            # Enforce: new gate must not already be occupied by another flight
            cursor.execute(
                "SELECT flight_id FROM Flight WHERE terminal = %s AND gate_number = %s AND flight_id != %s",
                (new_terminal, new_gate_number, flight_id.upper())
            )
            if cursor.fetchone():
                raise ValueError(
                    f"Gate {new_gate_number} in Terminal {new_terminal} is already occupied"
                )
            cursor.execute(
                "UPDATE Flight SET terminal = %s, gate_number = %s WHERE flight_id = %s",
                (new_terminal, new_gate_number, flight_id.upper())
            )
            conn.commit()
        finally:
            cursor.close()
            conn.close()

    def remove_flight(self, flight_id: str) -> None:
        conn, cursor = get_connection()
        try:
            cursor.execute("DELETE FROM Flight WHERE flight_id = %s", (flight_id.upper(),))
            conn.commit()
        finally:
            cursor.close()
            conn.close()