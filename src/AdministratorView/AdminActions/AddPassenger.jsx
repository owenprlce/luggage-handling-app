import { useState } from "react"

export default function AddPassenger() {

    // ***Backend Route (Add Flight) 

    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [identification, setIdentification] = useState("")
    const [ticketNumber, setTicketNumber] = useState("")
    const [flightId, setFlightId] = useState("")

    function airlineCodeValidation() {
        // Code to handle removing invalid format for airlineCode
    }
    
    function flightNumberValidation() {
        // Code to handle removing invalid format for flightNumber
    }

    function addPassenger(e) {
        e.preventDefault()

        const passengerToAdd = {
            firstName: firstName,
            lastName: lastName,
            identification: identification,
            ticketNumber: ticketNumber,
            flight: flightId,
            status: "Not-Checked-In"
        }

        console.log("Passenger added successfully");

    }

    return (
        <div className="w-full h-full bg-orange-50 flex justify-center items-center">
            {/* <div className={`absolute top-8 right-8 h-24 w-96 transition-all ease-in-out ${errorMessageState ? 'duration-300 translate-x-0 opacity-100' : 'duration-300 translate-x-full opacity-0'}`}>
                <ErrorMessage error={errorMessage} />
            </div> */}

            <form onSubmit={addPassenger} className="relative w-4/12 h-9/12 bg-emerald-50 outline-2 outline-emerald-950 rounded-3xl flex flex-col justify-center items-center gap-y-8">
                <div className="w-10/12 flex justify-center items-center">
                    <h2 className="text-5xl text-emerald-950">Add Passenger</h2>
                </div>

                <div className="w-10/12 flex flex-col gap-y-4">
                    <label className="text-2xl text-emerald-950">First Name</label>
                    <input 
                        onChange={(e) => setFirstName(e.target.value)}
                        maxLength={2}
                        className="w-full h-16 border-2 border-emerald-950 bg-zinc-50 rounded-xl text-2xl px-4" 
                        type="text"
                        value={firstName}/>
                </div>

                <div className="w-10/12 flex flex-col gap-y-4">
                    <label className="text-2xl text-emerald-950">Last Name</label>
                    <input 
                        onChange={(e) => setLastName(e.target.value)}
                        maxLength={4}
                        className="w-full h-16 border-2 border-emerald-950 bg-zinc-50 rounded-xl text-2xl px-4" 
                        type="text" 
                        value={lastName}/>
                </div>

                <div className="w-10/12 flex flex-col gap-y-4">
                    <label className="text-2xl text-emerald-950">Identification</label>
                    <input 
                        onChange={(e) => setIdentification(e.target.value)}
                        className="w-full h-16 border-2 border-emerald-950 bg-zinc-50 rounded-xl text-2xl px-4" 
                        type="text" 
                        value={identification}/>
                </div>
                
                <div className="w-10/12 flex flex-col gap-y-4">
                    <label className="text-2xl text-emerald-950">Ticket Number</label>
                    <input 
                        onChange={(e) => setTicketNumber(e.target.value)}
                        className="w-full h-16 border-2 border-emerald-950 bg-zinc-50 rounded-xl text-2xl px-4" 
                        type="text" 
                        value={ticketNumber}/>
                </div>
                
                <div className="w-10/12 flex flex-col gap-y-4">
                    <label className="text-2xl text-emerald-950">Flight Identifier</label>
                    <input 
                        onChange={(e) => setFlightId(e.target.value)}
                        className="w-full h-16 border-2 border-emerald-950 bg-zinc-50 rounded-xl text-2xl px-4" 
                        type="text" 
                        value={flightId}/>
                </div>

                <div className="w-10/12 flex flex-col gap-y-4 text-emerald-950">
                    <label className="text-2xl text-emerald-950"></label>
                    <button type="submit" className="w-full h-16 flex justify-center items-center border-2 border-emerald-950 bg-zinc-50 rounded-xl hover:cursor-pointer">Add Passenger</button>
                </div>
            </form>
        </div>
    )
}

// Use to pass alerts similar to error messages
function Alert({ alertMessage }) {
    return (
        <></>
    )
}