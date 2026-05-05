import emailjs from "emailjs-com";

import { useState, useEffect } from "react"

import ComponentFooter from "../../ReusableComponents/ComponentFooter"
import Alert from "../../ReusableComponents/Alert"
import { useData } from "../../GlobalData/ApplicationData"

import { addStaff as addStaffAPI } from "../../api/backend"

import { nameRegex, emailRegex, phoneNumberRegex } from "../../RegexValidation/form-validation"

const ROLE_MAP = {
    "ground-staff":  "Ground Staff",
    "airline-staff": "Airline Staff",
    "gate-staff":    "Gate Staff",
}

export default function AddStaff() {
    const [type, setType] = useState("ground-staff")
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [email, setEmail] = useState("")
    const [phoneNumber, setPhoneNumber] = useState("")
    const [airline, setAirline] = useState("")
    const [isLoading, setIsLoading] = useState(false)


    const [validForm, setValidForm] = useState(false);
    const [validFirst, setValidFirst] = useState(false);
    const [validLast, setValidLast] = useState(false);
    const [validEmail, setValidEmail] = useState(false);
    const [validPhoneNumber, setValidPhoneNumber] = useState(false);

    const { staff, setStaff, authToken } = useData()

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
        if (type === "airline-staff" || type === "gate-staff") {

            if (nameRegex(firstName)) { setValidFirst(true) } else { setValidFirst(false) }
            if (nameRegex(lastName)) { setValidLast(true) } else { setValidLast(false) }
            if (emailRegex(email)) { setValidEmail(true) } else { setValidEmail(false) }
            if (phoneNumberRegex(phoneNumber)) { setValidPhoneNumber(true) } else { setValidPhoneNumber(false) }

            if (!firstName || !lastName || !email || !phoneNumber || !airline) { setValidForm(false) } else { setValidForm(true) }
            
        } else {

            if (nameRegex(firstName)) { setValidFirst(true) } else { setValidFirst(false) }
            if (nameRegex(lastName)) { setValidLast(true) } else { setValidLast(false) }
            if (emailRegex(email)) { setValidEmail(true) } else { setValidEmail(false) }
            if (phoneNumberRegex(phoneNumber)) { setValidPhoneNumber(true) } else { setValidPhoneNumber(false) }

            if (!firstName || !lastName || !email || !phoneNumber || !airline) { setValidForm(false) } else { setValidForm(true) }

            if (!firstName || !lastName || !email || !phoneNumber ||
                !nameRegex(firstName) || !nameRegex(lastName) || !emailRegex(email) || !phoneNumberRegex(phoneNumber)) {
                setValidForm(false)
            } else {
                setValidForm(true)
            }
        }
    }, [firstName, lastName, email, phoneNumber, airline, type])

    const addNewStaff = async (e) => {
        e.preventDefault()
        if (isLoading) return
        setIsLoading(true)
    
        let result = null   // declared outside so both blocks can access it
    
        try {
            result = await addStaffAPI(authToken, {
                firstName,
                lastName,
                email,
                phone:       phoneNumber,
                role:        ROLE_MAP[type],
                airlineCode: (type === "airline-staff" || type === "gate-staff") ? airline : undefined,
            })
    
            setStaff(prev => [...prev, {
                type,
                firstName,
                lastName,
                emailAddress: email,
                phoneNumber,
                username:        result.username,
                password:        result.temporary_password,
                changedPassword: false,
                ...(type !== "ground-staff" && { airline }),
            }])
    
            setErrorMessage(`Staff member ${firstName} ${lastName} added! Credentials sent to ${email}.`)
            setErrorMessageState(true)
    
            setFirstName(""); setLastName(""); setEmail("")
            setPhoneNumber(""); setAirline(""); setType("ground-staff")
    
        } catch (err) {
            setErrorMessage(err.message || "Failed to add staff member.")
            setErrorMessageState(true)
        } finally {
            setIsLoading(false)
        }
    
        // Only attempt email if the backend call succeeded
        if (result) {
            try {
                await sendCredentialsToEmail(firstName, lastName, email,
                    result.username, result.temporary_password)
                console.log("Credentials emailed successfully")
            } catch (emailError) {
                console.error("Could not send email:", emailError)
            }
        }
    }

    // Since our applicaiton has not been deployed, I am not able to use process.env to acces the credentials, so it will be hardcoded on my end for now
    // I can send you my credentials if you want to test on your end, if not, I console.log each created staff and it contains the generated credentials
    const sendCredentialsToEmail = (firstName, lastName, email, username, password) => {
        return emailjs.send(
            // Service ID
            // Template ID
            {
                email: email,
                first: firstName,
                last: lastName,
                username: username,
                password: password,
            },
            // Public Key
        )
    }

    function randIdx(array) {
        return array[Math.floor(Math.random() * array.length)]
    }

    function generateUsername() {

        const alphabet = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
        const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];

        let generatedUsername = []

        generatedUsername.push(randIdx(alphabet));
        generatedUsername.push(randIdx(alphabet));
        generatedUsername.push(randIdx(alphabet));

        generatedUsername.push(randIdx(numbers));
        generatedUsername.push(randIdx(numbers));
        generatedUsername.push(randIdx(numbers));


        return generatedUsername.sort(() => Math.random() - 0.5).join("")
    }

    function generatePassword() {
        const uppercaseAlpha = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
        const lowercaseAlpha = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
        const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];

        const allCharacters = [...uppercaseAlpha, ...lowercaseAlpha, ...numbers]


        let generatedPassword = []

        generatedPassword.push(randIdx(uppercaseAlpha))
        generatedPassword.push(randIdx(lowercaseAlpha))
        generatedPassword.push(randIdx(numbers))

        while (generatedPassword.length < 6) {
            generatedPassword.push(randIdx(allCharacters));

        }

        return generatedPassword.sort(() => Math.random() - 0.5).join("")
    }

    return (
        <div className="w-full min-h-screen bg-orange-50 flex justify-center items-center px-4 py-32 overflow-y-auto">

            <ComponentFooter title={'Add Staff Form'} />

            <div className={`fixed top-32 right-4 z-40 h-24 w-[min(24rem,calc(100vw-2rem))] transition-all ease-in-out ${errorMessageState ? 'duration-300 translate-x-0 opacity-100' : 'duration-300 translate-x-full opacity-0'}`}>
                <Alert error={errorMessage} />
            </div>

            <form
                onSubmit={addNewStaff}
                className="p-8 sm:p-12 relative w-full max-w-xl bg-emerald-800 outline-2 outline-emerald-950 rounded-3xl flex flex-col justify-center items-center gap-6 sm:gap-8"
            >

                <div className="w-11/12 flex flex-col gap-y-4">
                    <div className="w-full flex flex-row justify-between">
                        <label className="text-2xl text-white">First Name</label>
                        {validFirst && <svg className="fill-white" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 256 256"><path d="M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z"></path></svg>}
                    </div>
                    <input
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full h-16 border-2 border-emerald-950 bg-zinc-50 rounded-xl text-2xl px-4"
                        type="text"
                        minLength={2}
                        maxLength={12}
                        value={firstName}
                    />
                </div>

                <div className="w-11/12 flex flex-col gap-y-4">
                    <div className="w-full flex flex-row justify-between">
                        <label className="text-2xl text-white">Last Name</label>
                        {validLast && <svg className="fill-white" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 256 256"><path d="M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z"></path></svg>}
                    </div>
                    <input
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full h-16 border-2 border-emerald-950 bg-zinc-50 rounded-xl text-2xl px-4"
                        type="text"
                        minLength={2}
                        maxLength={12}
                        value={lastName}
                    />
                </div>



                <div className="w-11/12 flex flex-col gap-y-4">
                    <div className="w-full flex flex-row justify-between">
                        <label className="text-2xl text-white">Email</label>
                        {validEmail && <svg className="fill-white" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 256 256"><path d="M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z"></path></svg>}
                    </div>
                    <input
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full h-16 border-2 border-emerald-950 bg-zinc-50 rounded-xl text-2xl px-4"
                        type="email"
                        value={email}
                    />
                </div>

                <div className="w-11/12 flex flex-col gap-y-4">
                    <div className="w-full flex flex-row justify-between">
                        <label className="text-2xl text-white">Phone Number</label>
                        {validPhoneNumber && <svg className="fill-white" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 256 256"><path d="M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z"></path></svg>}
                    </div>
                    <input
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="w-full h-16 border-2 border-emerald-950 bg-zinc-50 rounded-xl text-2xl px-4"
                        type="text"
                        maxLength={10}
                        value={phoneNumber}
                    />
                </div>


                <div className="w-11/12 flex flex-col sm:flex-row gap-4">
                    <div className="w-full flex flex-col gap-y-4">
                        <label className="text-2xl text-white">Staff Type</label>
                        <select
                            onChange={(e) => setType(e.target.value)}
                            className="w-full h-16 border-2 border-emerald-950 text-emerald-950 bg-zinc-50 rounded-xl text-2xl px-4"
                            value={type}
                        >
                            <option value="ground-staff">Ground</option>
                            <option value="airline-staff">Airline</option>
                            <option value="gate-staff">Gate</option>
                        </select>
                    </div>

                    {/* Renders Conditionally */}
                    {(type === "airline-staff" || type === "gate-staff") && (
                        <div className="w-full flex flex-col gap-y-4">
                            <label className="text-2xl text-white">Airlines Code</label>
                            <input
                                onChange={(e) => setAirline(e.target.value.toUpperCase())}
                                maxLength={2}
                                className="w-full h-16 border-2 border-emerald-950 bg-zinc-50 rounded-xl text-2xl px-4"
                                type="text"
                                value={airline}
                            />
                        </div>
                    )}
                </div>

                <button type="submit" className={`hover:scale-105 absolute bottom-0 -right-[120px]  mt-2 rounded-full bg-emerald-800 border-2 border-emerald-950 size-24 sm:size-28 gap-y-4 text-white transition-all duration-500 flex flex-col justify-center items-center
                                    ${validForm ? '' : 'ease-in opacity-0 pointer-events-none'}`}>
                    <svg className="fill-white" xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="#000000" viewBox="0 0 256 256"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm48-88a8,8,0,0,1-8,8H136v32a8,8,0,0,1-16,0V136H88a8,8,0,0,1,0-16h32V88a8,8,0,0,1,16,0v32h32A8,8,0,0,1,176,128Z"></path></svg>
                </button>
            </form>
        </div>
    )
}
