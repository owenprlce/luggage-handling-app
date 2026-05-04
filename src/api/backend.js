const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

async function apiRequest(path, { method = "GET", token, body } = {}) {
    const response = await fetch(`${API_BASE_URL}${path}`, {
        method,
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        ...(body ? { body: JSON.stringify(body) } : {}),
    });

    const data = await response.json().catch(() => null);
    if (!response.ok) {
        throw new Error(data?.error || `Request failed with status ${response.status}`);
    }
    return data;
}

function roleToFrontend(role) {
    const roles = {
        Admin: "admin",
        "Airline Staff": "airline-staff",
        "Gate Staff": "gate-staff",
        "Ground Staff": "ground-staff",
        Passenger: "passenger",
    };
    return roles[role] || role;
}

function mapFlight(flight) {
    const flightId = flight.flight_id;
    const airlineCode = flight.airline_code || "";
    const flightNumber = flightId?.startsWith(airlineCode)
        ? flightId.slice(airlineCode.length)
        : flightId;

    return {
        flightId,
        airlineCode,
        flightNumber,
        airlineName: flight.airline_name,
        destination: flight.destination,
        gateInformation: {
            terminal: flight.terminal,
            gateNumber: flight.gate_number,
        },
        ticketNumbers: flight.ticket_numbers || [],
        flightStatus: flight.flight_status,
    };
}

function mapPassenger(passenger) {
    return {
        firstName: passenger.firstname,
        lastName: passenger.lastname,
        identification: passenger.identification,
        ticketNumber: passenger.ticket_number,
        flight: passenger.flight_id,
        airlineCode: passenger.airline_code,
        status: passenger.passenger_status,
        checkInIssue: false,
        securityViolation: false,
    };
}

function mapBag(bag) {
    return {
        bagId: bag.bag_id,
        ticketNumber: bag.ticket_number,
        flightId: bag.flight_id,
        airlineCode: bag.airline_code,
        location: bag.location,
    };
}

export async function loginStaff(username, password) {
    const data = await apiRequest("/auth/login", {
        method: "POST",
        body: { username, password },
    });

    return {
        token: data.access_token,
        user: {
            username: data.username,
            type: roleToFrontend(data.role),
            role: data.role,
            airline: data.airline_code || "",
            airlineCode: data.airline_code || "",
            changedPassword: true,
        },
    };
}

export async function fetchFlights(token) {
    const flights = await apiRequest("/flights", { token });
    return flights.map(mapFlight);
}

export async function fetchPassengers(token) {
    const passengers = await apiRequest("/passengers", { token });
    return passengers.map(mapPassenger);
}

export async function fetchBagsByFlight(token, flightId) {
    const bags = await apiRequest(`/bags?flight_id=${encodeURIComponent(flightId)}`, { token });
    return bags.map(mapBag);
}

export async function fetchInitialDemoData(token) {
    const flights = await fetchFlights(token);
    const passengers = await fetchPassengers(token);
    const bagGroups = await Promise.all(
        flights.map((flight) => fetchBagsByFlight(token, flight.flightId))
    );

    const bagsById = new Map();
    bagGroups.flat().forEach((bag) => bagsById.set(bag.bagId, bag));

    return {
        flights,
        passengers,
        bags: Array.from(bagsById.values()),
    };
}
