import { useState, useEffect } from "react"



export default function Authentication({ setUserInformation, setRole }) {

    const [username, setUsername] = useState(null)
    const [password, setPassword] = useState(null)
    const [view, setView] = useState(true)

    return (
        <>
            <div className="fixed w-full h-full flex flex-row">
                <div className="h-full w-auto shadow-xl/30">
                    <img className="w-full h-full object-scale-down" src={`${import.meta.env.BASE_URL}luggage.jpg`} alt="" />
                </div>
                <div className="relative h-full flex-1 bg-emerald-950 flex justify-center items-center overflow-hidden inset-shadow-sm">
                    {
                        view ? (
                            <AuthenticationPanel setUserInformation={setUserInformation} username={username} password={password} setView={setView} setRole={setRole} />
                        ) :
                            (
                                <ChangePasswordPanel setView={setView} />
                            )
                    }
                </div>
            </div>
        </>
    )
}

function AuthenticationPanel({ setUserInformation, setRole, setView }) {

    const users = [
        { name: 'Joe', password: 'Joe', role: 'admin' },
        { name: 'Moe', password: 'Moe', role: 'airline-staff' },
        { name: 'Row', password: 'Row', role: 'gate-staff' },
        { name: 'Bow', password: 'Bow', role: 'ground-staff' },
        { name: 'Low', password: 'Low', role: 'passenger' },
    ]

    const [username, setUsername] = useState(null)
    const [password, setPassword] = useState(null)

    // Temporary error message to display
    const [errorMessage, setErrorMessage] = useState("")
    const [errorMessageState, setErrorMessageState] = useState(false)

    useEffect(() => {
        setTimeout(() => { setErrorMessageState(false); setErrorMessage(""); }, 5000)

    }, [errorMessageState])

    function login() {
        // function body for login
        const user = users.find(u => u.name === username && u.password === password);

        if(user) {
            setRole(user.role)
            // May want to remove password attribute this later to prevent password leakage
            setUserInformation(user)
            console.log(`Logged in as ${user.name} with role ${user.role}`);

        } else {
            setErrorMessage("Invalid login credentials")
            setErrorMessageState(true)

        }
    }

    function changePassword(username, password) {
        // function body for login
    }

    return (
        <>
            <div className={`absolute top-8 right-8 h-24 w-96 transition-all ease-in-out ${errorMessageState ? 'duration-300 translate-x-0 opacity-100' : 'duration-300 translate-x-full opacity-0'}`}>
                <ErrorMessage error={errorMessage} />
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
                    <div onClick={() => setView(false)} className="w-full h-16 flex justify-center items-center border-2 border-orange-900 bg-zinc-50 rounded-xl hover:cursor-pointer">Change Password</div>
                </div>
            </div>
        </>


    )
}

function ChangePasswordPanel({ setView }) {

    const [oldPassword, setOldPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmNewPassword, setConfirmNewPassword] = useState("")

    // Temporary error message to display
    const [errorMessage, setErrorMessage] = useState("Invalid change password request")
    const [errorMessageState, setErrorMessageState] = useState(false)

    useEffect(() => {
        setTimeout(() => { setErrorMessageState(false); setErrorMessage(""); }, 5000)

    }, [errorMessageState])


    function changePassword() {
        setErrorMessageState(true);
        console.log(oldPassword + "\n" + newPassword + "\n" + confirmNewPassword);
    }



    return (

        <>
            <div className={`absolute top-8 right-8 h-24 w-96 transition-all ease-in-out ${errorMessageState ? 'duration-300 translate-x-0 opacity-100' : 'duration-300 translate-x-full opacity-0'}`}>
                <ErrorMessage error={errorMessage} />
            </div>

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
                    <div onClick={() => setView(true)} className="w-full h-16 flex justify-center items-center border-2 border-orange-900 bg-zinc-50 rounded-xl hover:cursor-pointer">Login</div>
                </div>
            </div>
        </>
    )
}

function ErrorMessage({ error }) {

    return (
        <div className="w-full h-full bg-orange-50 shadow-2xl rounded-3xl flex justify-center items-center">
            <p className="text-2xl text-black">{error}</p>
        </div>
    )
}