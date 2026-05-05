import { useState } from "react"

import RemovalPopup from "../../ReusableComponents/Reusable";
import ComponentFooter from "../../ReusableComponents/ComponentFooter";
import { useData } from "../../GlobalData/ApplicationData";
import { removeFlight as removeFlightAPI } from "../../api/backend"

export default function ViewFlights() {

    // ***Backend Route (Fetch passengers) 
    const [deletionPopup, setDeletionPopup] = useState(false);
    const [flightToDelete, setFlightToDelete] = useState("");

    const { flights, setFlights, passengers, setPassengers, bags, setBags, authToken } = useData()

    // When admin removes flight, all passengers aboard flight, along with their bags are removed from the system
    const removeFlight = (flightId) => {
        setFlights(prev => prev.filter(flight => flight.flightId !== flightId))

        const passengersOnFlight = passengers.filter(p => p.flight === flightId)
        const ticketNumbers = passengersOnFlight.map(p => p.ticketNumber)

        setPassengers(passenger => passenger.filter(p => p.flight !== flightId))

        setBags(bag => bag.filter(b => !ticketNumbers.includes(b.ticketNumber)))
    }

    return (
        <>
            <div className="w-full h-full bg-orange-50 flex justify-center items-center px-4 py-32">{flights.length < 1 ? (

                <div className="w-full h-full flex justify-center items-center bg-orange-50 px-4">
                    <p className="text-4xl md:text-6xl text-emerald-950 text-center">No flights present</p>
                </div>

            ) : (
                <div className="w-full h-full flex justify-center items-center">

                    <ComponentFooter title={'Flights'} />

                    {deletionPopup &&
                        <RemovalPopup
                            toRemove={flightToDelete}
                            confirm={() => {
                                removeFlight(flightToDelete.flightId);
                                setDeletionPopup(false);
                                setFlightToDelete("");
                            }}
                            cancel={() => {
                                setDeletionPopup(false);
                                setFlightToDelete("")
                            }}
                            message={`Are you sure you want to remove flight ${flightToDelete.flightId}?`} />

                    }
                    <div className="w-9/12 max-h-[60vh] overflow-y-auto">
                        <table className="w-full table-fixed border-collapse text-emerald-950">
                            <thead>
                                <tr>
                                    <th className="p-4">Airline</th>
                                    <th className="p-4">Flight Code</th>
                                    <th className="p-4">Terminal</th>
                                    <th className="p-4">Gate Number</th>
                                    <th className="p-4">Destination</th>
                                    <th className="p-4">Remove Flight</th>
                                </tr>
                            </thead>
                            <tbody>
                                {flights.map((flight) => (
                                    <tr key={flight.flightId} className="text-center border-b">
                                        <td className="p-4">{flight.airlineName}</td>
                                        <td className="p-4">{flight.flightId}</td>
                                        <td className="p-4">{flight.gateInformation.terminal}</td>
                                        <td className="p-4">{flight.gateInformation.gateNumber}</td>
                                        <td className="p-4">{flight.destination}</td>
                                        <td className="p-4">
                                            <button className="cursor-pointer" onClick={() => { setFlightToDelete(flight); setDeletionPopup(true); }}>
                                                <svg className="fill-red-400" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 256 256"><path d="M176,216a8,8,0,0,1-8,8H24a8,8,0,0,1,0-16H168A8,8,0,0,1,176,216ZM247.86,93.15a8,8,0,0,1-3.76,5.39l-147.41,88a40.18,40.18,0,0,1-20.26,5.52,39.78,39.78,0,0,1-27.28-10.87l-.12-.12L13,145.8a16,16,0,0,1,4.49-26.21l3-1.47a8,8,0,0,1,6.08-.4l28.26,9.54L75,115.06,53.17,93.87A16,16,0,0,1,57.7,67.4l.32-.13,7.15-2.71a8,8,0,0,1,5.59,0L124.7,84.38,176.27,53.6a39.82,39.82,0,0,1,51.28,9.12l.12.15,18.64,23.89A8,8,0,0,1,247.86,93.15Zm-19.74-3.7-13-16.67a23.88,23.88,0,0,0-30.68-5.42l-54.8,32.72a8.06,8.06,0,0,1-6.87.64L68,80.58l-4,1.53.21.2L93.57,110.8a8,8,0,0,1-1.43,12.58L59.93,142.87a8,8,0,0,1-6.7.73l-28.67-9.67-.19.1-.37.17a.71.71,0,0,1,.13.12l36,35.26a23.85,23.85,0,0,0,28.42,3.18Z"></path></svg>
                                            </button>
                                        </td>
                                    </tr>
                                ))}


                            </tbody>
                        </table>
                    </div>
                </div>
            )
            }</div>
        </>
    )
}
