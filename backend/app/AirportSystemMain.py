from datetime import datetime, timezone
from typing import Optional
import bcrypt
import mysql.connector

from app.db_interfaces.DBInterfaceLogginCredentials     import DBInterfaceLoginCredentials
from app.db_interfaces.DBInterfaceFlights               import DBInterfaceFlights
from app.db_interfaces.DBInterfacePassengers            import DBInterfacePassengers
from app.db_interfaces.DBInterfaceBags                  import DBInterfaceBags
from app.db_interfaces.DBInterfaceStaff                 import DBInterfaceStaff
from app.db_interfaces.DBInterfaceMessages  import DBInterfaceMessages

from app.domain.Flight    import Flight
from app.domain.Passenger import Passenger
from app.domain.Bag       import Bag
from app.domain.Administrator import Administrator
from app.domain.AirlineStaff import AirlineStaff
from app.domain.GateStaff import GateStaff
from app.domain.GroundStaff import GroundStaff
from app.domain.Staff import _StaffBase
from app.domain.Message   import Message
from app.domain.MessageBoard import MessageBoard

from app.enums import PassengerStatus, BagLocationType, BoardType, StaffRole


class AirportSystemMain:

    def __init__(self):
        self.db_login     = DBInterfaceLoginCredentials()
        self.db_flight    = DBInterfaceFlights()
        self.db_passenger = DBInterfacePassengers()
        self.db_bag       = DBInterfaceBags()
        self.db_staff     = DBInterfaceStaff()
        self.db_message   = DBInterfaceMessages()

    # -------------------------------------------------------------------------
    # Authentication
    # -------------------------------------------------------------------------

    def login_staff(self, username: str, password: str) -> bool:
        return self.db_login.validate_login(username, password)

    def login_passenger(self, identification: str, ticket_number: str) -> bool:
        passenger = self.db_passenger.retrieve_passenger(ticket_number)
        if passenger is None:
            return False
        return passenger.identification == identification

    def logout(self, user_id: str) -> None:
        pass

    def get_staff_role(self, username: str) -> Optional[str]:
        return self.db_login.get_role(username)

    def get_staff_airline(self, username: str) -> Optional[str]:
        record = self.db_staff.retrieve_staff(username)
        return record.get("airline_code") if record else None

    def change_staff_password(self, username: str, current_password: str, new_password: str) -> None:
        if not self.db_login.validate_login(username, current_password):
            raise ValueError("Current password is incorrect")
        new_hash = bcrypt.hashpw(new_password.encode(), bcrypt.gensalt()).decode()
        self.db_login.update_password(username, new_hash)

    # -------------------------------------------------------------------------
    # Flights
    # -------------------------------------------------------------------------

    def add_flight(self, flight: Flight) -> None:
        try:
            self.db_flight.store_flight(flight)
        
        except mysql.connector.errors.IntegrityError:
            raise ValueError(f"Flight {flight.flight_id} already exists!")


    def remove_flight(self, flight_id: str) -> None:
        flight = self.db_flight.retrieve_flight(flight_id)
        if flight is None:
            raise ValueError(f"Flight {flight_id} not found")
        
        self.db_bag.remove_bags_by_flight(flight_id)
        self.db_passenger.remove_passengers_by_flight(flight_id)


        self.db_flight.remove_flight(flight_id)

    def get_flight(self, flight_id: str) -> Flight:
        flight = self.db_flight.retrieve_flight(flight_id)
        if flight is None:
            raise ValueError(f"Flight {flight_id} not found")
        return flight

    def get_all_flights(self, airline_code: Optional[str] = None) -> list[Flight]:
        return self.db_flight.retrieve_all_flights(airline_code)

    def get_flight_at_gate(self, terminal: str, gate_number: str) -> Flight:
        flight = self.db_flight.retrieve_flight_at_gate(terminal, gate_number)
        if flight is None:
            raise ValueError(f"No flight found at Terminal {terminal}, Gate {gate_number}")
        return flight

    def change_flight_gate(
        self, flight_id: str, new_terminal: str, new_gate_number: str
    ) -> None:
        self.db_flight.update_flight_gate(flight_id, new_terminal, new_gate_number)

    # -------------------------------------------------------------------------
    # Passengers
    # -------------------------------------------------------------------------

    def add_passenger(self, passenger: Passenger) -> None:
        self.db_passenger.store_passenger(passenger)

    def remove_passenger(self, ticket_number: str) -> None:
        passenger = self.db_passenger.retrieve_passenger(ticket_number)
        if passenger is None:
            raise ValueError(f"Passenger with ticket {ticket_number} not found")
        self.db_passenger.remove_passenger(ticket_number)

    def get_passenger(self, ticket_number: str) -> Passenger:
        passenger = self.db_passenger.retrieve_passenger(ticket_number)
        if passenger is None:
            raise ValueError(f"Passenger {ticket_number} not found")
        return passenger

    def get_all_passengers(
        self,
        flight_id: Optional[str] = None,
        airline_code: Optional[str] = None,
    ) -> list[Passenger]:
        """Returns passengers filtered by flight or airline as needed."""
        if flight_id:
            return self.db_passenger.retrieve_passengers_by_flight(flight_id)
        return self.db_passenger.retrieve_all_passengers(airline_code)

    def check_in_passenger(self, ticket_number: str, bags: list[Bag]) -> None:
        passenger = self.db_passenger.retrieve_passenger(ticket_number)
        if passenger is None:
            raise ValueError("Passenger not found")
        if passenger.status != PassengerStatus.NotCheckedIn:
            raise ValueError("Passenger is already checked in")

        flight = self.db_flight.retrieve_flight(passenger.flight_id)
        if flight is None:
            raise ValueError("Flight not found in the system")

        # Update passenger status
        passenger.update_status(PassengerStatus.CheckedIn)
        self.db_passenger.update_passenger_status(ticket_number, PassengerStatus.CheckedIn)

        # Register each bag
        for bag in bags:
            if bag.ticket_number != ticket_number:
                raise ValueError(f"Bag {bag.bag_id} does not belong to this passenger")
            self.db_bag.store_bag(bag)

    def report_check_in_issue(self, ticket_number: str) -> None:
        passenger = self.db_passenger.retrieve_passenger(ticket_number)
        name = f"{passenger.first_name} {passenger.last_name}" if passenger else ticket_number

        message = Message(
            message_id      = 0,
            content         = f"Check-in issue reported for passenger {name} (ticket: {ticket_number}). Please review.",
            category        = "Check-in Issue",
            created_at      = datetime.now(timezone.utc),
            sender_username = "system",
            sender_role     = StaffRole.AirlineStaff.value,
        )
        admin_board = self.db_message.get_message_board(BoardType.AdminBoard)
        admin_board.add_message(message)
        self.db_message.store_message(message, BoardType.AdminBoard)

    def report_security_violation(self, ticket_number: str, bag_id: str, sender_username: str) -> None:
        bag = self.db_bag.retrieve_bag(bag_id)
        if bag is None:
            raise ValueError(f"Bag {bag_id} not found")

        message = Message(
            message_id      = 0,
            content         = (
                f"Security violation: Bag {bag_id} for passenger (ticket: {ticket_number}) "
                f"on flight {bag.flight_id} has been flagged. "
                f"Please remove all bags for this passenger and notify the administrator."
            ),
            category        = "Security Violation",
            created_at      = datetime.now(timezone.utc),
            sender_username = sender_username,
            sender_role     = StaffRole.GroundStaff.value,
            sender_airline  = bag.airline_code,
        )
        airline_board = self.db_message.get_message_board(BoardType.AirlineBoard, bag.airline_code)
        airline_board.add_message(message)
        self.db_message.store_message(message, BoardType.AirlineBoard, bag.airline_code)

    def board_passenger(self, ticket_number: str) -> None:
        passenger = self.db_passenger.retrieve_passenger(ticket_number)
        if passenger is None:
            raise ValueError("Passenger not found")
        if passenger.status != PassengerStatus.CheckedIn:
            raise ValueError("Passenger must be checked in before boarding")

        bags = self.db_bag.retrieve_bags_by_passenger(ticket_number)
        not_at_gate = [b.bag_id for b in bags if not b.is_at_gate()]
        if not_at_gate:
            raise ValueError(
                f"Cannot board: bags not yet at gate: {not_at_gate}"
            )

        passenger.update_status(PassengerStatus.Boarded)
        self.db_passenger.update_passenger_status(ticket_number, PassengerStatus.Boarded)

    # -------------------------------------------------------------------------
    # Bags
    # -------------------------------------------------------------------------

    def update_bag_location(
        self, bag_id: str, new_type: BagLocationType, detail: str = ""
    ) -> None:
        bag = self.db_bag.retrieve_bag(bag_id)
        if bag is None:
            raise ValueError(f"Bag {bag_id} not found")
        bag.update_location(new_type, detail)
        self.db_bag.update_bag_location(bag_id, new_type, detail)

    def load_bag(self, bag_id: str) -> None:
        bag = self.db_bag.retrieve_bag(bag_id)
        if bag is None:
            raise ValueError(f"Bag {bag_id} not found")

        passenger = self.db_passenger.retrieve_passenger(bag.ticket_number)
        if passenger is None or passenger.status != PassengerStatus.Boarded:
            raise ValueError("Passenger must be boarded before their bag can be loaded")

        bag.update_location(BagLocationType.Loaded, bag.flight_id)
        self.db_bag.update_bag_location(bag_id, BagLocationType.Loaded, bag.flight_id)

    def get_bags(
        self,
        ticket_number: Optional[str] = None,
        flight_id:     Optional[str] = None,
        terminal:      Optional[str] = None,
        gate_number:   Optional[str] = None,
        bag_id:        Optional[str] = None,
    ) -> list[Bag]:
        if bag_id:
            bag = self.db_bag.retrieve_bag(bag_id)
            return [bag] if bag else []
        if terminal and gate_number:
            return self.db_bag.retrieve_bags_at_gate(terminal, gate_number)
        if flight_id:
            return self.db_bag.retrieve_bags_by_flight(flight_id)
        if ticket_number:
            return self.db_bag.retrieve_bags_by_passenger(ticket_number)
        return []

    def remove_bag(self, bag_id: str) -> None:
        if self.db_bag.retrieve_bag(bag_id) is None:
            raise ValueError(f"Bag {bag_id} not found")
        self.db_bag.remove_bag(bag_id)

    def remove_bags_by_passenger(self, ticket_number: str) -> None:
        self.db_bag.remove_bags_by_passenger(ticket_number)

    # -------------------------------------------------------------------------
    # Passenger bag tracking and gate view
    # -------------------------------------------------------------------------

    def trace_passenger_bags(self, ticket_number: str) -> list[Bag]:
        return self.db_bag.retrieve_bags_by_passenger(ticket_number)

    def view_passenger_gate(self, ticket_number: str) -> str:
        passenger = self.db_passenger.retrieve_passenger(ticket_number)
        if passenger is None:
            raise ValueError("Passenger not found")
        flight = self.db_flight.retrieve_flight(passenger.flight_id)
        if flight is None:
            raise ValueError("Flight not found")
        return f"Terminal {flight.terminal}, Gate {flight.gate_number}"

    # -------------------------------------------------------------------------
    # Departure
    # -------------------------------------------------------------------------

    def report_ready_for_departure(self, flight_id: str) -> bool:
        flight     = self.get_flight(flight_id)
        passengers = self.db_passenger.retrieve_passengers_by_flight(flight_id)
        bags       = self.db_bag.retrieve_bags_by_flight(flight_id)
        return flight.all_passengers_boarded(passengers) and flight.all_bags_loaded(bags)

    # -------------------------------------------------------------------------
    # Staff
    # -------------------------------------------------------------------------

    def add_staff(self, role: str, staff_data: object) -> dict:
        return self.db_staff.store_staff(staff_data, self.db_login)

    def remove_staff(self, username: str) -> None:
        if self.db_staff.retrieve_staff(username) is None:
            raise ValueError(f"Staff member {username} not found")
        self.db_staff.remove_staff(username)

    def get_all_staff(self, role: Optional[str] = None) -> list[dict]:
        return self.db_staff.retrieve_all_staff(role)

    def get_staff_member(self, username: str) -> dict:
        record = self.db_staff.retrieve_staff(username)
        if record is None:
            raise ValueError(f"Staff member {username} not found")
        return record

    # -------------------------------------------------------------------------
    # Message boards
    # -------------------------------------------------------------------------

    def post_board_message(
        self,
        board_type:      BoardType,
        sender_username: str,
        sender_role:     str,
        content:         str,
        category:        str,
        airline_code:    Optional[str] = None,
    ) -> None:
        message = Message(
            message_id      = 0,
            content         = content,
            category        = category,
            created_at      = datetime.now(timezone.utc),
            sender_username = sender_username,
            sender_role     = sender_role,
            sender_airline  = airline_code,
        )
        board = self.db_message.get_message_board(board_type, airline_code)
        board.add_message(message)
        self.db_message.store_message(message, board_type, airline_code)

    def get_board_messages(
        self,
        board_type:   BoardType,
        airline_code: Optional[str] = None,
    ) -> MessageBoard:
        return self.db_message.get_message_board(board_type, airline_code)

_airport_system: Optional[AirportSystemMain] = None

def get_airport_system() -> AirportSystemMain:
    global _airport_system
    if _airport_system is None:
        _airport_system = AirportSystemMain()
    return _airport_system