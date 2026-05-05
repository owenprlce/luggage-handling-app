import { useState } from "react"

import StaffNavigation from "../ReusableComponents/StaffNavigation"
import FlightsList from "./AirlineStaffActions/FlightsList";
import CheckIn from "./AirlineStaffActions/CheckIn";
import MessageBoard from "../ReusableComponents/MessageBoard";
import ComponentFooter from "../ReusableComponents/ComponentFooter";

export default function AirlineStaff({ user }) {

    const [isHovered, setIsHovered] = useState(false);
    const [view, setView] = useState("check-in");
    const [selectedFlight, setSelectedFlight] = useState(null)

    const userAirline = user.airline;

    const renderAdminChoice = () => {
        switch (view) {
            case "check-in":
                return (<CheckIn />)
            case "view-flights":
                return (<FlightInformation airline={userAirline} selectedFlight={selectedFlight} setSelectedFlight={setSelectedFlight} />)
            case "message-board":
                return (<MessageBoard airline={userAirline} role={'airline-staff'} />)
        }
    }

    return (
        <>
            <div className="relative w-full h-full bg-orange-50">
                <ComponentFooter title={"Airline Staff Dashboard"} />
                {
                    !selectedFlight &&
                    <div className="z-20 absolute h-9/12 top-1/2 left-0 -translate-y-1/2">
                        <StaffNavigation setView={setView} isHovered={isHovered} type={'airline-staff'} />
                    </div>

                }
                
                {renderAdminChoice()}
            </div>

        </>
    )
}

function FlightInformation({ airline, selectedFlight, setSelectedFlight }) {

    return (
        <div className="w-full h-full flex justify-center items-center">
            <div className="w-full h-9/12 overflow-scroll">
                <FlightsList airline={airline} selectedFlight={selectedFlight} setSelectedFlight={setSelectedFlight} />
            </div>
        </div>
    )
}
