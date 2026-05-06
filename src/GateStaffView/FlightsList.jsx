import { useState, useEffect } from "react";

import { useData } from "../GlobalData/ApplicationData";
import Alert from "../ReusableComponents/Alert";
import { boardPassenger, postMessage, fetchPassengers } from "../api/backend";

function FlightsList({ airline, selectedFlight, setSelectedFlight }) {

    const { flights } = useData()

    // If airline is provided (gate/airline staff), filter to their airline only.
    // If not provided (admin/ground staff), show all flights.
    const flightsToDisplay = airline
        ? flights.filter(f => f.airlineCode === airline)
        : flights

    return (
        <div className="w-full h-full flex flex-col justify-start items-center gap-12">

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
                                    Terminal {flight.gateInformation.terminal} - Gate {flight.gateInformation.gateNumber}
                                </span>
                                <span className="text-lg">
                                    {`${flight.airlineName} (${flight.airlineCode}${flight.flightNumber})`}
                                </span>
                                <span className="text-lg">
                                    {flight.destination}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

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

    const { passengers, setPassengers, bags, setBags, authToken, currentUser, alerted, setAlerted } = useData()

    const [isLoadingPassengers, setIsLoadingPassengers] = useState(true)

    const [errorMessage, setErrorMessage] = useState("")
    const [errorMessageState, setErrorMessageState] = useState(false)

    useEffect(() => {
        const errorMessageState = setTimeout(() => { setErrorMessageState(false); }, 3000)
        const errorMessage = setTimeout(() => { setErrorMessage(""); }, 3500)
        return () => { clearTimeout(errorMessageState); clearTimeout(errorMessage) }
    }, [errorMessageState])

    // Fetch fresh passengers from the backend whenever a flight is opened.
    // This ensures gate staff always see up-to-date passenger data without
    // needing to log out and back in.
    useEffect(() => {
        async function refreshPassengers() {
            setIsLoadingPassengers(true)
            try {
                const fresh = await fetchPassengers(authToken, flight.flightId)
                setPassengers(prev => {
                    // Keep passengers from other flights, replace this flight's passengers
                    const otherFlights = prev.filter(p => p.flight !== flight.flightId)
                    return [...otherFlights, ...fresh]
                })
            } catch (err) {
                console.error("Failed to refresh passengers:", err)
            } finally {
                setIsLoadingPassengers(false)
            }
        }
        refreshPassengers()
    }, [flight.flightId])

    const [selectedPassengerBags, setSelectedPassengerBags] = useState(null);

    const flightPassengers = passengers.filter(p =>
        String(p.flight) === String(flight.flightId)
    );

    const allPassengersBoarded = flightPassengers.length > 0 &&
        flightPassengers.every(p => p.status === "Boarded");

    const allBagsLoaded = bags
        .filter(b => String(b.flightId) === String(flight.flightId))
        .every(b => b.location.startsWith("Loaded"));

    const canAlertAdmin = allPassengersBoarded && allBagsLoaded;

    const handleViewBags = (passenger) => {
        setSelectedPassengerBags(passenger)
    }

    const closeViewBags = () => {
        setSelectedPassengerBags(null)
    }

    const handleBoardPassenger = async (passenger) => {
        const passengerBags = bags.filter(b =>
            String(b.ticketNumber) === String(passenger.ticketNumber)
        );

        const gateLocation = `Gate - ${flight.gateInformation.terminal}${flight.gateInformation.gateNumber}`
        const bagsAtGate = passengerBags.every(b =>
            b.location === gateLocation || b.location === "Gate"
        );

        if (!bagsAtGate) {
            setErrorMessage(`Cannot board: not all bags for ${passenger.firstName} ${passenger.lastName} are at the gate`)
            setErrorMessageState(true)
            return;
        }

        try {
            await boardPassenger(authToken, passenger.ticketNumber)

            // Backend confirmed — update local state
            setPassengers(prev => prev.map(p =>
                String(p.ticketNumber) === String(passenger.ticketNumber)
                    ? { ...p, status: "Boarded" }
                    : p
            ))

            setErrorMessage(`Passenger ${passenger.firstName} ${passenger.lastName} has been boarded`)
            setErrorMessageState(true)

        } catch (err) {
            setErrorMessage(err.message || "Failed to board passenger.")
            setErrorMessageState(true)
        }
    }

    const isPassengerReadyToBoard = (passenger) => {
        if (passenger.status === "Boarded") return true
        const gateLocation = `Gate - ${flight.gateInformation.terminal}${flight.gateInformation.gateNumber}`
        const passengerBags = bags.filter(b =>
            String(b.ticketNumber) === String(passenger.ticketNumber)
        );
        // Passenger with no bags is ready to board as long as they're checked in
        if (passengerBags.length === 0) return passenger.status === "Checked-in"
        return passengerBags.every(b =>
            b.location === gateLocation || b.location === "Gate"
        );
    };

    const alertAdmin = async (flightInformation) => {
        if (!canAlertAdmin) {
            setErrorMessage("Not all passengers boarded or bags loaded — flight cannot depart")
            setErrorMessageState(true)
            return;
        }

        try {
            await postMessage(authToken, {
                boardType:      "Admin",
                senderUsername: currentUser.username,
                senderRole:     "Gate Staff",
                content:        `Flight ${flightInformation.flightId} is clear for takeoff. All passengers boarded and all bags loaded.`,
                category:       "Departure Ready",
                airlineCode:    flight.airlineCode,
            })

            setAlerted(prev => [...prev, flightInformation.flightId])

            setErrorMessage(`Flight ${flightInformation.flightId}: Admin notified — clear for takeoff`)
            setErrorMessageState(true)

        } catch (err) {
            setErrorMessage(err.message || "Failed to notify admin.")
            setErrorMessageState(true)
        }
    }

    // Show a loading state while fetching so the table doesn't briefly
    // flash stale context data before the fresh data arrives
    if (isLoadingPassengers) {
        return (
            <div className="w-full h-full flex justify-center items-center bg-orange-50">
                <p className="text-4xl text-emerald-950">Loading passengers...</p>
            </div>
        )
    }

    return (
        <>
            <div className="w-full h-full flex justify-center items-center">
                {flightPassengers.length < 1 ? (
                    <div className="w-full h-full flex justify-center items-center bg-orange-50">
                        <p className="text-4xl md:text-6xl text-emerald-950 text-center">No passengers registered</p>
                    </div>
                ) : (
                    <div className="w-full p-4 flex flex-col items-center gap-y-16">

                        <div className={`fixed top-32 right-4 z-40 h-24 w-[min(24rem,calc(100vw-2rem))] transition-all ease-in-out ${errorMessageState ? 'duration-300 translate-x-0 opacity-100' : 'duration-300 translate-x-full opacity-0'}`}>
                            <Alert error={errorMessage} />
                        </div>

                        {/* Header */}
                        <div className="w-full max-w-6xl flex flex-row items-center justify-between gap-4">
                            <div className="flex flex-row items-center justify-start gap-4">
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
                            <div className="flex justify-end">
                                {canAlertAdmin && (
                                    <div className="flex flex-row">
                                        <button
                                            className={`${alerted.includes(flight.flightId) ? 'opacity-0' : ''} text-3xl text-red-600 font-semibold cursor-pointer`}
                                            onClick={() => alertAdmin(flight)}>
                                            Alert Admin
                                        </button>
                                        <div>
                                            {alerted.includes(flight.flightId) &&
                                                (<svg className="fill-emerald-950" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 256 256"><path d="M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z"></path></svg>)
                                            }
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Passenger Table */}
                        <div className="w-full max-w-6xl max-h-[65vh] overflow-x-auto overflow-y-auto">
                            <table className="min-w-[800px] w-full table-fixed border-collapse text-emerald-950">
                                <thead>
                                    <tr>
                                        <th className="p-4">First Name</th>
                                        <th className="p-4">Last Name</th>
                                        <th className="p-4">Ticket Number</th>
                                        <th className="p-4">Status</th>
                                        <th className="p-4">Bags</th>
                                        <th className="p-4">Board</th>
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
                                                {passenger.status === "Not-checked-in" || !isPassengerReadyToBoard(passenger) ? (
                                                    <button className="bg-red-400 animate-pulse text-white rounded-full">
                                                        <svg className="m-2 fill-red-600" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 256 256"><path d="M144,200a16,16,0,1,1-16-16A16,16,0,0,1,144,200Zm-16-40a8,8,0,0,0,8-8V48a8,8,0,0,0-16,0V152A8,8,0,0,0,128,160Z"></path></svg>
                                                    </button>
                                                ) : passenger.status === "Boarded" ? (
                                                    <button>
                                                        <svg className="m-2 fill-emerald-950" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 256 256"><path d="M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z"></path></svg>
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => handleBoardPassenger(passenger)}
                                                        className="bg-gray-300 text-white rounded-full cursor-pointer"
                                                    >
                                                        <svg className="m-2 fill-gray-950" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 256 256"><path d="M224,232a8,8,0,0,1-8,8H112a8,8,0,0,1,0-16H216A8,8,0,0,1,224,232Zm0-72v32a16,16,0,0,1-16,16H114.11a15.93,15.93,0,0,1-14.32-8.85l-58.11-116a16.1,16.1,0,0,1,0-14.32l22.12-44A16,16,0,0,1,85,17.56l33.69,14.22.47.22a16,16,0,0,1,7.15,21.46,1.51,1.51,0,0,1-.11.22L112,80l31.78,64L208,144A16,16,0,0,1,224,160Zm-16,0H143.77a15.91,15.91,0,0,1-14.31-8.85l-31.79-64a16.07,16.07,0,0,1,0-14.29l.12-.22L112,46.32,78.57,32.21A4.84,4.84,0,0,1,78.1,32L56,76,114.1,192H208Z"></path></svg>
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {selectedPassengerBags && (
                <PassengerBagsPopup
                    passenger={selectedPassengerBags}
                    close={closeViewBags}
                />
            )}
        </>
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
                <div className={`my-8 max-h-96 flex flex-col gap-6 overflow-y-auto ${passengerBags.length > 6 ? 'grid grid-cols-2' : 'grid grid-cols-1'}`}>
                    {passengerBags.length > 0 ? (
                        passengerBags.map((bag, idx) => (
                            <div key={bag.bagId} className="p-4 bg-zinc-50 rounded-xl text-black">
                                <p className="font-semibold">Bag {idx + 1}</p>
                                <p>ID: {bag.bagId}</p>
                                <p>FLIGHT ID: {bag.flightId}</p>
                                <p>{`Location: ${bag.location}`}</p>
                            </div>
                        ))
                    ) : (
                        <p className="text-white text-center">No bags registered for this passenger</p>
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
