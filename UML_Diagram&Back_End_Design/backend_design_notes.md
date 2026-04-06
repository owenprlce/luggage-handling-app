# Backend Design Notes

This file is only for quick team explanation of the current UML class diagram draft.

## 1. What classes are in the diagram

### Main data classes
- `Airline`
- `Flight`
- `Passenger`
- `Bag`

These are the main objects in the system.

### Role classes
- `Administrator`
- `AirlineStaff`
- `GateStaff`
- `GroundStaff`

These represent different users and their permissions.

### Communication classes
- `MessageBoard`
- `Message`

These are used for shared announcements and updates.

### Control class
- `AirportSystem`

This class is mainly used to hold the overall business logic and connect the flow between different classes.

---

## 2. Simple business flow / data flow

The main flow is:

1. `Administrator` adds flights, passengers, and staff.
2. `AirlineStaff` checks in a passenger and creates bag records.
3. `GroundStaff` updates bag location after security.
4. `GateStaff` boards the passenger after checking passenger status and bag status.
5. `GroundStaff` loads bags onto the plane.
6. `GateStaff` reports that the flight is ready when all passengers are boarded and all bags are loaded.
7. `Administrator` removes the flight after departure.

Bonus flow:
- `Passenger` can log in with identification + ticket number.
- `Passenger` can view bag location and gate information.
- `GateStaff` can change gate information.

Overall idea:

**user action -> AirportSystem processes it -> related classes get updated**

---

## 3. Main relationships

- One `Airline` can have many `Flight`
- One `Airline` can have many `AirlineStaff`
- One `Airline` can have many `GateStaff`
- One `Flight` can have many `Passenger`
- One `Passenger` can have zero or more `Bag`
- One `Flight` can also be related to many `Bag`
- One `MessageBoard` contains many `Message`

`AirportSystem` connects to the main classes because it coordinates the workflow.

---

## 4. What each class does and how it is used

### `Airline`
**Function**
- Stores airline information
- Groups flights and airline-related staff

**Calls / interactions**
- Connected with `Flight`
- Connected with `AirlineStaff`
- Connected with `GateStaff`

### `Flight`
**Function**
- Stores flight info such as flight id, destination, terminal, and gate
- Supports gate updates
- Supports flight-level checks

**Calls / interactions**
- Related to `Passenger`
- Related to `Bag`
- Used by `AirportSystem`
- Managed by `Administrator`
- Can be updated by `GateStaff` for gate change

### `Passenger`
**Function**
- Stores passenger information, ticket number, identification, and status
- Status changes through: `NotCheckedIn -> CheckedIn -> Boarded`

**Calls / interactions**
- Related to one `Flight`
- Related to zero or more `Bag`
- Updated by `AirlineStaff` during check-in
- Updated by `GateStaff` during boarding
- Queried by `AirportSystem` for bonus login and gate/bag viewing

### `Bag`
**Function**
- Stores bag id, flight id, ticket number, and current location
- Tracks bag movement through the system

**Calls / interactions**
- Related to `Passenger`
- Related to `Flight`
- Created during check-in
- Updated by `GroundStaff`
- Checked by `GateStaff`
- Used by `AirportSystem` during boarding, loading, and tracing

### `Administrator`
**Function**
- Manages flights, passengers, and staff
- Can also post announcements

**Calls / interactions**
- Uses `AirportSystem` to add/remove main records
- Can post to `MessageBoard`

### `AirlineStaff`
**Function**
- Handles passenger check-in
- Creates bag records
- Reports check-in or security-related issues

**Calls / interactions**
- Uses `AirportSystem` for check-in flow
- Updates `Passenger`
- Creates `Bag`
- Can post to `MessageBoard`

### `GateStaff`
**Function**
- Handles boarding
- Confirms whether a passenger can board
- Reports ready-for-departure
- Can change gate info in bonus part

**Calls / interactions**
- Uses `AirportSystem` for boarding and gate change
- Checks `Passenger` status
- Checks related `Bag` status
- Can post to `MessageBoard`

### `GroundStaff`
**Function**
- Updates bag location
- Reports security problems
- Loads bags onto the plane

**Calls / interactions**
- Uses `AirportSystem` for bag update and loading
- Updates `Bag`
- Can post to `MessageBoard`

### `MessageBoard`
**Function**
- Shared board for staff communication

**Calls / interactions**
- Contains many `Message`
- Used by `Administrator`, `AirlineStaff`, `GateStaff`, and `GroundStaff`

### `Message`
**Function**
- Stores one message entry
- Keeps content, category, sender, and time

**Calls / interactions**
- Belongs to `MessageBoard`

### `AirportSystem`
**Function**
- Holds the main business logic of the system
- Coordinates operations across multiple classes

**Calls / interactions**
- Receives requests from different roles
- Checks business rules
- Updates `Flight`, `Passenger`, `Bag`, and `MessageBoard`

Examples:
- check-in
- boarding
- bag location update
- bag loading
- gate change
- passenger bag tracing
- passenger gate viewing

Important note:
`AirportSystem` is mainly a logic/control class.  
It does not directly represent a database table.