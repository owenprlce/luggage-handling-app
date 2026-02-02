import { useState } from "react"

export default function AddFlight() {

    // ***Backend Route (Add Flight) 

    const [airlineCode, setAirlineCode] = useState("")
    const [flightNumber, setFlightNumber] = useState("")
    const [terminal, setTerminal] = useState("")
    const [gateNumber, setGateNumber] = useState("")

    function airlineCodeValidation() {
        // Code to handle removing invalid format for airlineCode
    }
    
    function flightNumberValidation() {
        // Code to handle removing invalid format for flightNumber
    }

    function addFlight(e) {
        e.preventDefault()

        const flightToAdd = {
            flightId: `${airlineCode}${flightNumber}`,
            airlineCode: airlineCode,
            flightNumber: flightNumber,
            gateInformation: {
                terminal,
                gateNumber
            },
            ticketNumbers: []
        }

        console.log("Flight added successfully");

    }

    return (
        <div className="w-full h-full bg-orange-50 flex justify-center items-center">
            {/* <div className={`absolute top-8 right-8 h-24 w-96 transition-all ease-in-out ${errorMessageState ? 'duration-300 translate-x-0 opacity-100' : 'duration-300 translate-x-full opacity-0'}`}>
                <ErrorMessage error={errorMessage} />
            </div> */}

            <form onSubmit={addFlight} className="relative w-4/12 h-8/12 bg-emerald-50 outline-2 outline-emerald-950 rounded-3xl flex flex-col justify-center items-center gap-y-8">
                <div className="w-10/12 flex justify-center items-center">
                    <h2 className="text-5xl text-emerald-950">Add Flight</h2>
                </div>

                <div className="w-10/12 flex flex-col gap-y-4">
                    <label className="text-2xl text-emerald-950">Airline Code</label>
                    <input 
                        onChange={(e) => setAirlineCode(e.target.value)}
                        maxLength={2}
                        className="w-full h-16 border-2 border-emerald-950 bg-zinc-50 rounded-xl text-2xl px-4" 
                        type="text"
                        value={airlineCode}/>
                </div>

                <div className="w-10/12 flex flex-col gap-y-4">
                    <label className="text-2xl text-emerald-950">Flight Number</label>
                    <input 
                        onChange={(e) => setFlightNumber(e.target.value)}
                        maxLength={4}
                        className="w-full h-16 border-2 border-emerald-950 bg-zinc-50 rounded-xl text-2xl px-4" 
                        type="text" 
                        value={flightNumber}/>
                </div>

                <div className="w-10/12 flex flex-col gap-y-4">
                    <label className="text-2xl text-emerald-950">Terminal</label>
                    <input 
                        onChange={(e) => setTerminal(e.target.value)}
                        className="w-full h-16 border-2 border-emerald-950 bg-zinc-50 rounded-xl text-2xl px-4" 
                        type="text" 
                        value={terminal}/>
                </div>
                
                <div className="w-10/12 flex flex-col gap-y-4">
                    <label className="text-2xl text-emerald-950">Gate</label>
                    <input 
                        onChange={(e) => setGateNumber(e.target.value)}
                        className="w-full h-16 border-2 border-emerald-950 bg-zinc-50 rounded-xl text-2xl px-4" 
                        type="text" 
                        value={gateNumber}/>
                </div>

                <div className="w-10/12 flex flex-col gap-y-8 text-emerald-950">
                    <label className="text-2xl text-emerald-950"></label>
                    <button type="submit" className="w-full h-16 flex justify-center items-center border-2 border-emerald-950 bg-zinc-50 rounded-xl hover:cursor-pointer">Add Flight</button>
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