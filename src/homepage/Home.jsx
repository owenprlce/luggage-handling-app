import Administrator from "../AdministratorView/Administrator";
import AirlineStaff from "../AirlineStaffView/AirlineStaff";
import GateStaff from "../GateStaffView/GateStaff";
import GroundStaff from "../GroundStaffView/GroundStaff";
import Passenger from "../PassgengerView/Passenger";
import Authentication from "./Authentication";

import { useState } from "react";


export default function Home() {
    const [role, setRole] = useState(null)
    const [userInformation, setUserInformation] = useState(null)

    const renderUserDashboard = () => {
        switch (role) {
            case 'admin':
                return <> <InformationHeader userInformation={userInformation} setRole={setRole} /> <Administrator /> </>
            case 'airline-staff':
                return <> <InformationHeader userInformation={userInformation} setRole={setRole} /> <AirlineStaff /> </>
            case 'gate-staff':
                return <> <InformationHeader userInformation={userInformation} setRole={setRole} /> <GateStaff /> </>
            case 'ground-staff':
                return <> <InformationHeader userInformation={userInformation} setRole={setRole} /> <GroundStaff /> </>
            case 'passenger':
                return <> <InformationHeader userInformation={userInformation} setRole={setRole} /> <Passenger /> </>
            default:
                null
        }
    }

    return (
        <>
            <div className="w-screen h-screen">
                {role !== null ? (renderUserDashboard()) : (<Authentication setUserInformation={setUserInformation} setRole={setRole} />)}
            </div>
        </>
    )
}

// Optional navigation bar we can integrate that is dynamic to the role the user is logged in as
// We can determine whether or not this will be important to our UI or not later on
function NavigationBar() {
    return (
        <>
        </>
    )
}

function InformationHeader({ userInformation, setRole }) {

    const [show, setShow] = useState(false)

    return (
        <div className="p-4 absolute w-full h-28 bg-emerald-950 flex justify-end items-center">
            <div onClick={() => setShow(prev => !prev)}
                className={`absolute top-4 right-4 flex justify-center items-center bg-emerald-800 transition-all duration-500 origin-top ease-in-out overflow-hidden border-2 border-emerald-700
                        ${show ? 'w-64 h-48 rounded-lg cursor-default' : 'cursor-pointer w-20 h-20 rounded-[50px] hover:bg-white hover:text-black text-white'}`}>


                {show ? (
                    <UserInformation userInformation={userInformation} setRole={setRole} />
                ) : (
                    <span className="text-2xl font-bold">{userInformation.name.charAt(0)}</span>
                )}
            </div>
        </div>
    )
}

function UserInformation({ userInformation, setRole }) {
    return (
        <div className="w-full h-full p-4 flex flex-col justify-center gap-y-3 text-white">
            <div>
                <p className="text-xl font-bold">{userInformation.name}</p>
                <p className="text-sm text-emerald-200 capitalize">
                    {userInformation.role.replace('-', ' ')}
                </p>
            </div>

            <div className="border-t-2 border-emerald-950/70 pt-3 text-sm"> {userInformation.role !== "admin" ? (
                <p>Email: {userInformation.email || ''}</p>
                // Add other userInformation attributes
            ) : (
                <></>
            )
            }
            </div>

            <button
                onClick={(e) => {
                    e.stopPropagation();
                    setRole(null);

                }}
                className="cursor-pointer mt-2 w-full py-2 bg-orange-50 hover:cursor-pointer text-black rounded-md transition-colors"
            >
                Logout
            </button>
        </div>
    )
}