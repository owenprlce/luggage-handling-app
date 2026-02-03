import { useState, useEffect } from "react"

import ComponentFooter from "../../ReusableComponents/ComponentFooter"

export default function AddPassenger() {

    // ***Backend Route (Add Flight) 

    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [identification, setIdentification] = useState("")
    const [ticketNumber, setTicketNumber] = useState("")
    const [flightId, setFlightId] = useState("")

    const [validForm, setValidForm] = useState(false)

    useEffect(() => {
            if (!firstName || !lastName || !identification || !ticketNumber || !flightId) {
                setValidForm(false);
            } else {
                setValidForm(true);
            }
        }, [firstName, lastName, identification, ticketNumber, flightId])

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

        setFirstName("");
        setLastName("");
        setIdentification("");
        setTicketNumber("");
        setFlightId("");

    }

    return (
        <div className="w-full h-full bg-orange-50 flex justify-center items-center">
            {/* <div className={`absolute top-8 right-8 h-24 w-96 transition-all ease-in-out ${errorMessageState ? 'duration-300 translate-x-0 opacity-100' : 'duration-300 translate-x-full opacity-0'}`}>
                <ErrorMessage error={errorMessage} />
            </div> */}

            <ComponentFooter title={'Add Passenger Form'} />


            <form onSubmit={addPassenger} className="p-16 relative w-4/12 min-h-2/12 bg-emerald-800 outline-2 outline-emerald-950 rounded-3xl flex flex-col justify-center items-center gap-8">
                
                <button type="submit" className={`hover:scale-105 absolute bottom-0 -right-[120px] rounded-full bg-emerald-800 border-2 border-emerald-950 size-32 gap-y-4 text-white transition-all duration-500 flex flex-col justify-center items-center
                                        ${validForm ? '' : 'ease-in opacity-0'}`}>
                        <svg className="fill-white" xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="#000000" viewBox="0 0 256 256"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm48-88a8,8,0,0,1-8,8H136v32a8,8,0,0,1-16,0V136H88a8,8,0,0,1,0-16h32V88a8,8,0,0,1,16,0v32h32A8,8,0,0,1,176,128Z"></path></svg>
                </button>

                <div className="w-10/12 flex flex-col gap-y-4">
                    <label className="text-2xl text-white">First Name</label>
                    <input 
                        onChange={(e) => setFirstName(e.target.value)}
                        maxLength={2}
                        className="w-full h-16 border-2 border-emerald-950 bg-zinc-50 rounded-xl text-2xl px-4" 
                        type="text"
                        value={firstName}/>
                </div>

                <div className="w-10/12 flex flex-col gap-y-4">
                    <label className="text-2xl text-white">Last Name</label>
                    <input 
                        onChange={(e) => setLastName(e.target.value)}
                        maxLength={4}
                        className="w-full h-16 border-2 border-emerald-950 bg-zinc-50 rounded-xl text-2xl px-4" 
                        type="text" 
                        value={lastName}/>
                </div>

                <div className="w-10/12 flex flex-col gap-y-4">
                    <label className="text-2xl text-white">Identification</label>
                    <input 
                        onChange={(e) => setIdentification(e.target.value)}
                        className="w-full h-16 border-2 border-emerald-950 bg-zinc-50 rounded-xl text-2xl px-4" 
                        type="text" 
                        value={identification}/>
                </div>
                
                <div className="w-10/12 flex flex-col gap-y-4">
                    <label className="text-2xl text-white">Ticket Number</label>
                    <input 
                        onChange={(e) => setTicketNumber(e.target.value)}
                        className="w-full h-16 border-2 border-emerald-950 bg-zinc-50 rounded-xl text-2xl px-4" 
                        type="text" 
                        value={ticketNumber}/>
                </div>
                
                <div className="w-10/12 flex flex-col gap-y-4">
                    <label className="text-2xl text-white">Flight Identifier</label>
                    <input 
                        onChange={(e) => setFlightId(e.target.value)}
                        className="w-full h-16 border-2 border-emerald-950 bg-zinc-50 rounded-xl text-2xl px-4" 
                        type="text" 
                        value={flightId}/>
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