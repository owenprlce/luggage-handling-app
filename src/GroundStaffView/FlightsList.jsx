import { useState, useEffect } from "react";

import { useData } from "../GlobalData/ApplicationData";

import Alert from "../ReusableComponents/Alert";

function FlightsList({ selectedFlight, setSelectedFlight }) {

    const { flights } = useData()

    return (
        <div className="w-full h-full flex flex-col justify-start items-center gap-12">

            {!selectedFlight && (
                <div className="w-9/12 grid grid-cols-3 gap-6">
                    {flights.map((flight) => (
                        <div
                            key={flight.flightId}
                            onClick={() => setSelectedFlight(flight)}
                            className="cursor-pointer p-6 bg-emerald-800 border-2 border-emerald-950 rounded-2xl flex justify-between text-white hover:scale-[1.01] ease-out duration-700 transition"
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

                    <div onClick={() => setSelectedFlight(null)} className="z-20 rounded-[50px] absolute top-4 left-4 bg-emerald-800 border-2 border-emerald-700 cursor-pointer">
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

    const { passengers, setPassengers, setMessages, bags, setBags, currentUser } = useData()

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
        flight.ticketNumbers.includes(p.ticketNumber)
    );

    const handleViewBags = (passenger) => {
        setSelectedPassengerBags(passenger)
    }

    const closeViewBags = () => {
        setSelectedPassengerBags(null);
    }

    return (
        <>

            <div className="w-full h-full flex justify-center items-center">{flightPassengers.length < 1 ? (
                <div className="w-full h-full flex justify-center items-center bg-orange-50">
                    <p className="text-6xl text-emerald-950">No passengers registered</p>
                </div>
            ) : (

                <div className="w-full p-4 flex flex-col items-center gap-y-16">

                    <div className={`absolute top-36 right-8 h-24 w-96 transition-all ease-in-out ${errorMessageState ? 'duration-300 translate-x-0 opacity-100' : 'duration-300 translate-x-full opacity-0'}`}>
                        <Alert error={errorMessage} />
                    </div>

                    <div className="w-9/12 flex flex-row items-center justify-between gap-4">
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
                    </div>

                    <div className="w-9/12 max-h-[60vh] overflow-y-auto">
                        <table className="w-full table-fixed border-collapse text-emerald-950">
                            <thead>
                                <tr>
                                    <th className="p-4">First Name</th>
                                    <th className="p-4">Last Name</th>
                                    <th className="p-4">Ticket Number</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4">Bags</th>
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
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                </div>


            )}</div>

            {selectedPassengerBags && (
                <PassengerBagsPopup
                    passenger={selectedPassengerBags}
                    flight={flight}
                    close={closeViewBags}
                />
            )}

        </>
    );
}

function PassengerBagsPopup({ passenger, flight, close }) {

    const { passengers, bags, setBags } = useData();

    const passengerBags = bags.filter(
        b => b.ticketNumber === passenger.ticketNumber
    );

    const gateLocation = `GATE-${flight.gateInformation.terminal}${flight.gateInformation.gateNumber}`;
    const toLoad = `LOADED-${flight.airlineCode}${flight.flightNumber}`;

    const handleBagLocationChange = (id, toLocation) => {
        
        // Find passenger
        const currentPassenger = passengers.find(p => p.ticketNumber === passenger.ticketNumber);
        
        // Cannot load luggage if passenger has not boarded
        if (!currentPassenger || currentPassenger.status !== "Boarded") {
            return; 
        }

        const bag = bags.find(b => b.bagId === id);
        
        // Bag can only be loaded if at gate
        if (bag && bag.location === gateLocation) {
            setBags(bags => bags.map(b => b.bagId === id ? { ...b, location: toLocation } : b));
        }
    }

    return (
        <div className="z-20 w-screen h-screen absolute flex justify-center items-center bg-black/30 backdrop-blur-xs">
            <div className="p-8 w-full max-w-xl bg-emerald-800 border-2 border-emerald-950 rounded-2xl shadow-2xl">

                <h2 className="text-3xl font-bold text-white text-center mb-4">
                    Bags for {passenger.firstName} {passenger.lastName}
                </h2>

                <div className={`my-8 max-h-96 flex flex-col gap-6 overflow-y-auto`}>
                    {passengerBags.length > 0 ? (
                        passengerBags.map((bag, idx) => {
                            const isAtGate = bag.location === gateLocation;
                            const isBoarded = passenger.status === "Boarded";
                            const canLoad = isAtGate && isBoarded;

                            return (
                                <div
                                    key={bag.bagId}
                                    className="p-4 bg-zinc-50 rounded-xl text-black flex flex-row justify-between items-center"
                                >
                                    <div className="flex flex-col justify-between gap-2">
                                        <p className="text-2xl font-bold">Bag {idx + 1}</p>
                                        <p className="text-xl">ID: {bag.bagId}</p>
                                        <p className="text-xl">FLIGHT ID: {bag.flightId}</p>
                                        <p className="text-xl">{`Location: ${bag.location}`}</p>
                                    </div>

                                    <div className="flex flex-col gap-4">
                                        <button
                                            onClick={() => handleBagLocationChange(bag.bagId, toLoad)}
                                            disabled={!canLoad}
                                            className={`p-4 rounded-2xl transition-transform duration-300 ease-in ${
                                                canLoad 
                                                    ? 'bg-emerald-800 hover:scale-105 cursor-pointer' 
                                                    : 'bg-emerald-800 cursor-not-allowed opacity-50'
                                            }`}
                                        >
                                            <p className="text-white">Load Aircraft</p>
                                        </button>
                                    </div>

                                </div>
                            );
                        })
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