import { useState, useEffect } from "react"

import ComponentFooter from "../../ReusableComponents/ComponentFooter"
import ComponentHeader from "../../ReusableComponents/ComponentHeader"
import Alert from "../../ReusableComponents/Alert"
import { useData } from "../../GlobalData/ApplicationData"

import { airlineCodeRegex, flightNumberRegex, terminalRegex, gateNumberRegex, alphaRegex } from "../../RegexValidation/form-validation"

export default function AddFlight() {

    // ***Backend Route (Add Flight) 
    const { flights, setFlights } = useData()

    const [airlineCode, setAirlineCode] = useState("")
    const [flightNumber, setFlightNumber] = useState("")
    const [terminal, setTerminal] = useState("")
    const [gateNumber, setGateNumber] = useState("")
    const [airlineName, setAirlineName] = useState("")
    const [destination, setDestination] = useState("")

    const [validForm, setValidForm] = useState(false)

    const [validAirlineCode, setValidAirlineCode] = useState(false)
    const [validFlightNumber, setValidFlightNumber] = useState(false)
    const [validTerminal, setValidTerminal] = useState(false)
    const [validGateNumber, setValidGateNumber] = useState(false)
    const [validAirlineName, setValidAirlineName] = useState(false)
    const [validDestination, setValidDestination] = useState(false)

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

    // Lacking Regex Check
    useEffect(() => {
        if (airlineCodeRegex(airlineCode)) {
            setValidAirlineCode(true)
        } else {
            setValidAirlineCode(false)
        }

        if (flightNumberRegex(flightNumber)) {
            setValidFlightNumber(true)
        } else {
            setValidFlightNumber(false)
        }

        if (terminalRegex(terminal)) {
            setValidTerminal(true)
        } else {
            setValidTerminal(false)
        }

        if (gateNumberRegex(gateNumber)) {
            setValidGateNumber(true)
        } else {
            setValidGateNumber(false)
        }

        if (alphaRegex(airlineName)) {
            setValidAirlineName(true)
        } else {
            setValidAirlineName(false)
        }
        
        if (alphaRegex(destination)) {
            setValidDestination(true)
        } else {
            setValidDestination(false)
        }

        if (!airlineCode || !flightNumber || !terminal || !gateNumber || !airlineName || !destination ||
            !airlineCodeRegex(airlineCode) || !flightNumberRegex(flightNumber) || !terminalRegex(terminal) || 
            !gateNumberRegex(gateNumber) || !alphaRegex(airlineName) || !alphaRegex(destination)
        ) {
            setValidForm(false);
        } else {
            setValidForm(true);
        }
    }, [airlineCode, flightNumber, terminal, gateNumber, airlineName, destination])

    function flightNumberValidation(flightNumber) {

        if (flightNumber.length < 4) {
            const toAdd = 4 - flightNumber.length
            return "0".repeat(toAdd) + flightNumber
        } else {
            return flightNumber
        }
    }

    function addFlight(e) {
        e.preventDefault()

        const existingFlight = flights.some(f => f.flightId === `${airlineCode}${flightNumber}`)
        const occupiedFlightBay = flights.some(f => f.gateInformation.terminal === terminal && f.gateInformation.gateNumber === gateNumber)

        let _flightNumber = flightNumberValidation(flightNumber)

        if (existingFlight) {
            setErrorMessage(`Flight ${airlineCode}${_flightNumber} already exists!`)
            setErrorMessageState(true)
            return;
        }

        else if (occupiedFlightBay) {
            setErrorMessage(`Flight bay ${terminal}${gateNumber} is occupied!`)
            setErrorMessageState(true)
            return;
        } 
        
        else {
            setErrorMessage(`Flight ${airlineCode}${_flightNumber} to ${destination} added!`)
            setErrorMessageState(true)
        }

        const flightToAdd = {
            flightId: `${airlineCode}${_flightNumber}`,
            airlineCode: airlineCode,
            flightNumber: _flightNumber,
            airlineName: airlineName,
            destination: destination,
            gateInformation: {
                terminal,
                gateNumber
            },
            ticketNumbers: []
        }

        setFlights(flights => [...flights, flightToAdd])

        console.log("Flight added successfully", flightToAdd);

        setAirlineCode("");
        setFlightNumber("");
        setTerminal("");
        setGateNumber("");
        setAirlineName("");
        setDestination("")

    }

    return (
        <div className="w-full min-h-screen bg-orange-50 flex justify-center items-center px-4 py-32 overflow-y-auto">

            <div className={`fixed top-32 right-4 z-40 h-24 w-[min(24rem,calc(100vw-2rem))] transition-all ease-in-out ${errorMessageState ? 'duration-300 translate-x-0 opacity-100' : 'duration-300 translate-x-full opacity-0'}`}>
                <Alert error={errorMessage} />
            </div>

            <form onSubmit={addFlight} className="p-8 sm:p-12 relative w-full max-w-xl bg-emerald-800 outline-2 outline-emerald-950 rounded-3xl flex flex-col justify-center items-center gap-6 sm:gap-8">

                <ComponentHeader title={'Add Flight Form'} />

                <button type="submit" className={`cursor-pointer hover:scale-105 static mt-2 rounded-full bg-emerald-800 border-2 border-emerald-950 size-24 sm:size-28 gap-y-4 text-white transition-all duration-500 flex flex-col justify-center items-center
                                    ${validForm ? '' : 'ease-in opacity-0 pointer-events-none'}`}>
                    <svg className="fill-white" xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="#000000" viewBox="0 0 256 256"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm48-88a8,8,0,0,1-8,8H136v32a8,8,0,0,1-16,0V136H88a8,8,0,0,1,0-16h32V88a8,8,0,0,1,16,0v32h32A8,8,0,0,1,176,128Z"></path></svg>
                </button>

                <div className="w-11/12 flex flex-col gap-y-4">
                    <div className="w-full flex flex-row justify-between">
                        <label className="text-2xl text-white">Airline Code</label>
                        {validAirlineCode && <svg className="fill-white" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 256 256"><path d="M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z"></path></svg>}
                    </div>
                    <input
                        onChange={(e) => setAirlineCode(e.target.value)}
                        maxLength={2}
                        className="w-full h-16 border-2 border-emerald-950 bg-zinc-50 rounded-xl text-2xl px-4"
                        type="text"
                        value={airlineCode} />
                </div>

                <div className="w-11/12 flex flex-col gap-y-4">
                    <div className="w-full flex flex-row justify-between">
                        <label className="text-2xl text-white">Flight Number</label>
                        {validFlightNumber && <svg className="fill-white" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 256 256"><path d="M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z"></path></svg>}
                    </div>
                    <input
                        onChange={(e) => setFlightNumber(e.target.value)}
                        maxLength={4}
                        className="w-full h-16 border-2 border-emerald-950 bg-zinc-50 rounded-xl text-2xl px-4"
                        type="text"
                        value={flightNumber} />
                </div>

                <div className="w-11/12 flex flex-col gap-y-4">
                    <div className="w-full flex flex-row justify-between">
                        <label className="text-2xl text-white">Terminal</label>
                        {validTerminal && <svg className="fill-white" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 256 256"><path d="M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z"></path></svg>}
                    </div>
                    <input
                        onChange={(e) => setTerminal(e.target.value)}
                        className="w-full h-16 border-2 border-emerald-950 bg-zinc-50 rounded-xl text-2xl px-4"
                        type="text"
                        maxLength={1}
                        value={terminal} />
                </div>

                <div className="z-10 w-11/12 flex flex-col gap-y-4">
                    <div className="w-full flex flex-row justify-between">
                        <label className="text-2xl text-white">Gate Number</label>
                        {validGateNumber && <svg className="fill-white" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 256 256"><path d="M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z"></path></svg>}
                    </div>
                    <input
                        onChange={(e) => setGateNumber(e.target.value)}
                        className="w-full h-16 border-2 border-emerald-950 bg-zinc-50 rounded-xl text-2xl px-4"
                        type="text"
                        maxLength={2}
                        value={gateNumber} />
                </div>
                
                <div className="z-10 w-11/12 flex flex-col gap-y-4">
                    <div className="w-full flex flex-row justify-between">
                        <label className="text-2xl text-white">Airline Name</label>
                        {validAirlineName && <svg className="fill-white" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 256 256"><path d="M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z"></path></svg>}
                    </div>
                    <input
                        onChange={(e) => setAirlineName(e.target.value)}
                        className="w-full h-16 border-2 border-emerald-950 bg-zinc-50 rounded-xl text-2xl px-4"
                        type="text"
                        minLength={2}
                        value={airlineName} />
                </div>
                
                <div className="z-10 w-11/12 flex flex-col gap-y-4">
                    <div className="w-full flex flex-row justify-between">
                        <label className="text-2xl text-white">Destination</label>
                        {validDestination && <svg className="fill-white" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 256 256"><path d="M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z"></path></svg>}
                    </div>
                    <input
                        onChange={(e) => setDestination(e.target.value)}
                        className="w-full h-16 border-2 border-emerald-950 bg-zinc-50 rounded-xl text-2xl px-4"
                        type="text"
                        minLength={2}
                        value={destination} />
                </div>
            </form>
        </div>
    )
}
