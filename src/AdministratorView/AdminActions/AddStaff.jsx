import { useState, useEffect } from "react"

import ComponentFooter from "../../ReusableComponents/ComponentFooter"

export default function AddStaff() {
    const [staffType, setStaffType] = useState("Ground")
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [email, setEmail] = useState("")
    const [phoneNumber, setPhoneNumber] = useState("")
    const [airlines, setAirlines] = useState("")

    const [validForm, setValidForm] = useState(false);

    // Lacking Regex Check
    useEffect(() => {
        if (staffType === "Airline" || staffType === "Gate") {
            if (!firstName || !lastName || !email || !phoneNumber || !airlines) {
                setValidForm(false);
            } else {
                setValidForm(true);
            }
        } else {
            if (!firstName || !lastName || !email || !phoneNumber) {
                setValidForm(false);
            } else {
                setValidForm(true);
            }
        }
    }, [firstName, lastName, email, phoneNumber, airlines, staffType])

    const addStaff = (e) => {
        e.preventDefault()

        const newStaff = {
            staffType: staffType,
            firstName: firstName,
            lastName: lastName,
            email: email,
            phoneNumber: phoneNumber,
            username: generateUsername(),
            password: generatePassword(),
        }

        if (staffType !== "Ground") {
            newStaff.airlines = airlines;
        }

        console.log("Created new staff", newStaff)

        setFirstName("")
        setLastName("")
        setEmail("")
        setPhoneNumber("")
        setAirlines("")
        setStaffType("Ground")
    }

    function generateUsername() {
        // Missing Logic 

        return null;
    }

    function generatePassword() {
        // Missing Logic

        return null;
    }

    return (
        <div className="w-full h-full bg-orange-50 flex justify-center items-center">

            {/* <div className={`absolute top-8 right-8 h-24 w-96 transition-all ease-in-out ${errorMessageState ? 'duration-300 translate-x-0 opacity-100' : 'duration-300 translate-x-full opacity-0'}`}>
                <ErrorMessage error={errorMessage} />
            </div> */}

            <ComponentFooter title={'Add Staff Form'} />

            <form
                onSubmit={addStaff}
                className="p-16 relative w-4/12 min-h-2/12 bg-emerald-800 outline-2 outline-emerald-950 rounded-3xl flex flex-col justify-center items-center gap-8"
            >
                <button type="submit" className={`hover:scale-105 absolute bottom-0 -right-[120px] rounded-full bg-emerald-800 border-2 border-emerald-950 size-32 gap-y-4 text-white transition-all duration-500 flex flex-col justify-center items-center
                                    ${validForm ? '' : 'ease-in opacity-0'}`}>
                    <svg className="fill-white" xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="#000000" viewBox="0 0 256 256"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm48-88a8,8,0,0,1-8,8H136v32a8,8,0,0,1-16,0V136H88a8,8,0,0,1,0-16h32V88a8,8,0,0,1,16,0v32h32A8,8,0,0,1,176,128Z"></path></svg>
                </button>

                <div className="w-11/12 flex flex-col gap-y-4">
                    <label className="text-2xl text-white">First Name</label>
                    <input
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full h-16 border-2 border-emerald-950 bg-zinc-50 rounded-xl text-2xl px-4"
                        type="text"
                        value={firstName}
                    />
                </div>

                <div className="w-11/12 flex flex-col gap-y-4">
                    <label className="text-2xl text-white">Last Name</label>
                    <input
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full h-16 border-2 border-emerald-950 bg-zinc-50 rounded-xl text-2xl px-4"
                        type="text"
                        value={lastName}
                    />
                </div>



                <div className="w-11/12 flex flex-col gap-y-4">
                    <label className="text-2xl text-white">Email</label>
                    <input
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full h-16 border-2 border-emerald-950 bg-zinc-50 rounded-xl text-2xl px-4"
                        type="email"
                        value={email}
                    />
                </div>

                <div className="w-11/12 flex flex-col gap-y-4">
                    <label className="text-2xl text-white">Phone Number</label>
                    <input
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="w-full h-16 border-2 border-emerald-950 bg-zinc-50 rounded-xl text-2xl px-4"
                        type="text"
                        value={phoneNumber}
                    />
                </div>


                <div className="w-11/12 flex flex-row gap-4">
                    <div className="w-full flex flex-col gap-y-4">
                        <label className="text-2xl text-white">Staff Type</label>
                        <select
                            onChange={(e) => setStaffType(e.target.value)}
                            className="w-full h-16 border-2 border-emerald-950 text-emerald-950 bg-zinc-50 rounded-xl text-2xl px-4"
                            value={staffType}
                        >
                            <option value="Ground">Ground</option>
                            <option value="Airline">Airline</option>
                            <option value="Gate">Gate</option>
                        </select>
                    </div>

                    {/* Renders Conditionally */}
                    {(staffType === "Airline" || staffType === "Gate") && (
                        <div className="w-full flex flex-col gap-y-4">
                            <label className="text-2xl text-white">Airlines Code</label>
                            <input
                                onChange={(e) => setAirlines(e.target.value.toUpperCase())}
                                maxLength={2}
                                className="w-full h-16 border-2 border-emerald-950 bg-zinc-50 rounded-xl text-2xl px-4"
                                type="text"
                                value={airlines}
                            />
                        </div>
                    )}
                </div>
            </form>
        </div>
    )
}
