
from enum import Enum

class PassengerStatus(str, Enum):
    NotCheckedIn = "Not-checked-in"
    CheckedIn    = "Checked-in"
    Boarded      = "Boarded"


class BagLocationType(str, Enum):
    CheckInCounter = "Check-in counter"
    SecurityCheck  = "Security check"
    Gate           = "Gate"
    Loaded         = "Loaded"


class BoardType(str, Enum):
    AirlineBoard = "Airline"
    GateBoard    = "Gate"
    GroundBoard  = "Ground"
    AdminBoard   = "Admin"


class StaffRole(str, Enum):
    Admin        = "Admin"
    AirlineStaff = "Airline Staff"
    GateStaff    = "Gate Staff"
    GroundStaff  = "Ground Staff"