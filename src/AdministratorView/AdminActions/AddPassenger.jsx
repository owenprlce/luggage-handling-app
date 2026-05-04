import { useState, useEffect } from "react"

import ComponentFooter from "../../ReusableComponents/ComponentFooter"
import Alert from "../../ReusableComponents/Alert"
import { useData } from "../../GlobalData/ApplicationData"
import { nameRegex, identificationRegex, ticketNumberRegex, flightIdRegex } from "../../RegexValidation/form-validation"



export default function AddPassenger() {

    const { flights, setFlights, passengers, setPassengers } = useData()

    // ***Backend Route (Add Flight) 

    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [identification, setIdentification] = useState("")
    const [ticketNumber, setTicketNumber] = useState("")
    const [flightId, setFlightId] = useState("")

    const [validForm, setValidForm] = useState(false)
    const [validFirst, setValidFirst] = useState(false)
    const [validLast, setValidLast] = useState(false)
    const [validIdentification, setValidIdentification] = useState(false)
    const [validTicketNumber, setValidTicketNumber] = useState(false)
    const [validFlightId, setValidFlightId] = useState(false)

    // Temporary error message to display
    const [errorMessage, setErrorMessage] = useState("")
    const [errorMessageState, setErrorMessageState] = useState(false)

    useEffect(() => {

        const errorMessageState = setTimeout(() => { setErrorMessageState(false); }, 3000)
        const errorMessage = setTimeout(() => { setErrorMessage(""); }, 3500)

        return () => {
            clearTimeout(errorMessageState); clearTimeout(errorMessage)
        }

    }, [errorMessageState])

    useEffect(() => {

        if (nameRegex(firstName)) {
            setValidFirst(true);
        } else {
            setValidFirst(false);
        }
        if (nameRegex(lastName)) {
            setValidLast(true);
        } else {
            setValidLast(false);
        }
        if (identificationRegex(identification)) {
            setValidIdentification(true);
        } else {
            setValidIdentification(false);
        }
        if (ticketNumberRegex(ticketNumber)) {
            setValidTicketNumber(true);
        } else {
            setValidTicketNumber(false);
        }
        if (flightIdRegex(flightId)) {
            setValidFlightId(true);
        } else {
            setValidFlightId(false);
        }


        if (!firstName || !lastName || !identification || !ticketNumber || !flightId
            || !nameRegex(firstName) || !nameRegex(lastName) || !identificationRegex(identification) ||
            !ticketNumberRegex(ticketNumber) || !flightIdRegex(flightId)
        ) {
            setValidForm(false);
        } else {
            setValidForm(true);
        }
    }, [firstName, lastName, identification, ticketNumber, flightId])

    function addPassenger(e) {
        e.preventDefault()

        const existingFlight = flights.some(f => f.flightId === flightId);
        const existingPassengerTicketNumber = passengers.some(p => p.ticketNumber === Number(ticketNumber));
        const existingPassengerIdentification = passengers.some(p => p.identification === identification);

        if (!existingFlight) {
            setErrorMessage(`Flight: ${flightId} does not exist`)
            setErrorMessageState(true)
            return;
        }

        else if (existingPassengerTicketNumber) {
            setErrorMessage(`Passenger (Ticket: ${ticketNumber}): already exists!`)
            setErrorMessageState(true)
            return;
        }

        else if (existingPassengerIdentification) {
            setErrorMessage(`Passenger (ID: ${identification}): already exists!`)
            setErrorMessageState(true)
            return;
        }

        const passengerToAdd = {
            firstName: firstName,
            lastName: lastName,
            identification: identification,
            ticketNumber: Number(ticketNumber),
            flight: flightId,
            status: "Not-checked-in",
            bagIds: []
        }

        console.log("Passenger added successfully");

        setPassengers(prev => [...prev, passengerToAdd])

        setFlights(flight => flight.map(f => f.flightId === flightId ?
            { ...f, ticketNumbers: [...f.ticketNumbers, Number(ticketNumber)] } : f));

        setFirstName("");
        setLastName("");
        setIdentification("");
        setTicketNumber("");
        setFlightId("");

    }

    return (
        <div className="w-full min-h-screen bg-orange-50 flex justify-center items-center px-4 py-32 overflow-y-auto">


            <ComponentFooter title={'Add Passenger Form'} />


            <div className={`fixed top-32 right-4 z-40 h-24 w-[min(24rem,calc(100vw-2rem))] transition-all ease-in-out ${errorMessageState ? 'duration-300 translate-x-0 opacity-100' : 'duration-300 translate-x-full opacity-0'}`}>
                <Alert error={errorMessage} />
            </div>

            <form onSubmit={addPassenger} className="p-8 sm:p-12 relative w-full max-w-xl bg-emerald-800 outline-2 outline-emerald-950 rounded-3xl flex flex-col justify-center items-center gap-6 sm:gap-8">

                <button type="submit" className={`hover:scale-105 static mt-2 rounded-full bg-emerald-800 border-2 border-emerald-950 size-24 sm:size-28 gap-y-4 text-white transition-all duration-500 flex flex-col justify-center items-center
                                        ${validForm ? '' : 'ease-in opacity-0 pointer-events-none'}`}>
                    <svg className="fill-white" xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="#000000" viewBox="0 0 256 256"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm48-88a8,8,0,0,1-8,8H136v32a8,8,0,0,1-16,0V136H88a8,8,0,0,1,0-16h32V88a8,8,0,0,1,16,0v32h32A8,8,0,0,1,176,128Z"></path></svg>
                </button>

                <div className="w-10/12 flex flex-col gap-y-4">
                    <div className="w-full flex flex-row justify-between">
                        <label className="text-2xl text-white">First Name</label>
                        {validFirst && <svg className="fill-white" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 256 256"><path d="M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z"></path></svg>}
                    </div>
                    <input
                        onChange={(e) => setFirstName(e.target.value)}
                        minLength={2}
                        maxLength={12}
                        className="w-full h-16 border-2 border-emerald-950 bg-zinc-50 rounded-xl text-2xl px-4"
                        type="text"
                        value={firstName} />
                </div>

                <div className="w-10/12 flex flex-col gap-y-4">
                    <div className="w-full flex flex-row justify-between">
                        <label className="text-2xl text-white">Last Name</label>
                        {validLast && <svg className="fill-white" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 256 256"><path d="M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z"></path></svg>}
                    </div>
                    <input
                        onChange={(e) => setLastName(e.target.value)}
                        minLength={2}
                        maxLength={12}
                        className="w-full h-16 border-2 border-emerald-950 bg-zinc-50 rounded-xl text-2xl px-4"
                        type="text"
                        value={lastName} />
                </div>

                <div className="w-10/12 flex flex-col gap-y-4">
                    <div className="w-full flex flex-row justify-between">
                        <label className="text-2xl text-white">Identification</label>
                        {validIdentification && <svg className="fill-white" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 256 256"><path d="M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z"></path></svg>}
                    </div>
                    <input
                        onChange={(e) => setIdentification(e.target.value)}
                        className="w-full h-16 border-2 border-emerald-950 bg-zinc-50 rounded-xl text-2xl px-4"
                        maxLength={6}
                        type="text"
                        value={identification} />
                </div>

                <div className="w-10/12 flex flex-col gap-y-4">
                    <div className="w-full flex flex-row justify-between">
                        <label className="text-2xl text-white">Ticket Number</label>
                        {validTicketNumber && <svg className="fill-white" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 256 256"><path d="M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z"></path></svg>}
                    </div>
                    <input
                        onChange={(e) => setTicketNumber(e.target.value)}
                        className="w-full h-16 border-2 border-emerald-950 bg-zinc-50 rounded-xl text-2xl px-4"
                        maxLength={10}
                        type="text"
                        value={ticketNumber} />
                </div>

                <div className="w-10/12 flex flex-col gap-y-4">
                    <div className="w-full flex flex-row justify-between">
                        <label className="text-2xl text-white">Flight Identifier</label>
                        {validFlightId && <svg className="fill-white" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 256 256"><path d="M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z"></path></svg>}
                    </div>
                    <input
                        onChange={(e) => setFlightId(e.target.value)}
                        className="w-full h-16 border-2 border-emerald-950 bg-zinc-50 rounded-xl text-2xl px-4"
                        type="text"
                        maxLength={6}
                        value={flightId} />
                </div>
            </form>
        </div>
    )
}
