import { useState } from "react"
import AddFlight from "./AdminActions/AddFlight"
import ViewFlights from "./AdminActions/ViewFlights"
import AddPassenger from "./AdminActions/AddPassenger"
import ViewPassengers from "./AdminActions/ViewPassengers"
import AddStaff from "./AdminActions/AddStaff"
import ViewStaff from "./AdminActions/ViewStaff"
import MessageBoard from "./AdminActions/MessageBoard"

import ComponentFooter from "../ReusableComponents/ComponentFooter"

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
        Flights: {
            svg: <svg className="size-16 fill-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><path d="M235.58,128.84,160,91.06V48a32,32,0,0,0-64,0V91.06L20.42,128.84A8,8,0,0,0,16,136v32a8,8,0,0,0,9.57,7.84L96,161.76v18.93L82.34,194.34A8,8,0,0,0,80,200v32a8,8,0,0,0,11,7.43l37-14.81,37,14.81A8,8,0,0,0,176,232V200a8,8,0,0,0-2.34-5.66L160,180.69V161.76l70.43,14.08A8,8,0,0,0,240,168V136A8,8,0,0,0,235.58,128.84ZM224,158.24l-70.43-14.08A8,8,0,0,0,144,152v32a8,8,0,0,0,2.34,5.66L160,203.31v16.87l-29-11.61a8,8,0,0,0-5.94,0L96,220.18V203.31l13.66-13.65A8,8,0,0,0,112,184V152a8,8,0,0,0-9.57-7.84L32,158.24v-17.3l75.58-37.78A8,8,0,0,0,112,96V48a16,16,0,0,1,32,0V96a8,8,0,0,0,4.42,7.16L224,140.94Z"></path></svg>,
            options: [
                { name: "Add Flight", view: "addFlight" },
                { name: "View Flights", view: "viewFlights" }
            ]
        },
        Passengers: {
            svg: <svg className="size-16 fill-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><path d="M160,40a32,32,0,1,0-32,32A32,32,0,0,0,160,40ZM128,56a16,16,0,1,1,16-16A16,16,0,0,1,128,56Zm90.34,78.05L173.17,82.83a32,32,0,0,0-24-10.83H106.83a32,32,0,0,0-24,10.83L37.66,134.05a20,20,0,0,0,28.13,28.43l16.3-13.08L65.55,212.28A20,20,0,0,0,102,228.8l26-44.87,26,44.87a20,20,0,0,0,36.41-16.52L173.91,149.4l16.3,13.08a20,20,0,0,0,28.13-28.43Zm-11.51,16.77a4,4,0,0,1-5.66,0c-.21-.2-.42-.4-.65-.58L165,121.76A8,8,0,0,0,152.26,130L175.14,217a7.72,7.72,0,0,0,.48,1.35,4,4,0,1,1-7.25,3.38,6.25,6.25,0,0,0-.33-.63L134.92,164a8,8,0,0,0-13.84,0L88,221.05a6.25,6.25,0,0,0-.33.63,4,4,0,0,1-2.26,2.07,4,4,0,0,1-5-5.45,7.72,7.72,0,0,0,.48-1.35L103.74,130A8,8,0,0,0,91,121.76L55.48,150.24c-.23.18-.44.38-.65.58a4,4,0,1,1-5.66-5.65c.12-.12.23-.24.34-.37L94.83,93.41a16,16,0,0,1,12-5.41h42.34a16,16,0,0,1,12,5.41l45.32,51.39c.11.13.22.25.34.37A4,4,0,0,1,206.83,150.82Z"></path></svg>,
            options: [
                { name: "Add Passenger", view: "addPassenger" },
                { name: "View Passengers", view: "viewPassengers" }
            ]
        },
        Staff: {
            svg: <svg className="size-16 fill-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><path d="M117.25,157.92a60,60,0,1,0-66.5,0A95.83,95.83,0,0,0,3.53,195.63a8,8,0,1,0,13.4,8.74,80,80,0,0,1,134.14,0,8,8,0,0,0,13.4-8.74A95.83,95.83,0,0,0,117.25,157.92ZM40,108a44,44,0,1,1,44,44A44.05,44.05,0,0,1,40,108Zm210.14,98.7a8,8,0,0,1-11.07-2.33A79.83,79.83,0,0,0,172,168a8,8,0,0,1,0-16,44,44,0,1,0-16.34-84.87,8,8,0,1,1-5.94-14.85,60,60,0,0,1,55.53,105.64,95.83,95.83,0,0,1,47.22,37.71A8,8,0,0,1,250.14,206.7Z"></path></svg>,
            options: [
                { name: "Add Staff", view: "addStaff" },
                { name: "View Staff", view: "viewStaff" }
            ]
        },
        Messages: {
            svg: <svg className="size-16 fill-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><path d="M216,48H40A16,16,0,0,0,24,64V224a15.85,15.85,0,0,0,9.24,14.5A16.13,16.13,0,0,0,40,240a15.89,15.89,0,0,0,10.25-3.78l.09-.07L83,208H216a16,16,0,0,0,16-16V64A16,16,0,0,0,216,48ZM40,224h0ZM216,192H80a8,8,0,0,0-5.23,1.95L40,224V64H216ZM88,112a8,8,0,0,1,8-8h64a8,8,0,0,1,0,16H96A8,8,0,0,1,88,112Zm0,32a8,8,0,0,1,8-8h64a8,8,0,1,1,0,16H96A8,8,0,0,1,88,144Z"></path></svg>,
            options: [
                { name: "Open Board", view: "messageBoard" }
            ]
        }
    }

    if (activeView !== "Dashboard") {
        return (
            <>
                <div onClick={() => setActiveView("Dashboard")} className="z-20 rounded-[50px] absolute top-4 left-4 bg-emerald-800 border-2 border-emerald-700 cursor-pointer">
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
                
                <ComponentFooter title={'Administrator Dashboard'}/>
                
                <div className="bg-orange-50 w-full h-full flex justify-center items-center">
                    <div className="w-1/2 h-4/12 grid grid-cols-2 gap-8 text-6xl">
                        {Object.entries(adminOptions).map(([option, data]) => (
                            <div
                                className="w-full h-full relative bg-emerald-800 flex justify-center items-center rounded-3xl cursor-pointer text-white shadow-2xl"
                                key={option}
                                onMouseEnter={() => setHoveredOption(option)}
                                onMouseLeave={() => setHoveredOption(null)}>
                                    
                                    <div className={`p-8 w-full h-full flex flex-row justify-between items-center gap-x-4 ${hoveredOption === option && data.options.length > 1 ? 'opacity-0' : 'opacity-100'}`}>
                                        <div className="overflow-hidden">
                                           {data.svg}
                                        </div>
                                        <p>{option}</p>
                                    </div>

                                {hoveredOption === option && data.options.length >= 1 && (
                                    <AdminOptions options={data.options} onSelect={setActiveView} />
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