from app.database import get_connection
from app.domain.Bag import Bag
from app.enums import BagLocationType

class DBInterfaceBags:

    def store_bag(self, bag: Bag) -> None:
        conn, cursor = get_connection()
        try:
            cursor.execute(
                "SELECT bag_id FROM Bag WHERE bag_id = %s",
                (bag.bag_id,)
            )
            if cursor.fetchone():
                raise ValueError(f"Bag ID {bag.bag_id} already exists")

            cursor.execute(
                """INSERT INTO Bag (bag_id, location, ticket_number, flight_id, airline_code)
                   VALUES (%s, %s, %s, %s, %s)""",
                (
                    bag.bag_id,
                    bag.location,
                    bag.ticket_number,
                    bag.flight_id,
                    bag.airline_code,
                )
            )
            conn.commit()
        finally:
            cursor.close()
            conn.close()

    def retrieve_bag(self, bag_id: str) -> Bag | None:
        conn, cursor = get_connection()
        try:
            cursor.execute("SELECT * FROM Bag WHERE bag_id = %s", (bag_id,))
            row = cursor.fetchone()
            return Bag.from_dict(row) if row else None
        finally:
            cursor.close()
            conn.close()

    def retrieve_bags_by_passenger(self, ticket_number: str) -> list[Bag]:
        conn, cursor = get_connection()
        try:
            cursor.execute(
                "SELECT * FROM Bag WHERE ticket_number = %s",
                (ticket_number,)
            )
            return [Bag.from_dict(row) for row in cursor.fetchall()]
        finally:
            cursor.close()
            conn.close()

    def retrieve_bags_by_flight(self, flight_id: str) -> list[Bag]:
        conn, cursor = get_connection()
        try:
            cursor.execute(
                "SELECT * FROM Bag WHERE flight_id = %s",
                (flight_id.upper(),)
            )
            return [Bag.from_dict(row) for row in cursor.fetchall()]
        finally:
            cursor.close()
            conn.close()

    def retrieve_bags_at_gate(self, terminal: str, gate_number: str) -> list[Bag]:
        conn, cursor = get_connection()
        try:
            cursor.execute(
                """SELECT b.* FROM Bag b
                   JOIN Flight f ON b.flight_id = f.flight_id
                   WHERE f.terminal = %s AND f.gate_number = %s""",
                (terminal.upper(), gate_number)
            )
            return [Bag.from_dict(row) for row in cursor.fetchall()]
        finally:
            cursor.close()
            conn.close()

    def update_bag_location(
        self, bag_id: str, new_type: BagLocationType, detail: str = ""
    ) -> None:
        if detail:
            location_str = f"{new_type.value} - {detail}"
        else:
            location_str = new_type.value

        conn, cursor = get_connection()
        try:
            cursor.execute(
                "UPDATE Bag SET location = %s WHERE bag_id = %s",
                (location_str, bag_id)
            )
            conn.commit()
        finally:
            cursor.close()
            conn.close()

    def remove_bag(self, bag_id: str) -> None:
        conn, cursor = get_connection()
        try:
            cursor.execute("DELETE FROM Bag WHERE bag_id = %s", (bag_id,))
            conn.commit()
        finally:
            cursor.close()
            conn.close()

    def remove_bags_by_passenger(self, ticket_number: str) -> None:
        conn, cursor = get_connection()
        try:
            cursor.execute(
                "DELETE FROM Bag WHERE ticket_number = %s",
                (ticket_number,)
            )
            conn.commit()
        finally:
            cursor.close()
            conn.close()