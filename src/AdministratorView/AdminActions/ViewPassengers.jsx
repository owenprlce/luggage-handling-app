import { useState } from "react"

import { useData } from "../../GlobalData/ApplicationData";
import RemovalPopup from "../../ReusableComponents/Reusable"
import ComponentFooter from "../../ReusableComponents/ComponentFooter";

export default function ViewPassengers() {

    const { passengers, setPassengers, bags, setBags } = useData()

    // ***Backend Route (Fetch Flights) 
    const [deletionPopup, setDeletionPopup] = useState(false);
    const [passengerToDelete, setPassengerToDelete] = useState("");

    // Not necesarry to remove all passenger bags of passenger being deleted, since Airline Staff removes all bags upon security violation report
    // Doesn't hurt to keep this here
    const removePassenger = (id) => {
        const passengerBeingRemoved = passengers.find(p => p.identification === id)

        setPassengers(prev => prev.filter(passenger => passenger.identification !== id))

        if(passengerBeingRemoved) {
            setBags(bag => bag.filter(b => b.ticketNumber !== passengerBeingRemoved.ticketNumber))
        }
    }

    return (
        <>
            <div className="w-full h-full">{passengers.length < 1 ? (

                <div className="w-full h-full flex justify-center items-center bg-orange-50 px-4 py-32">
                    <p className="text-4xl md:text-6xl text-emerald-950 text-center">No passengers present</p>
                </div>
            ) : (
                <div className="w-full h-full bg-orange-50 flex justify-center items-center px-4 py-32">

                    <ComponentFooter title={'Passengers'} />

                    {deletionPopup &&
                        <RemovalPopup
                            toRemove={passengerToDelete}
                            confirm={() => {
                                removePassenger(passengerToDelete.identification);
                                setDeletionPopup(false);
                                setPassengerToDelete("");
                            }}
                            cancel={() => {
                                setDeletionPopup(false);
                                setPassengerToDelete("")
                            }}
                            message={`Are you sure you want to remove passenger ${passengerToDelete.firstName} ${passengerToDelete.lastName}?`} />

                    }
                    <div className="w-9/12 max-h-[60vh] overflow-y-auto">
                        <table className="w-full table-fixed border-collapse text-emerald-950">
                            <thead>
                                <tr>
                                    <th className="p-4">First Name</th>
                                    <th className="p-4">Last Name</th>
                                    <th className="p-4">Identification</th>
                                    <th className="p-4">Ticket Number</th>
                                    <th className="p-4">Flight</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4">Remove</th>
                                </tr>
                            </thead>
                            <tbody>
                                {passengers.map((passenger) => (
                                    <tr key={passenger.identification} className={`text-center border-b
                                        ${passenger.securityViolation ? 'bg-red-200' : ''}
                                        ${passenger.checkInIssue ? 'bg-yellow-200' : ''}`}>
                                        <td className="p-4">{passenger.firstName}</td>
                                        <td className="p-4">{passenger.lastName}</td>
                                        <td className="p-4">{passenger.identification}</td>
                                        <td className="p-4">{passenger.ticketNumber}</td>
                                        <td className="p-4">{passenger.flight}</td>
                                        <td className="p-4">{passenger.status}</td>
                                        <td className="p-4">
                                            <button className="cursor-pointer" onClick={() => { setPassengerToDelete(passenger); setDeletionPopup(true); }}>
                                                <svg className="fill-red-400" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 256 256"><path d="M256,136a8,8,0,0,1-8,8H200a8,8,0,0,1,0-16h48A8,8,0,0,1,256,136Zm-57.87,58.85a8,8,0,0,1-12.26,10.3C165.75,181.19,138.09,168,108,168s-57.75,13.19-77.87,37.15a8,8,0,0,1-12.25-10.3c14.94-17.78,33.52-30.41,54.17-37.17a68,68,0,1,1,71.9,0C164.6,164.44,183.18,177.07,198.13,194.85ZM108,152a52,52,0,1,0-52-52A52.06,52.06,0,0,0,108,152Z"></path></svg>
                                            </button>
                                        </td>
                                    </tr>
                                ))}


                            </tbody>
                        </table>
                    </div>
                </div>
            )}</div>
        </>
    )
}
