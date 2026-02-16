import { useState, useEffect, use } from "react"

import { useData } from "../GlobalData/ApplicationData"

import { passwordRegex } from "../RegexValidation/form-validation"

import Alert from "../ReusableComponents/Alert"

export default function Authentication({ setUserInformation, setRole }) {

    const [view, setView] = useState(true)
    const [pendingUser, setPendingUser] = useState(false)

    return (
        <>
            <div className="fixed w-full h-full flex flex-row">
                <div className="h-full w-auto shadow-xl/30">
                    <img className="w-full h-full object-scale-down" src={`${import.meta.env.BASE_URL}luggage.jpg`} alt="" />
                </div>
                <div className="relative h-full flex-1 bg-emerald-950 flex justify-center items-center overflow-hidden inset-shadow-sm">
                    {
                        view ? (
                            <AuthenticationPanel
                                setUserInformation={setUserInformation}
                                setView={setView}
                                setRole={setRole}
                                setPendingUser={setPendingUser} />
                        ) :
                            (
                                <ChangePasswordPanel
                                    setView={setView}
                                    pendingUser={pendingUser}
                                    setUserInformation={setUserInformation}
                                    setRole={setRole} />
                            )
                    }
                </div>
            </div>
        </>
    )
}

function AuthenticationPanel({ setUserInformation, setRole, setView, setPendingUser }) {

    const { staff, setCurrentUser } = useData()

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

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

    function login() {
        if (username === "" || password === "") {
            setErrorMessage("Missing username or password");
            setErrorMessageState(true);
            return;
        }

        const user = staff.find(s => s.username === username && s.password === password);

        if (user) {

            if (user.changedPassword === false) {
                setErrorMessage("You must change password upon initial login!")
                setErrorMessageState(true)
                setPendingUser(user)
                setView(false)
                return;
            }

            setRole(user.type)
            setCurrentUser(user)
            console.log(user.airline)

            // May want to remove password attribute later to prevent password leakage
            setUserInformation(user)
            console.log(`Logged in as ${user.name} with role ${user.role}`);

        } else {
            setErrorMessage("Invalid login credentials")
            setErrorMessageState(true)

        }
    }

    return (
        <>
            <div className={`absolute top-8 right-8 h-24 w-96 transition-all ease-in-out shadow-2xs ${errorMessageState ? 'duration-300 translate-x-0 opacity-100' : 'duration-300 translate-x-full opacity-0'}`}>
                <Alert error={errorMessage} />
            </div>

            <div className="relative w-1/2 h-1/2 bg-orange-50 rounded-3xl flex flex-col justify-center items-center gap-y-8 shadow-2xl">
                <div className="absolute top-16">
                    <h2 className="text-5xl text-black">Airport Luggage Handler</h2>
                </div>

                <div className="w-10/12 flex flex-col gap-y-4">
                    <label className="text-2xl text-black" for="username">Username</label>
                    <input onChange={(e) => setUsername(e.target.value)} className="w-full h-16 border-2 border-orange-900 bg-zinc-50 rounded-xl text-2xl px-4" type="username" value={username} />
                </div>

                <div className="w-10/12 flex flex-col gap-y-4">
                    <label className="text-2xl text-black" for="password">Password</label>
                    <input onChange={(e) => setPassword(e.target.value)} className="w-full h-16 border-2 border-orange-900 bg-zinc-50 rounded-xl text-2xl px-4" type="password" value={password} />
                </div>

                <div className="absolute bottom-16 w-10/12 flex flex-row gap-x-4 text-black">
                    <div onClick={login} className="w-full h-16 flex justify-center items-center border-2 border-orange-900 bg-zinc-50 rounded-xl hover:cursor-pointer">Login</div>
                </div>
            </div>
        </>


    )
}

export function ChangePasswordPanel({ setView, pendingUser, setUserInformation, setRole, isLoggedIn = false }) {

    const { setCurrentUser, setStaff } = useData()

    const [oldPassword, setOldPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmNewPassword, setConfirmNewPassword] = useState("")

    // Temporary error message to display
    const [errorMessage, setErrorMessage] = useState("Invalid change password request")
    const [errorMessageState, setErrorMessageState] = useState(false)

    useEffect(() => {
        const errorMessageState = setTimeout(() => { setErrorMessageState(false); }, 3000)
        const errorMessage = setTimeout(() => { setErrorMessage(""); }, 3500)

        return () => {
            clearTimeout(errorMessageState); clearTimeout(errorMessage)
        }

    }, [errorMessageState])


    function changePassword() {
        if (!oldPassword || !newPassword || !confirmNewPassword) {
            setErrorMessageState(true)
            setErrorMessage("All fields are require!")
            return;
        }

        if (oldPassword !== pendingUser.password) {
            setErrorMessageState(true)
            setErrorMessage("Current password does not match original!")
            return;
        }

        if (!passwordRegex(newPassword)) {
            setErrorMessage("Password does not meet requirements!")
            setErrorMessageState(true)
            return;
        }

        if (newPassword !== confirmNewPassword) {
            setErrorMessageState(true)
            setErrorMessage("New passwords do not match!")
            return;
        }

        if (newPassword === oldPassword) {
            setErrorMessageState(true)
            setErrorMessage("New password must be different from old!")
            return;
        }

        setStaff(staff => staff.map(s => s.username === pendingUser.username ? { ...s, password: newPassword, changedPassword: true } : s));

        pendingUser.password = newPassword
        pendingUser.changedPassword = true

        if (isLoggedIn) {
            setView(false);
            return;
        }

        setRole(pendingUser.type)
        setCurrentUser(pendingUser)
        setUserInformation(pendingUser)
    }



    return (

        <>
            <div className={`absolute top-8 right-8 h-24 w-96 transition-all ease-in-out ${errorMessageState ? 'duration-300 translate-x-0 opacity-100' : 'duration-300 translate-x-full opacity-0'}`}>
                <Alert error={errorMessage} />
            </div>

            {isLoggedIn && (
                <div
                    onClick={() => setView(false)}
                    className="z-20 rounded-[50px] absolute top-4 left-4 bg-emerald-800 border-2 border-emerald-700 cursor-pointer"
                >
                    <div className="h-20 w-20 flex justify-center items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#FFFFFF" viewBox="0 0 256 256"><path d="M232,144a64.07,64.07,0,0,1-64,64H80a8,8,0,0,1,0-16h88a48,48,0,0,0,0-96H51.31l34.35,34.34a8,8,0,0,1-11.32,11.32l-48-48a8,8,0,0,1,0-11.32l48-48A8,8,0,0,1,85.66,45.66L51.31,80H168A64.07,64.07,0,0,1,232,144Z"></path></svg>
                    </div>
                </div>
            )}

            <div className="relative w-1/2 h-7/12 bg-orange-50 rounded-3xl flex flex-col justify-center items-center gap-y-8 shadow-2xl">
                <div className="absolute top-16">
                    <h2 className="text-5xl text-black">Change Password</h2>
                </div>

                <div className="w-10/12 flex flex-col gap-y-4">
                    <label className="text-2xl text-black" for="old-password">Original Password</label>
                    <input onChange={(e) => setOldPassword(e.target.value)} className="w-full h-16 border-2 border-orange-900 bg-zinc-50 rounded-xl text-2xl px-4" type="password" value={oldPassword} />
                </div>

                <div className="w-10/12 flex flex-col gap-y-4">
                    <label className="text-2xl text-black" for="password">New Password</label>
                    <input onChange={(e) => setNewPassword(e.target.value)} className="w-full h-16 border-2 border-orange-900 bg-zinc-50 rounded-xl text-2xl px-4" type="password" value={newPassword} />
                </div>

                <div className="w-10/12 flex flex-col gap-y-4">
                    <label className="text-2xl text-black" for="password">Confirm New Password</label>
                    <input onChange={(e) => setConfirmNewPassword(e.target.value)} className="w-full h-16 border-2 border-orange-900 bg-zinc-50 rounded-xl text-2xl px-4" type="password" value={confirmNewPassword} />
                </div>

                <div className="absolute bottom-16 w-10/12 flex flex-row gap-x-4 text-black">
                    <div onClick={() => changePassword()} className="w-full h-16 flex justify-center items-center border-2 border-orange-900 bg-zinc-50 rounded-xl hover:cursor-pointer">Change Password</div>
                </div>
            </div>
        </>
    )
}