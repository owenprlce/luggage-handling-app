import { useState } from "react"
import AddFlight from "./AdminActions/AddFlight"
import ViewFlights from "./AdminActions/ViewFlights"
import AddPassenger from "./AdminActions/AddPassenger"
import ViewPassengers from "./AdminActions/ViewPassengers"
import AddStaff from "./AdminActions/AddStaff"
import ViewStaff from "./AdminActions/ViewStaff"
import MessageBoard from "./AdminActions/MessageBoard"

export default function Administrator() {

    const [hoveredOption, setHoveredOption] = useState(null)
    const [activeView, setActiveView] = useState("Dashboard")

    const renderAdminChoice = () => {
        switch(activeView) {
            case "addFlight":
                return <AddFlight />
            case "viewFlights":
                return <ViewFlights />
            case "addPassenger":
                return <AddPassenger />
            case "viewPassengers":
                return <ViewPassengers />
            case "addStaff":
                return <AddStaff />
            case "viewStaff":
                return <ViewStaff />
            case "messageBoard":
                return <MessageBoard />
        }
    }

    const adminOptions = {
        Flights: [
            { name: "Add Flight", view: "addFlight" },
            { name: "View Flights", view: "viewFlights" }
        ],
        Passengers: [
            { name: "Add Passenger", view: "addPassenger" },
            { name: "View Passengers", view: "viewPassengers" }
        ],
        Staff: [
            { name: "Add Staff", view: "addStaff" },
            { name: "View Staff", view: "viewStaff" }
        ],
        Messages: [
            { name: "Open Board", view: "messageBoard" }
        ]
    }

    if (activeView !== "Dashboard") {
        return (
            <>
                <div onClick={() => setActiveView("Dashboard")} className="rounded-full absolute top-4 left-4 bg-emerald-800 border-2 border-emerald-700 cursor-pointer">
                    <div className="h-20 w-20 flex justify-center items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#FFFFFF" viewBox="0 0 256 256"><path d="M232,144a64.07,64.07,0,0,1-64,64H80a8,8,0,0,1,0-16h88a48,48,0,0,0,0-96H51.31l34.35,34.34a8,8,0,0,1-11.32,11.32l-48-48a8,8,0,0,1,0-11.32l48-48A8,8,0,0,1,85.66,45.66L51.31,80H168A64.07,64.07,0,0,1,232,144Z"></path></svg>
                    </div>
                </div>

                {renderAdminChoice(activeView)}
            </>
        )
    }

    return (
        <>
            <div className="w-full h-full flex flex-col justify-center items-center">
                {/* <div className="p-4 absolute w-full bottom-4 z-10 flex justify-center items-center">
                    <p className="text-6xl text-emerald-950 italic">Administrator Dashboard</p> 
                </div> */}
                <div className="bg-orange-50 w-full h-full flex justify-center items-center">
                    <div className="w-1/2 h-4/12 grid grid-cols-2 gap-8 text-6xl">
                        {["Flights", "Passengers", "Staff", "Messages"].map((option) => (
                            <div
                                className="relative bg-emerald-800 flex justify-center items-center rounded-3xl cursor-pointer text-white"
                                key={option}
                                onMouseEnter={() => setHoveredOption(option)}
                                onMouseLeave={() => setHoveredOption(null)}>

                                <p className={`${hoveredOption === option && adminOptions[option].length > 1 ? 'opacity-0' : 'opacity-100'}`}>{option}</p>

                                {hoveredOption === option && adminOptions[option].length >= 1 && (
                                    <AdminOptions options={adminOptions[option]} onSelect={setActiveView} />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}

function AdminOptions({ options, onSelect }) {
    return (
        <div className="p-4 absolute w-full h-full inset-0 rounded-3xl flex flex-col gap-4 justify-center items-center text-2xl">
            {options.map((option) => (
                <div className="w-full h-full px-6 py-2 bg-orange-50 hover:bg-orange-100 transition text-black rounded-xl flex justify-center items-center text-3xl" key={option.view} onClick={() => onSelect(option.view)}>
                    {option.name}
                </div>
            ))}
        </div>
    )
}