import { useState, useEffect } from "react"

import StaffNavigation from "../ReusableComponents/StaffNavigation";
import FlightsList from "./FlightsList";
import MessageBoard from "../ReusableComponents/MessageBoard";
import ComponentFooter from "../ReusableComponents/ComponentFooter";

import Alert from "../ReusableComponents/Alert";

import { useData } from "../GlobalData/ApplicationData";

export default function GroundStaff({ user }) {

    const [view, setView] = useState("manage-bags");
    const [selectedFlight, setSelectedFlight] = useState(null)
    const [locationToWork, setLocationToWork] = useState(null)


    const renderAdminChoice = () => {

        if (!locationToWork) {
            return <SelectWorkLocation setLocationToWork={setLocationToWork} />
        }

        switch (view) {
            case "manage-bags":
                if (locationToWork === "gate") { return <GateLocation selectedFlight={selectedFlight} setSelectedFlight={setSelectedFlight} /> }
                else if (locationToWork === "security-check") { return <SecurityCheckpoint /> }
            case "message-board":
                return (<MessageBoard role={'ground-staff'} />)
        }
    }

    return (
        <>
            <div className="relative w-full min-h-screen bg-orange-50 overflow-y-auto">
                <ComponentFooter title={"Ground Staff Dashboard"} />
                {
                    !selectedFlight && locationToWork === "gate" &&
                    <div className="z-20 absolute h-9/12 top-1/2 left-0 -translate-y-1/2">
                        <StaffNavigation setView={setView} type={'gate-staff'} />
                    </div>

                }

                {renderAdminChoice()}
            </div>

        </>
    )
}

function SelectWorkLocation({ setLocationToWork }) {
    return (
        <div className="w-full min-h-screen flex justify-center items-center bg-orange-50 px-4 py-32">
            <div className="w-full max-w-4xl flex flex-col justify-center items-center gap-8">
                <h2 className="text-5xl text-emerald-950 text-center mb-8">
                    Select Work Location
                </h2>

                <div className="w-full max-w-xl flex flex-col gap-8">
                    <div
                        onClick={() => setLocationToWork("gate")}
                        className="cursor-pointer p-16 bg-emerald-800 border-2 border-emerald-950 rounded-2xl flex flex-row items-center justify-between hover:scale-105 transition-transform duration-300"
                    >
                        <svg className="fill-white" xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 256 256"><path d="M224,216a8,8,0,0,1-8,8H72a8,8,0,1,1,0-16H216A8,8,0,0,1,224,216Zm24-80v24a8,8,0,0,1-8,8H61.07a39.75,39.75,0,0,1-38.31-28.51L8.69,92.6A16,16,0,0,1,24,72h8a8,8,0,0,1,5.65,2.34L59.32,96H81.81l-9-26.94A16,16,0,0,1,88,48h8a8,8,0,0,1,5.66,2.34L147.32,96H208A40,40,0,0,1,248,136Zm-16,0a24,24,0,0,0-24-24H144a8,8,0,0,1-5.65-2.34L92.69,64H88l12.49,37.47A8,8,0,0,1,92.91,112H56a8,8,0,0,1-5.66-2.34L28.69,88H24l14.07,46.9a23.85,23.85,0,0,0,23,17.1H232Z"></path></svg>
                        <h1 className="text-white">Airport Gates</h1>
                    </div>

                    <div
                        onClick={() => setLocationToWork("security-check")}
                        className="cursor-pointer p-16 bg-emerald-800 border-2 border-emerald-950 rounded-2xl flex flex-row items-center justify-between hover:scale-105 transition-transform duration-300"
                    >
                        <svg className="fill-white" xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 256 256"><path d="M224,64H32A16,16,0,0,0,16,80v72a16,16,0,0,0,16,16H56v32a8,8,0,0,0,16,0V168H184v32a8,8,0,0,0,16,0V168h24a16,16,0,0,0,16-16V80A16,16,0,0,0,224,64Zm0,64.69L175.31,80H224ZM80.69,80l72,72H103.31L32,80.69V80ZM32,103.31,80.69,152H32ZM224,152H175.31l-72-72h49.38L224,151.32V152Z"></path></svg>
                        <h1 className="text-white">Security Clearance</h1>
                    </div>
                </div>
            </div>
        </div>
    );
}

function GateLocation({ selectedFlight, setSelectedFlight }) {

    return (
        <div className="w-full min-h-screen flex justify-center items-center px-4 py-28">
            <div className="w-full min-h-[70vh] overflow-auto">
                <FlightsList selectedFlight={selectedFlight} setSelectedFlight={setSelectedFlight} />
            </div>
        </div>
    )
}


function SecurityCheckpoint() {
    const { bags, setBags, passengers, flights, setMessages, currentUser } = useData();

    const [errorMessage, setErrorMessage] = useState("");
    const [errorMessageState, setErrorMessageState] = useState(false);

    useEffect(() => {

        const errorMessageState = setTimeout(() => { setErrorMessageState(false); }, 3000)
        const errorMessage = setTimeout(() => { setErrorMessage(""); }, 3500)

        return () => {
            clearTimeout(errorMessageState); clearTimeout(errorMessage)
        }

    }, [errorMessageState])

    // Bag Queue (FIFO) -- Bags populate in front-end based on order they are created (checked-in by Airline Staff)
    const bagsQueue = bags
        .filter(b => b.location && b.location.startsWith("COUNTER-"))
        .slice(0, 20);

    const handleClearBag = (bag) => {
        // Find passenger and flight info for this bag
        const passenger = passengers.find(p => p.ticketNumber === bag.ticketNumber);
        const flight = flights.find(f => f.ticketNumbers && f.ticketNumbers.includes(bag.ticketNumber));

        if (!flight) {
            setErrorMessage("Cannot find flight information for this bag");
            setErrorMessageState(true);
            return;
        }

        // Verify flight info matches between bag and flight
        const bagFlightId = bag.flightId;
        const actualFlightId = `${flight.airlineCode}${flight.flightNumber}`;

        if (bagFlightId !== actualFlightId) {
            setErrorMessage(`Flight mismatch! Bag shows ${bagFlightId} but passenger is on ${actualFlightId}`);
            setErrorMessageState(true);
            return;
        }

        // Cleared - send to gate
        const gateLocation = `GATE-${flight.gateInformation.terminal}${flight.gateInformation.gateNumber}`;

        setBags(bags => bags.map(b =>
            b.bagId === bag.bagId
                ? { ...b, location: gateLocation, securityStatus: "cleared" }
                : b
        ));

        setErrorMessage(`Bag: ${bag.bagId} cleared! Send to ${gateLocation}`);
        setErrorMessageState(true);
    };

    const handleSecurityViolation = (bag) => {
        const passenger = passengers.find(p => p.ticketNumber === bag.ticketNumber);
        const flight = flights.find(f => f.ticketNumbers && f.ticketNumbers.includes(bag.ticketNumber));

        if (!passenger || !flight) {
            setErrorMessage("Cannot find passenger or flight information");
            setErrorMessageState(true);
            return;
        }

        // Update bag location to security check
        setBags(bags => bags.map(b =>
            b.bagId === bag.bagId
                ? { ...b, location: "SECURITY-CHECK", securityStatus: "violation" }
                : b
        ));

        // Send message to airline staff
        setMessages(messages => [
            ...messages,
            {
                msg: `SECURITY VIOLATION REPORTED - Bag ${bag.bagId} - Passenger ${passenger.firstName} ${passenger.lastName} - (Ticket: ${passenger.ticketNumber}). Remove all passenger bags from system!`,
                from: "GROUND",
                fromWhom: ` SECURITY: ${currentUser.firstName} ${currentUser.lastName}`,
                to: "AIRLINE",
                airline: flight.airlineCode,
                flightNumber: flight.flightNumber,
                terminal: flight.gateInformation.terminal,
                gate: flight.gateInformation.gateNumber,
                time: new Date().toISOString(),
            }
        ]);

        setErrorMessage(`Security Violation Reported: Bag ${bag.bagId}`);
        setErrorMessageState(true);
    };

    return (
        <div className="w-full min-h-screen flex justify-center items-center px-4 py-32">
            <div className={`fixed top-32 right-4 z-40 h-24 w-[min(24rem,calc(100vw-2rem))] transition-all ease-in-out ${errorMessageState ? 'duration-300 translate-x-0 opacity-100' : 'duration-300 translate-x-full opacity-0'}`}>
                <Alert error={errorMessage} />
            </div>

            <div className="w-full max-w-7xl min-h-[65vh] flex flex-col gap-8">

                <div className="flex-1 bg-emerald-800 rounded-2xl p-6 border-2 border-emerald-950 overflow-hidden flex flex-col">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-4xl font-bold text-white">
                            Security Checkpoint
                        </h2>
                        <span className="text-lg font-semibold text-emerald-800 bg-white px-4 py-2 rounded-full">
                            {bagsQueue.length} / {bags.filter(b => b.location && b.location.startsWith("COUNTER-")).length} total
                        </span>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        {bagsQueue.length === 0 ? (
                            <div className="h-full flex items-center justify-center">
                                <div className="text-center">
                                    <p className="text-2xl text-white">No luggage in queue</p>
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                                {bagsQueue.map((bag, index) => {
                                    const passenger = passengers.find(p => p.ticketNumber === bag.ticketNumber);
                                    const flight = flights.find(f => f.ticketNumbers && f.ticketNumbers.includes(bag.ticketNumber));

                                    return (
                                        <div
                                            key={bag.bagId}
                                            className="w-full h-full p-4 bg-orange-50 border-2 border-emerald-950 rounded-xl flex flex-col sm:flex-row justify-between gap-4"
                                        >

                                            <div className="w-full sm:w-10/12 h-full text-emerald-950 flex flex-col justify-between">
                                                <p className="text-lg font-bold">Bag ID: {bag.bagId}</p>
                                                <p className="text-lg">From: {bag.location}</p>
                                                <p className="text-lg">Ticket: {bag.ticketNumber}</p>
                                                <p className="text-lg">
                                                    {passenger ? `${passenger.firstName} ${passenger.lastName}` : 'Passenger not found'}
                                                </p>
                                                <p className="text-lg font-semibold">
                                                    {flight ? `Flight: ${flight.airlineCode}${flight.flightNumber}` : 'Flight not found'}
                                                </p>

                                            </div>

                                            <div className="w-full sm:w-4/12 flex flex-col items-end justify-between gap-3">
                                                <div>
                                                    <span className="text-lg font-bold text-white bg-emerald-950 px-3 py-1 rounded-full">
                                                        #{index + 1}
                                                    </span>
                                                </div>
                                                <div className="w-full">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleClearBag(bag);
                                                        }}
                                                        className="w-full p-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-all duration-200 hover:scale-105 flex items-center justify-center gap-2"
                                                    >
                                                        <div className="w-full flex flex-row justify-between">
                                                            <svg className="fill-white" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 256 256">
                                                                <path d="M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z"></path>
                                                            </svg>
                                                            <p>
                                                                Clear
                                                            </p>
                                                        </div>

                                                    </button>
                                                </div>
                                                <div className="w-full">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleSecurityViolation(bag);
                                                        }}
                                                        className="w-full p-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-all duration-200 hover:scale-[1.01]"
                                                    >
                                                        <div className="w-full flex flex-row justify-between">
                                                            <svg className="fill-white" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 256 256">
                                                                <path d="M236.8,188.09,149.35,36.22h0a24.76,24.76,0,0,0-42.7,0L19.2,188.09a23.51,23.51,0,0,0,0,23.72A24.35,24.35,0,0,0,40.55,224h174.9a24.35,24.35,0,0,0,21.33-12.19A23.51,23.51,0,0,0,236.8,188.09ZM222.93,203.8a8.5,8.5,0,0,1-7.48,4.2H40.55a8.5,8.5,0,0,1-7.48-4.2,7.59,7.59,0,0,1,0-7.72L120.52,44.21a8.75,8.75,0,0,1,15,0l87.45,151.87A7.59,7.59,0,0,1,222.93,203.8ZM120,144V104a8,8,0,0,1,16,0v40a8,8,0,0,1-16,0Zm20,36a12,12,0,1,1-12-12A12,12,0,0,1,140,180Z"></path>
                                                            </svg>
                                                            <p>
                                                                Violation
                                                            </p>
                                                        </div>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
