import { useState, useEffect } from "react";

import { useData } from "../../GlobalData/ApplicationData";

import { ticketNumberRegex, terminalRegex, counterNumberRegex } from "../../RegexValidation/form-validation";

import Alert from "../../ReusableComponents/Alert";

export default function CheckIn() {

    const { passengers, setPassengers, bags, setBags, currentUser } = useData()

    const [ticketNumber, setTicketNumber] = useState("");
    const [terminal, setTerminal] = useState("");
    const [counterNumber, setCounterNumber] = useState(null);
    const [bagNumber, setBagNumber] = useState(0);

    const [validForm, setValidForm] = useState(false);
    const [validTicketNumber, setValidTicketNumber] = useState(false)
    const [validTerminal, setValidTerminal] = useState(false)
    const [validCounterNumber, setValidCounterNumber] = useState(false)

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

        if (ticketNumberRegex(ticketNumber)) {
            setValidTicketNumber(true)
        } else {
            setValidTicketNumber(false)
        }

        if (terminalRegex(terminal)) {
            setValidTerminal(true)
        } else {
            setValidTerminal(false)
        }

        if (counterNumberRegex(counterNumber)) {
            setValidCounterNumber(true)
        } else {
            setValidCounterNumber(false)
        }


        if (!ticketNumber || !terminal || !counterNumber ||
            !ticketNumberRegex(ticketNumber) || !terminalRegex(terminal) || !counterNumberRegex(counterNumber)
        ) {
            setValidForm(false);
        } else {
            setValidForm(true);
        }
    }, [ticketNumber, terminal, counterNumber])


    const bagIdGen = () => {
        return Math.floor(100000 + Math.random() * 900000);
    }

    const CheckInPassenger = (e) => {
        e.preventDefault();

        let _ticketNumber = Number(ticketNumber)

        const passengerExists = passengers.find(p => p.ticketNumber === _ticketNumber);
        const passengerExistAndCheckedIn = passengers.find(p => p.ticketNumber === _ticketNumber && p.status !== "Not-checked-in");

        console.log(passengerExists);

        if (!passengerExists) {
            setErrorMessage(`Passenger (Ticket Number: ${_ticketNumber}) does not exist!`)
            setErrorMessageState(true)
            return;
        }

        else if (passengerExists.flight.slice(0, 2) !== currentUser.airline) {
            setErrorMessage(`You cannot check in this passenger!`)
            setErrorMessageState(true)
            return;
        }

        else if (passengerExistAndCheckedIn) {
            setErrorMessage(`Passenger (Ticket Number: ${_ticketNumber}) has already been checked in!`)
            setErrorMessageState(true)
            return;
        } else {
            setErrorMessage(`Passenger (Ticket Number: ${_ticketNumber}) has been successfully checked in!`)
            setErrorMessageState(true)
        }

        const createdIds = [];

        const flightId = passengerExists.flight

        const bagsToCheck = Array.from({ length: Number(bagNumber) }, () => {
            const bagId = bagIdGen();
            createdIds.push(bagId);

            return {
                bagId,
                ticketNumber: _ticketNumber,
                flightId: flightId,
                location: `COUNTER-${terminal}${counterNumber}`
            };
        });

        console.log(bagsToCheck)

        setBags(bags => [...bags, ...bagsToCheck])

        setPassengers(passenger => passenger.map(p => p.ticketNumber === _ticketNumber
            ? { ...p, status: "Checked-in" } : p
        ))

        setTicketNumber("")
        setTerminal("")
        setCounterNumber("")
        setBagNumber(0)

    }
    return (
        <div className="w-full min-h-screen flex justify-center items-center px-4 py-32 overflow-y-auto">

            <div className={`fixed top-32 right-4 z-40 h-24 w-[min(24rem,calc(100vw-2rem))] transition-all ease-in-out ${errorMessageState ? 'duration-300 translate-x-0 opacity-100' : 'duration-300 translate-x-full opacity-0'}`}>
                <Alert error={errorMessage} />
            </div>


            <form
                onSubmit={CheckInPassenger}
                className="p-8 sm:p-12 relative w-full max-w-xl bg-emerald-800 outline-2 outline-emerald-950 rounded-3xl flex flex-col justify-center items-center gap-6 sm:gap-8"
            >
                <button
                    type="submit"
                    className={`cursor-pointer hover:scale-105 absolute bottom-0 -right-[120px] mt-2 rounded-full bg-emerald-800 border-2 border-emerald-950 size-24 sm:size-28 gap-y-4 text-white transition-all duration-500 flex flex-col justify-center items-center
                            ${validForm ? '' : 'ease-in opacity-0 pointer-events-none'}`}
                >
                    <svg
                        className="fill-white"
                        xmlns="http://www.w3.org/2000/svg"
                        width="48"
                        height="48"
                        viewBox="0 0 256 256"
                    >
                        <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm48-88a8,8,0,0,1-8,8H136v32a8,8,0,0,1-16,0V136H88a8,8,0,0,1,0-16h32V88a8,8,0,0,1,16,0v32h32A8,8,0,0,1,176,128Z" />
                    </svg>
                </button>

                <div className="w-11/12 flex flex-col gap-y-4">
                    <div className="w-full flex flex-row justify-between">
                        <label className="text-2xl text-white">Ticket Number</label>
                        {validTicketNumber && <svg className="fill-white" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 256 256"><path d="M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z"></path></svg>}
                    </div>
                    <input
                        onChange={(e) => setTicketNumber(e.target.value)}
                        maxLength={10}
                        className="w-full h-16 border-2 border-emerald-950 bg-zinc-50 rounded-xl text-2xl px-4"
                        type="text"
                        value={ticketNumber}
                    />
                </div>
                <div className="w-11/12 flex flex-col gap-y-4">
                    <div className="w-full flex flex-row justify-between">
                        <label className="text-2xl text-white">Terminal</label>
                        {validTerminal && <svg className="fill-white" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 256 256"><path d="M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z"></path></svg>}
                    </div>
                    <input
                        onChange={(e) => setTerminal(e.target.value)}
                        maxLength={1}
                        className="w-full h-16 border-2 border-emerald-950 bg-zinc-50 rounded-xl text-2xl px-4"
                        type="text"
                        value={terminal}
                    />
                </div>
                <div className="w-11/12 flex flex-col gap-y-4">
                    <div className="w-full flex flex-row justify-between">
                        <label className="text-2xl text-white">Counter Number</label>
                        {validCounterNumber && <svg className="fill-white" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 256 256"><path d="M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z"></path></svg>}
                    </div>
                    <input
                        onChange={(e) => setCounterNumber(e.target.value)}
                        maxLength={2}
                        className="w-full h-16 border-2 border-emerald-950 bg-zinc-50 rounded-xl text-2xl px-4"
                        type="text"
                        value={counterNumber}
                    />
                </div>

                <div className="w-11/12 flex flex-col gap-y-4">
                    <label className="text-2xl text-white">Bags</label>
                    <input
                        onChange={(e) => setBagNumber(e.target.value)}
                        min={0}
                        className="w-full h-16 border-2 border-emerald-950 bg-zinc-50 rounded-xl text-2xl px-4"
                        type="number"
                        value={bagNumber}
                    />
                </div>
            </form>
        </div>
    )
};
