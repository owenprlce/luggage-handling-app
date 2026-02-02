import { useState } from "react"

export default function AddStaff() {
    const [staffType, setStaffType] = useState("Ground")
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [email, setEmail] = useState("")
    const [phoneNumber, setPhoneNumber] = useState("")
    const [airlines, setAirlines] = useState("")

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

        if(staffType !== "Ground") {
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

            <form
                onSubmit={addStaff}
                className="relative w-4/12 min-h-1/2 bg-emerald-50 outline-2 outline-emerald-950 rounded-3xl flex flex-col justify-center items-center gap-y-8"
            >
                <div className="w-10/12 flex justify-center items-center">
                    <h2 className="text-5xl text-emerald-950">Add Staff Member</h2>
                </div>

                <div className="w-10/12 flex flex-row gap-4">
                    <div className="w-full flex flex-col gap-y-4">
                        <label className="text-2xl text-emerald-950">First Name</label>
                        <input
                            onChange={(e) => setFirstName(e.target.value)}
                            className="w-full h-16 border-2 border-emerald-950 bg-zinc-50 rounded-xl text-2xl px-4"
                            type="text"
                            value={firstName}
                        />
                    </div>

                    <div className="w-full flex flex-col gap-y-4">
                        <label className="text-2xl text-emerald-950">Last Name</label>
                        <input
                            onChange={(e) => setLastName(e.target.value)}
                            className="w-full h-16 border-2 border-emerald-950 bg-zinc-50 rounded-xl text-2xl px-4"
                            type="text"
                            value={lastName}
                        />
                    </div>
                </div>

                <div className="w-10/12 flex flex-row gap-4">
                    <div className="w-full flex flex-col gap-y-4">
                        <label className="text-2xl text-emerald-950">Email</label>
                        <input
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full h-16 border-2 border-emerald-950 bg-zinc-50 rounded-xl text-2xl px-4"
                            type="email"
                            value={email}
                        />
                    </div>

                    <div className="w-full flex flex-col gap-y-4">
                        <label className="text-2xl text-emerald-950">Phone Number</label>
                        <input
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            className="w-full h-16 border-2 border-emerald-950 bg-zinc-50 rounded-xl text-2xl px-4"
                            type="text"
                            value={phoneNumber}
                        />
                    </div>
                </div>

                <div className="w-10/12 flex flex-row gap-4">
                    <div className="w-full flex flex-col gap-y-4">
                        <label className="text-2xl text-emerald-950">Staff Type</label>
                        <select
                            onChange={(e) => setStaffType(e.target.value)}
                            className="w-full h-16 border-2 border-emerald-950 text-emerald-950 bg-zinc-50 rounded-xl text-2xl px-4"
                            value={staffType}
                        >
                            <option value="Airline">Airline</option>
                            <option value="Gate">Gate</option>
                            <option value="Ground">Ground</option>
                        </select>
                    </div>

                    {/* Renders Conditionally */}
                    {(staffType === "Airline" || staffType === "Gate") && (
                        <div className="w-full flex flex-col gap-y-4">
                            <label className="text-2xl text-emerald-950">Airlines Code</label>
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

                <div className="w-10/12 flex flex-col gap-y-4 text-emerald-950">
                    <label className="text-2xl text-emerald-950"></label>
                    <button type="submit" className="w-full h-16 flex justify-center items-center border-2 border-emerald-950 bg-zinc-50 rounded-xl text-2xl hover:cursor-pointer">Add Staff</button>
                </div>
            </form>
        </div>
    )
}
