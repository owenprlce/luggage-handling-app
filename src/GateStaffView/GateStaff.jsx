import { useState } from "react"

import StaffNavigation from "../ReusableComponents/StaffNavigation";
import FlightsList from "./FlightsList";
import MessageBoard from "../ReusableComponents/MessageBoard";
import ComponentFooter from "../ReusableComponents/ComponentFooter";

export default function GateStaff({ user }) {

    const [isHovered, setIsHovered] = useState(false);
    const [view, setView] = useState("manage-bags");
    const [selectedFlight, setSelectedFlight] = useState(null)

    const userAirline = user.airline;

    const renderAdminChoice = () => {
        switch (view) {
            case "manage-bags":
                return (<FlightInformation airline={userAirline} selectedFlight={selectedFlight} setSelectedFlight={setSelectedFlight} />)
            case "message-board":
                return (<MessageBoard airline={userAirline} role={'gate-staff'} />)
        }
    }

    return (
        <>
            <div className="relative w-full min-h-screen bg-orange-50 overflow-y-auto">
                <ComponentFooter title={"Gate Staff Dashboard"} />
                {
                    !selectedFlight &&
                    <div className="z-20 absolute h-9/12 top-1/2 left-0 -translate-y-1/2">
                        <StaffNavigation setView={setView} isHovered={isHovered} type={'gate-staff'} />
                    </div>

                }

                {renderAdminChoice()}
            </div>

        </>
    )
}

function FlightInformation({ airline, selectedFlight, setSelectedFlight }) {

    return (
        <div className="w-full min-h-screen flex justify-center items-center px-4 py-28">
            <div className="w-full min-h-[70vh] overflow-auto">
                <FlightsList airline={airline} selectedFlight={selectedFlight} setSelectedFlight={setSelectedFlight} />
            </div>
        </div>
    )
}
