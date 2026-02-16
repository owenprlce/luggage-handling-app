import { createContext, useContext, useState } from "react";

const Data = createContext(null);

export function ApplicationData({ children }) {
    const [staff, setStaff] = useState([
        {
            type: 'admin',
            username: 'admin',
            password: 'admin'
        },
        {
            type: 'airline-staff',
            firstName: 'Airline',
            lastName: 'Staff',
            emailAddress: 'as1@as.com',
            phoneNumber: '0000000000',
            username: 'AS1',
            password: 'AS1',
            airline: 'AA',
            changedPassword: true
        },
        {
            type: 'gate-staff',
            firstName: 'Gate',
            lastName: 'Staff',
            emailAddress: 'gas1@gs.com',
            phoneNumber: '0000000000',
            username: 'GAS1',
            password: 'GAS1',
            airline: 'AA',
            changedPassword: true
        },
        {
            type: 'ground-staff',
            firstName: 'Ground',
            lastName: 'Staff',
            emailAddress: 'grs1@gs.com',
            phoneNumber: '0000000000',
            username: 'GRS1',
            password: 'GRS1',
            changedPassword: true
        },
        {
            type: 'airline-staff',
            firstName: 'Airline',
            lastName: 'Staff',
            emailAddress: 'as2@as.com',
            phoneNumber: '0000000000',
            username: 'AS2',
            password: 'AS2',
            airline: 'BB',
            changedPassword: true
        },
        {
            type: 'gate-staff',
            firstName: 'Gate',
            lastName: 'Staff',
            emailAddress: 'gas2@gs.com',
            phoneNumber: '0000000000',
            username: 'GAS2',
            password: 'GAS2',
            airline: 'BB',
            changedPassword: true
        },
        {
            type: 'ground-staff',
            firstName: 'Ground',
            lastName: 'Staff',
            emailAddress: 'grs2@gs.com',
            phoneNumber: '0000000000',
            username: 'GRS2',
            password: 'GRS2',
            changedPassword: true
        },
        {
            type: 'airline-staff',
            firstName: 'Airline',
            lastName: 'Staff',
            emailAddress: 'as3@as.com',
            phoneNumber: '0000000000',
            username: 'AS3',
            password: 'AS3',
            airline: 'CC',
            changedPassword: true
        },
        {
            type: 'gate-staff',
            firstName: 'Gate',
            lastName: 'Staff',
            emailAddress: 'gas3@gas.com',
            phoneNumber: '0000000000',
            username: 'GAS3',
            password: 'GAS3',
            airline: 'CC',
            changedPassword: true
        },
        {
            type: 'ground-staff',
            firstName: 'Ground',
            lastName: 'Staff',
            emailAddress: 'grs3@grs.com',
            phoneNumber: '0000000000',
            username: 'GRS3',
            password: 'GRS3',
            changedPassword: false
        },
    ]);

    const [flights, setFlights] = useState([
        {
            flightId: 'AA0001',
            airlineCode: 'AA',
            flightNumber: '0001',
            airlineName: 'American',
            destination: 'Honolulu, HI',
            gateInformation: {
                terminal: 'A',
                gateNumber: '1'
            },
            ticketNumbers: [1234567890, 2345678901]
        },
        {
            flightId: 'AA0002',
            airlineCode: 'AA',
            flightNumber: '0002',
            airlineName: 'American',
            destination: 'Portland, OR',
            gateInformation: {
                terminal: 'A',
                gateNumber: '2'
            },
            ticketNumbers: []
        },
    ]);

    const [passengers, setPassengers] = useState([
        {
            firstName: 'Patrick',
            lastName: 'Mahomes',
            identification: '000001',
            ticketNumber: 1234567890,
            flight: 'AA0001',
            status: 'Not-checked-in',
            checkInIssue: false,
            seucrityViolation: false
        },
        {
            firstName: 'Joe',
            lastName: 'Johnson',
            identification: '000002',
            ticketNumber: 2345678901,
            flight: 'AA0001',
            status: 'Checked-in',
            checkInIssue: false,
            seucrityViolation: false
        },
    ]);

    const [bags, setBags] = useState([
        {
            bagId: 123456,
            ticketNumber: 2345678901,
            flightId: `AA0001`,
            location: `GATE-A1`
        }

    ])

    const [messages, setMessages] = useState([])

    const [currentUser, setCurrentUser] = useState([])

    const [alerted, setAlerted] = useState([]);

    return (
        <Data.Provider
            value={{
                staff, setStaff,
                flights, setFlights,
                passengers, setPassengers,
                bags, setBags,
                messages, setMessages,
                currentUser, setCurrentUser,
                alerted, setAlerted
            }}
        >
            {children}
        </Data.Provider>
    );
}

export function useData() {
    return useContext(Data);
}
