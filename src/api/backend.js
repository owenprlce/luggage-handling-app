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

function mapStaff(staff) {
    const airlineCode = staff.airline_code || "";
    return {
        username: staff.username,
        firstName: staff.firstname,
        lastName: staff.lastname,
        email: staff.email,
        emailAddress: staff.email,
        phone: staff.phone,
        phoneNumber: staff.phone,
        role: staff.role,
        type: roleToFrontend(staff.role),
        airlineCode,
        airline: airlineCode,
    };
}

function mapMessage(message) {
    return {
        messageId: message.message_id,
        content: message.content,
        category: message.category,
        createdAt: message.created_at,
        senderUsername: message.sender_username,
        senderRole: message.sender_role,
        senderAirline: message.sender_airline,
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

export async function loginPassenger(identification, ticketNumber) {
    const data = await apiRequest("/auth/login/passenger", {
        method: "POST",
        body: { identification, ticket_number: ticketNumber },
    });
    return { token: data.access_token, role: "passenger" };
}

export async function changePassword(token, currentPassword, newPassword) {
    return apiRequest("/auth/change-password", {
        method: "PUT",
        token,
        body: { current_password: currentPassword, new_password: newPassword },
    });
}

export async function fetchFlights(token) {
    const flights = await apiRequest("/flights", { token });
    return flights.map(mapFlight);
}

export async function fetchFlight(token, flightId) {
    const flight = await apiRequest(`/flights/${flightId}`, { token });
    return mapFlight(flight);
}

export async function fetchFlightAtGate(token, terminal, gateNumber) {
    const flight = await apiRequest(`/flights/gate/${terminal}/${gateNumber}`, { token });
    return mapFlight(flight);
}

export async function addFlight(token, { flightId, destination, terminal, gateNumber, airlineCode }) {
    return apiRequest("/flights", {
        method: "POST",
        token,
        body: {
            flight_id:    flightId,
            destination,
            terminal,
            gate_number:  gateNumber,
            airline_code: airlineCode,
        },
    });
}

export async function removeFlight(token, flightId) {
    return apiRequest(`/flights/${flightId}`, { method: "DELETE", token });
}

export async function updateFlightGate(token, flightId, newTerminal, newGateNumber) {
    return apiRequest(`/flights/${flightId}/gate`, {
        method: "PUT",
        token,
        body: { new_terminal: newTerminal, new_gate_number: newGateNumber },
    });
}

export async function fetchPassengers(token) {
    const passengers = await apiRequest("/passengers", { token });
    return passengers.map(mapPassenger);
}

export async function fetchPassenger(token, ticketNumber) {
    const passenger = await apiRequest(`/passengers/${ticketNumber}`, { token });
    return mapPassenger(passenger);
}

export async function addPassenger(token, { ticketNumber, firstName, lastName, identification, flightId, airlineCode }) {
    return apiRequest("/passengers", {
        method: "POST",
        token,
        body: {
            ticket_number:  ticketNumber,
            firstname:      firstName,
            lastname:       lastName,
            identification,
            flight_id:      flightId,
            airline_code:   airlineCode,
        },
    });
}

export async function removePassenger(token, ticketNumber) {
    return apiRequest(`/passengers/${ticketNumber}`, { method: "DELETE", token });
}

export async function checkInPassenger(token, ticketNumber, bags = []) {
    // bags is expected to be an array of frontend bag objects
    const mappedBags = bags.map(b => ({
        bag_id:        b.bagId,
        ticket_number: b.ticketNumber,
        flight_id:     b.flightId,
        airline_code:  b.airlineCode,
    }));
    return apiRequest(`/passengers/${ticketNumber}/checkin`, {
        method: "POST",
        token,
        body: { bags: mappedBags },
    });
}

export async function boardPassenger(token, ticketNumber) {
    return apiRequest(`/passengers/${ticketNumber}/board`, { method: "POST", token });
}

export async function reportSecurityViolation(token, ticketNumber, bagId, senderUsername) {
    return apiRequest("/passengers/security-violation", {
        method: "POST",
        token,
        body: { ticket_number: ticketNumber, bag_id: bagId, sender_username: senderUsername },
    });
}

export async function reportCheckInIssue(token, ticketNumber) {
    return apiRequest(`/passengers/${ticketNumber}/checkin-issue`, { method: "POST", token });
}

export async function tracePassengerBags(token, ticketNumber) {
    const bags = await apiRequest(`/passengers/${ticketNumber}/bags`, { token });
    return bags.map(mapBag);
}

export async function fetchPassengerGate(token, ticketNumber) {
    const data = await apiRequest(`/passengers/${ticketNumber}/gate`, { token });
    return data.gate_info;
}

export async function fetchBags(token, { ticketNumber, flightId, terminal, gateNumber } = {}) {
    const params = new URLSearchParams();
    if (ticketNumber) params.append("ticket_number", ticketNumber);
    if (flightId)     params.append("flight_id",     flightId);
    if (terminal)     params.append("terminal",      terminal);
    if (gateNumber)   params.append("gate_number",   gateNumber);
    const query = params.toString();
    const bags = await apiRequest(`/bags${query ? "?" + query : ""}`, { token });
    return bags.map(mapBag);
}

export async function fetchBagsByFlight(token, flightId) {
    const bags = await apiRequest(`/bags?flight_id=${encodeURIComponent(flightId)}`, { token });
    return bags.map(mapBag);
}

export async function updateBagLocation(token, bagId, newType, detail = "") {
    return apiRequest(`/bags/${bagId}/location`, {
        method: "PUT",
        token,
        body: { new_type: newType, detail },
    });
}

export async function loadBag(token, bagId) {
    return apiRequest(`/bags/${bagId}/load`, { method: "PUT", token });
}

export async function removeBag(token, bagId) {
    return apiRequest(`/bags/${bagId}`, { method: "DELETE", token });
}

export async function removeBagsByPassenger(token, ticketNumber) {
    return apiRequest(`/bags/passenger/${ticketNumber}`, { method: "DELETE", token });
}

export async function fetchStaff(token, role) {
    const path = role
        ? `/staff?role=${encodeURIComponent(role)}`
        : "/staff";
    const staff = await apiRequest(path, { token });
    return staff.map(mapStaff);
}

export async function fetchStaffMember(token, username) {
    const staff = await apiRequest(`/staff/${username}`, { token });
    return mapStaff(staff);
}

export async function addStaff(token, { firstName, lastName, email, phone, role, airlineCode }) {
    const body = {
        firstname: firstName,
        lastname:  lastName,
        email,
        phone,
        role,
    };
    if (airlineCode) body.airline_code = airlineCode;
    return apiRequest("/staff", { method: "POST", token, body });
}

export async function removeStaff(token, username) {
    return apiRequest(`/staff/${username}`, { method: "DELETE", token });
}

export async function fetchMessages(token, boardType) {
    const messages = await apiRequest(
        `/messages?board_type=${encodeURIComponent(boardType)}`,
        { token }
    );
    return messages.map(mapMessage);
}

export async function postMessage(token, { boardType, senderUsername, senderRole, content, category, airlineCode }) {
    const body = { board_type: boardType, sender_username: senderUsername, sender_role: senderRole, content, category };
    if (airlineCode) body.airline_code = airlineCode;
    return apiRequest("/messages", { method: "POST", token, body });
}

export async function checkDepartureReadiness(token, flightId) {
    return apiRequest(`/departure/${flightId}/ready`, { token });
}

export async function confirmDeparture(token, flightId) {
    return apiRequest(`/departure/${flightId}/depart`, { method: "POST", token });
}

export async function fetchInitialDemoData(token, role) {
    const flights = await fetchFlights(token);
    const passengers = await fetchPassengers(token);
    const bagGroups = await Promise.all(
        flights.map((flight) => fetchBagsByFlight(token, flight.flightId))
    );
    const staff = role === "Admin" ? await fetchStaff(token) : [];

    const bagsById = new Map();
    bagGroups.flat().forEach((bag) => bagsById.set(bag.bagId, bag));

    return {
        flights,
        passengers,
        bags: Array.from(bagsById.values()),
        staff,
    };
}
