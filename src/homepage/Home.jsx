import Administrator from "../AdministratorView/Administrator";
import AirlineStaff from "../AirlineStaffView/AirlineStaff";
import GateStaff from "../GateStaffView/GateStaff";
import GroundStaff from "../GroundStaffView/GroundStaff";
import Passenger from "../PassgengerView/Passenger";
import Authentication from "./Authentication";
import { ChangePasswordPanel } from "./Authentication";

import { useState } from "react";



export default function Home() {
    const [role, setRole] = useState(null)
    const [userInformation, setUserInformation] = useState(null)
    const [showChangePassword, setShowChangePassword] = useState(false)

    const renderUserDashboard = () => {

        if (showChangePassword) {
            return (
                <div className="w-full min-h-screen bg-emerald-950 flex justify-center items-center px-4 py-8">
                    <div className="flex w-full max-w-3xl min-h-screen justify-center items-center">
                        <ChangePasswordPanel 
                            pendingUser={userInformation}
                            setView={setShowChangePassword}
                            setUserInformation={setUserInformation}
                            setRole={setRole}
                            isLoggedIn={true}
                        />
                    </div>
                </div>
            )
        }

        switch (role) {
            case 'admin':
                return <> <InformationHeader userInformation={userInformation} setRole={setRole} setShowChangePassword={setShowChangePassword} /> <Administrator /> </>
            case 'airline-staff':
                return <> <InformationHeader userInformation={userInformation} setRole={setRole} setShowChangePassword={setShowChangePassword} /> <AirlineStaff user={userInformation} /> </>
            case 'gate-staff':
                return <> <InformationHeader userInformation={userInformation} setRole={setRole} setShowChangePassword={setShowChangePassword} /> <GateStaff user={userInformation} /> </>
            case 'ground-staff':
                return <> <InformationHeader userInformation={userInformation} setRole={setRole} setShowChangePassword={setShowChangePassword} /> <GroundStaff user={userInformation} /> </>
            case 'passenger':
                return <> <InformationHeader userInformation={userInformation} setRole={setRole} setShowChangePassword={setShowChangePassword} /> <Passenger /> </>
            default:
                null
        }
    }

    return (
        <>
            <div className="w-full min-h-screen overflow-y-auto">
                {role !== null ? (renderUserDashboard()) : (<Authentication setUserInformation={setUserInformation} setRole={setRole} />)}
            </div>
        </>
    )
}

function InformationHeader({ userInformation, setRole, setShowChangePassword }) {

    const [show, setShow] = useState(false)

    return (
        <div className="z-30 p-4 sticky top-0 w-full h-28 bg-emerald-950 flex justify-end items-center">
            <div onClick={() => setShow(prev => !prev)}
                className={`z-40 absolute top-4 right-4 flex justify-center items-center bg-emerald-800 transition-all origin-top overflow-hidden border-2 border-emerald-700 duration-300 ease-in-out
                        ${show ? 'w-64 h-auto rounded-lg cursor-default' : 'cursor-pointer w-20 h-20 rounded-[50px]'}`}>


                {show ? (
                    <UserInformation userInformation={userInformation} setRole={setRole} setShowChangePassword={setShowChangePassword} />
                ) : (
                    <span className="text-2xl font-bold">{userInformation.username.charAt(0)}</span>
                )}
            </div>
        </div>
    )
}

function UserInformation({ userInformation, setRole, setShowChangePassword }) {

    return (
        <>
            <div className="w-full h-full p-4 flex flex-col justify-center gap-y-3 text-white">
                <div>
                    <p className="text-xl font-bold">{userInformation.username}</p>
                    <p className="text-sm text-emerald-200 capitalize">
                        {userInformation.type.replace('-', ' ')}
                    </p>
                </div>

                <div className="border-t-2 border-emerald-950/70 pt-3 text-sm">
                    {userInformation.type !== "admin" ? (
                        <div>
                            <p>Username: {userInformation.username || ''}</p>
                            <p>Email: {userInformation.emailAddress || ''}</p>
                            <p>Phone: {userInformation.phoneNumber || ''}</p>
                        </div>
                    ) : (
                        <></>
                    )}
                </div>

                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        setShowChangePassword(true);
                    }}
                    className="cursor-pointer w-full py-2 bg-orange-50 hover:bg-orange-100 text-black rounded-md transition-colors"
                >
                    Change Password
                </button>

                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        setRole(null);
                    }}
                    className="cursor-pointer w-full py-2 bg-orange-50 hover:bg-orange-100 text-black rounded-md transition-colors"
                >
                    Logout
                </button>
            </div>
        </>
    )
}
