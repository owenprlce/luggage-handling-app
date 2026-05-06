import { useState, useEffect } from "react";

import { useData } from "../../GlobalData/ApplicationData";
import { removeBagsByPassenger, reportCheckInIssue } from "../../api/backend";

import Alert from "../../ReusableComponents/Alert";

function FlightsList({ airline, selectedFlight, setSelectedFlight }) {

    const { flights } = useData()

    const flightsToDisplay = flights.filter(a => a.airlineCode === airline)

    return (
        <div className="w-full h-full flex flex-col justify-start items-center gap-12">

            {/* Flight List */}
            {!selectedFlight && (
                <div className="w-9/12 grid grid-cols-3 gap-6">
                    {flightsToDisplay.map((flight) => (
                        <div
                            key={flight.flightId}
                            onClick={() => setSelectedFlight(flight)}
                            className="cursor-pointer p-6 bg-emerald-800 border-2 border-emerald-950 rounded-2xl flex justify-between text-white hover:scale-[1.01] transition"
                        >
                            <div className="flex flex-col gap-2">
                                <span className="text-2xl font-semibold">
                                    {`${flight.airlineName} (${flight.airlineCode}${flight.flightNumber})`}
                                </span>
                                <span className="text-lg">
                                    Terminal {flight.gateInformation.terminal} - Gate {flight.gateInformation.gateNumber}
                                </span>
                                <span className="text-lg">
                                   {flight.destination}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Passengers */}
            {selectedFlight && (
                <div className="w-full h-full flex justify-center items-center">

                    <div onClick={() => setSelectedFlight(null)} className="z-40 rounded-[50px] fixed top-4 left-4 bg-emerald-800 border-2 border-emerald-700 cursor-pointer">
                        <div className="h-20 w-20 flex justify-center items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#FFFFFF" viewBox="0 0 256 256"><path d="M232,144a64.07,64.07,0,0,1-64,64H80a8,8,0,0,1,0-16h88a48,48,0,0,0,0-96H51.31l34.35,34.34a8,8,0,0,1-11.32,11.32l-48-48a8,8,0,0,1,0-11.32l48-48A8,8,0,0,1,85.66,45.66L51.31,80H168A64.07,64.07,0,0,1,232,144Z"></path></svg>
                        </div>
                    </div>

                    <FlightPassengersTable
                        flight={selectedFlight}
                        onBack={() => setSelectedFlight(null)}
                    />
                </div>
            )}
        </div>
    );
}

export default FlightsList;

function FlightPassengersTable({ flight, onBack }) {

    const { passengers, setPassengers, setMessages, bags, setBags, authToken, currentUser } = useData()

    const [selectedPassengerViolation, setSelectedPassengerViolation] = useState(null)
    const [selectedPassengerCheckIn, setSelectedPassengerCheckIn] = useState(null)
    const [selectedPassengerBags, setSelectedPassengerBags] = useState(null);

    const [errorMessage, setErrorMessage] = useState("")
    const [errorMessageState, setErrorMessageState] = useState(false)

    useEffect(() => {

        const errorMessageState = setTimeout(() => { setErrorMessageState(false); }, 3000)
        const errorMessage = setTimeout(() => { setErrorMessage(""); }, 3500)

        return () => {
            clearTimeout(errorMessageState); clearTimeout(errorMessage)
        }

    }, [errorMessageState])

    const flightPassengers = passengers.filter(p =>
        String(p.flight) === String(flight.flightId) ||
        flight.ticketNumbers.some(ticketNumber => String(ticketNumber) === String(p.ticketNumber))
    );

    const handleViewBags = (passenger) => {
        setSelectedPassengerBags(passenger)
    }

    const closeViewBags = () => {
        setSelectedPassengerBags(null);
    }

    const handleCheckInIssue = (passenger) => {
        setSelectedPassengerCheckIn(passenger)
    };

    const cancelCheckInIssue = (passenger) => {
        setSelectedPassengerCheckIn(null)
    };

    const confirmCheckInIssue = async () => {
        if (!selectedPassengerCheckIn) return;

        try {
            await reportCheckInIssue(authToken, selectedPassengerCheckIn.ticketNumber)
        } catch (err) {
            setErrorMessage(err.message || "Failed to report check-in issue.")
            setErrorMessageState(true)
            return;
        }

        setPassengers(passengers => passengers.map(p => String(p.ticketNumber) === String(selectedPassengerCheckIn.ticketNumber)
            ? { ...p, checkInIssue: true, securityViolation: false } : p
        ));

        setMessages(messages => [
            ...messages, {
                msg: `Check-in Issue: ${selectedPassengerCheckIn.firstName} ${selectedPassengerCheckIn.lastName}`,
                from: `AIRLINE`,
                fromWhom: ` STAFF (${currentUser.airline}): ${currentUser.firstName} ${currentUser.lastName}`,
                to: "ADMIN",
                airline: flight.airlineCode,
                flightNumber: flight.flightNumber,
                terminal: flight.gateInformation.terminal,
                gate: flight.gateInformation.gateNumber,
                time: new Date().toISOString()
            }

        ])

        setErrorMessage(`Passenger ${selectedPassengerCheckIn.firstName} ${selectedPassengerCheckIn.lastName} has been flagged for a check-in issue!`)
        setErrorMessageState(true)
        setSelectedPassengerCheckIn(null);
    };


    const handleSecurityViolation = (passenger) => {
        setSelectedPassengerViolation(passenger)
    };

    const cancelSecurityViolation = (passenger) => {
        setSelectedPassengerViolation(null)
    };

    const confirmSecurityViolation = async () => {
        if (!selectedPassengerViolation) return;

        try {
            await removeBagsByPassenger(authToken, selectedPassengerViolation.ticketNumber)
        } catch (err) {
            setErrorMessage(err.message || "Failed to remove passenger bags.")
            setErrorMessageState(true)
            return;
        }

        setBags(bags => bags.filter(b => String(b.ticketNumber) !== String(selectedPassengerViolation.ticketNumber)));
        console.log(bags);


        setPassengers(passenger => passenger.map(p => String(p.ticketNumber) === String(selectedPassengerViolation.ticketNumber) ?
            { ...p, securityViolation: true, checkInIssue: false } : p
        ))

        setMessages(messages => [
            ...messages, {
                msg: `Security Violation: ${selectedPassengerViolation.firstName} ${selectedPassengerViolation.lastName}`,
                from: `AIRLINE`,
                fromWhom: ` STAFF (${currentUser.airline}): ${currentUser.firstName} ${currentUser.lastName}`,
                to: "ADMIN",
                airline: flight.airlineCode,
                flightNumber: flight.flightNumber,
                terminal: flight.gateInformation.terminal,
                gate: flight.gateInformation.gateNumber,
                time: new Date().toISOString()
            }

        ])

        setErrorMessage(`Passenger ${selectedPassengerViolation.firstName} ${selectedPassengerViolation.lastName} has been flagged for a security violation!`)
        setErrorMessageState(true)
        setSelectedPassengerViolation(null);
    }


    return (
        <>

            <div className="w-full h-full flex justify-center items-center">{flightPassengers.length < 1 ? (
                <div className="w-full h-full flex justify-center items-center">
                    <p className="text-4xl md:text-6xl text-emerald-950 text-center">No passengers registered</p>
                </div>
            ) : (

                <div className="w-full p-4 flex flex-col items-center gap-y-16">

                    <div className={`absolute top-36 right-8 h-24 w-96 transition-all ease-in-out ${errorMessageState ? 'duration-300 translate-x-0 opacity-100' : 'duration-300 translate-x-full opacity-0'}`}>
                        <Alert error={errorMessage} />
                    </div>

                    {/* Header */}
                    <div className="w-9/12 flex flex-row items-center justify-start gap-4">
                        <h2 className="text-3xl text-emerald-950 font-semibold">
                            Flight {flight.airlineCode}{flight.flightNumber}
                        </h2>

                        <hr className="w-8 border-emerald-950"></hr>

                        <h2 className="text-3xl text-emerald-950 font-semibold">
                            Terminal {flight.gateInformation.terminal}
                        </h2>

                        <hr className="w-8 border-emerald-950"></hr>

                        <h2 className="text-3xl text-emerald-950 font-semibold">
                            Gate {flight.gateInformation.gateNumber}
                        </h2>
                    </div>

                    {/* Passenger Table */}
                    <div className="w-9/12 max-h-[60vh] overflow-y-auto">
                        <table className="w-full table-fixed border-collapse text-emerald-950">
                            <thead>
                                <tr>
                                    <th className="p-4">First Name</th>
                                    <th className="p-4">Last Name</th>
                                    <th className="p-4">Ticket Number</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4">Bags</th>
                                    <th className="p-4">Report Problem</th>
                                    <th className="p-4">Security Violation</th>
                                </tr>
                            </thead>
                            <tbody>
                                {flightPassengers.map((passenger) => (
                                    <tr key={passenger.ticketNumber} className="text-center border-b">
                                        <td className="p-4">{passenger.firstName}</td>
                                        <td className="p-4">{passenger.lastName}</td>
                                        <td className="p-4">{passenger.ticketNumber}</td>
                                        <td className="p-4">{passenger.status}</td>
                                        <td className="p-4">
                                            <button
                                                onClick={() => handleViewBags(passenger)}
                                                className="bg-emerald-800 text-white rounded-full cursor-pointer"
                                            >
                                                <svg className="m-2 fill-emerald-950" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 256 256"><path d="M104,88v96a8,8,0,0,1-16,0V88a8,8,0,0,1,16,0Zm24-8a8,8,0,0,0-8,8v96a8,8,0,0,0,16,0V88A8,8,0,0,0,128,80Zm32,0a8,8,0,0,0-8,8v96a8,8,0,0,0,16,0V88A8,8,0,0,0,160,80Zm48-16V208a16,16,0,0,1-16,16H176v16a8,8,0,0,1-16,0V224H96v16a8,8,0,0,1-16,0V224H64a16,16,0,0,1-16-16V64A16,16,0,0,1,64,48H88V24A24,24,0,0,1,112,0h32a24,24,0,0,1,24,24V48h24A16,16,0,0,1,208,64ZM104,48h48V24a8,8,0,0,0-8-8H112a8,8,0,0,0-8,8Zm88,160V64H64V208H192Z"></path></svg>
                                            </button>
                                        </td>
                                        <td className="p-4">
                                            <button
                                                onClick={() => handleCheckInIssue(passenger)}
                                                className="bg-yellow-400 text-white rounded-full cursor-pointer"
                                            >
                                                <svg className="m-2 fill-yellow-600" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 256 256"><path d="M144,200a16,16,0,1,1-16-16A16,16,0,0,1,144,200Zm-16-40a8,8,0,0,0,8-8V48a8,8,0,0,0-16,0V152A8,8,0,0,0,128,160Z"></path></svg>
                                            </button>
                                        </td>
                                        <td className="p-4">
                                            <button
                                                onClick={() => handleSecurityViolation(passenger)}
                                                className="bg-red-400 text-white rounded-full cursor-pointer"
                                            >
                                                <svg className="m-2 fill-red-600" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 256 256"><path d="M236.8,188.09,149.35,36.22h0a24.76,24.76,0,0,0-42.7,0L19.2,188.09a23.51,23.51,0,0,0,0,23.72A24.35,24.35,0,0,0,40.55,224h174.9a24.35,24.35,0,0,0,21.33-12.19A23.51,23.51,0,0,0,236.8,188.09ZM222.93,203.8a8.5,8.5,0,0,1-7.48,4.2H40.55a8.5,8.5,0,0,1-7.48-4.2,7.59,7.59,0,0,1,0-7.72L120.52,44.21a8.75,8.75,0,0,1,15,0l87.45,151.87A7.59,7.59,0,0,1,222.93,203.8ZM120,144V104a8,8,0,0,1,16,0v40a8,8,0,0,1-16,0Zm20,36a12,12,0,1,1-12-12A12,12,0,0,1,140,180Z"></path></svg>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                </div>


            )}</div>

            {selectedPassengerViolation && (
                <SecurityViolationPopup
                    passenger={selectedPassengerViolation}
                    confirm={confirmSecurityViolation}
                    cancel={cancelSecurityViolation} />
            )}

            {selectedPassengerCheckIn && (
                <CheckInIssuePopup
                    passenger={selectedPassengerCheckIn}
                    confirm={confirmCheckInIssue}
                    cancel={cancelCheckInIssue} />
            )}

            {selectedPassengerBags && (
                <PassengerBagsPopup
                    passenger={selectedPassengerBags}
                    close={closeViewBags}
                />
            )}

        </>
    );
}

function SecurityViolationPopup({ passenger, confirm, cancel }) {

    const { bags } = useData()

    const passengerBags = bags.filter(b => String(b.ticketNumber) === String(passenger.ticketNumber))

    if (!passenger) return null;

    return (
        <div className="fixed inset-0 z-40 min-h-screen overflow-y-auto p-4 flex justify-center items-center bg-black/30 backdrop-blur-xs">
            <div className="p-8 w-full max-w-xl mx-4 bg-emerald-800 border-2 border-emerald-950 flex flex-col rounded-2xl shadow-2xl">

                {/* Icon */}
                <div className="w-24 h-24 mx-auto mb-8 bg-red-400 border-2 border-emerald-950 rounded-full flex items-center justify-center">
                    <svg className="fill-red-600" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 256 256"><path d="M216,56H176V48a24,24,0,0,0-24-24H104A24,24,0,0,0,80,48v8H40A16,16,0,0,0,24,72V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V72A16,16,0,0,0,216,56ZM96,48a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96Zm64,24V200H96V72ZM40,72H80V200H40ZM216,200H176V72h40V200Z"></path></svg>
                </div>

                {/* Header */}
                <h2 className="text-3xl font-bold text-white text-center mb-4">
                    Security Violation
                </h2>
                <p className="text-white text-xl text-center">
                    Review the bags for passenger {passenger.firstName} {passenger.lastName}
                </p>

                {/* Bags List */}
                <div className={`gap-4 my-8 max-h-64 overflow-y-auto ${passengerBags.length > 6 ? 'grid grid-cols-2' : 'grid grid-cols-1'}`}>
                    {passengerBags.map((bag, idx) => (
                        <div key={bag.bagId} className="flex flex-col items-center p-4 bg-zinc-50 rounded-xl text-black">
                            <span className="font-semibold">Bag {idx + 1}</span>
                            <span className="text-sm">ID: {bag.bagId}</span>
                            <span className="text-sm">ID: {bag.flightId}</span>
                        </div>
                    ))}
                    {!passengerBags.length && (
                        <div className="w-full h-full flex justify-center items-center">
                            <p className="text-white text-center">No bags to display</p>
                        </div>
                    )}
                </div>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-8">
                    <button
                        className="flex-1 p-4 bg-zinc-50 hover:bg-zinc-300 text-black rounded-xl transition-all duration-300 cursor-pointer hover:scale-105"
                        onClick={cancel}
                    >
                        Cancel
                    </button>
                    <button
                        className="flex-1 p-4 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-all duration-300 cursor-pointer hover:scale-105"
                        onClick={confirm}
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
}

function CheckInIssuePopup({ passenger, confirm, cancel }) {


    if (!passenger) return null;

    return (
        <div className="fixed inset-0 z-40 min-h-screen overflow-y-auto p-4 flex justify-center items-center bg-black/30 backdrop-blur-xs">
            <div className="p-8 w-full max-w-xl mx-4 bg-emerald-800 border-2 border-emerald-950 flex flex-col rounded-2xl shadow-2xl">

                {/* Icon */}
                <div className="w-24 h-24 mx-auto mb-8 bg-yellow-400 border-2 border-emerald-950 rounded-full flex items-center justify-center">
                    <svg className="fill-yellow-600" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 256 256"><path d="M236.8,188.09,149.35,36.22h0a24.76,24.76,0,0,0-42.7,0L19.2,188.09a23.51,23.51,0,0,0,0,23.72A24.35,24.35,0,0,0,40.55,224h174.9a24.35,24.35,0,0,0,21.33-12.19A23.51,23.51,0,0,0,236.8,188.09ZM222.93,203.8a8.5,8.5,0,0,1-7.48,4.2H40.55a8.5,8.5,0,0,1-7.48-4.2,7.59,7.59,0,0,1,0-7.72L120.52,44.21a8.75,8.75,0,0,1,15,0l87.45,151.87A7.59,7.59,0,0,1,222.93,203.8ZM120,144V104a8,8,0,0,1,16,0v40a8,8,0,0,1-16,0Zm20,36a12,12,0,1,1-12-12A12,12,0,0,1,140,180Z"></path></svg>
                </div>
                {/* Header */}
                <h2 className="text-3xl font-bold text-white text-center mb-4">
                    Check-in Issue
                </h2>
                <p className="text-white text-xl text-center mb-8">
                    Report check in issue for {passenger.firstName} {passenger.lastName}
                </p>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-8">
                    <button
                        className="flex-1 p-4 bg-zinc-50 hover:bg-zinc-300 text-black rounded-xl transition-all duration-300 cursor-pointer hover:scale-105"
                        onClick={cancel}
                    >
                        Cancel
                    </button>
                    <button
                        className="flex-1 p-4 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-all duration-300 cursor-pointer hover:scale-105"
                        onClick={confirm}
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
}

function PassengerBagsPopup({ passenger, close }) {
    const { bags } = useData();

    const passengerBags = bags.filter(
        b => String(b.ticketNumber) === String(passenger.ticketNumber)
    );

    return (
        <div className="fixed inset-0 z-40 min-h-screen overflow-y-auto p-4 flex justify-center items-center bg-black/30 backdrop-blur-xs">
            <div className="p-8 w-full max-w-xl bg-emerald-800 border-2 border-emerald-950 rounded-2xl shadow-2xl">

                <h2 className="text-3xl font-bold text-white text-center mb-4">
                    Bags for {passenger.firstName} {passenger.lastName}
                </h2>

                <div className={`my-8 max-h-96 flex flex-col gap-6 overflow-y-auto ${passengerBags.length > 3 ? 'grid grid-cols-2' : 'grid grid-cols-1'}`}>
                    {passengerBags.length > 0 ? (
                        passengerBags.map((bag, idx) => (
                            <div
                                key={bag.bagId}
                                className="p-4 bg-zinc-50 rounded-xl text-black"
                            >
                                <p className="font-semibold">Bag {idx + 1}</p>
                                <p>ID: {bag.bagId}</p>
                                <p>FLIGHT ID: {bag.flightId}</p>
                                <p>{`Location: ${bag.location}`}</p>
                            </div>
                        ))
                    ) : (
                        <p className="text-white text-center">
                            No bags registered for this passenger
                        </p>
                    )}
                </div>

                <button
                    onClick={close}
                    className="w-full p-4 bg-zinc-50 hover:bg-zinc-300 text-black rounded-xl transition hover:scale-105 duration-300 ease-out"
                >
                    Close
                </button>
            </div>
        </div>
    );
}
