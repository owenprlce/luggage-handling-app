import { useState } from "react"

import StaffNavigation from "../ReusableComponents/StaffNavigation";
import FlightsList from "./FlightsList";
import MessageBoard from "../ReusableComponents/MessageBoard";
import ComponentFooter from "../ReusableComponents/ComponentFooter";
import Alert from "../ReusableComponents/Alert";

import { useData } from "../GlobalData/ApplicationData";
import { checkDepartureReadiness, postMessage } from "../api/backend";

export default function GateStaff({ user }) {

    const [view, setView] = useState("manage-bags");
    const [selectedFlight, setSelectedFlight] = useState(null)

    const userAirline = user.airline;

    const renderAdminChoice = () => {
        switch (view) {
            case "manage-bags":
                return (
                    <FlightInformation
                        airline={userAirline}
                        selectedFlight={selectedFlight}
                        setSelectedFlight={setSelectedFlight}
                    />
                )
            case "message-board":
                return (<MessageBoard airline={userAirline} role={'gate-staff'} />)
        }
    }

    return (
        <>
            <div className="relative w-full h-full bg-orange-50">
                {/*<ComponentFooter title={"Gate Staff Dashboard"} /> Comment this out for now due to UI issue*/}
                {
                    !selectedFlight &&
                    <div className="z-20 absolute h-9/12 top-1/2 left-0 -translate-y-1/2">
                        <StaffNavigation setView={setView} type={'gate-staff'} />
                    </div>
                }
                {renderAdminChoice()}
            </div>
        </>
    )
}

function FlightInformation({ airline, selectedFlight, setSelectedFlight }) {

    const { authToken, currentUser } = useData()

    const [departureStatus, setDepartureStatus] = useState(null)
    const [isChecking, setIsChecking] = useState(false)
    const [notified, setNotified] = useState(false)

    const [errorMessage, setErrorMessage] = useState("")
    const [errorMessageState, setErrorMessageState] = useState(false)

    // Reusable error display helper
    function showError(msg) {
        setErrorMessage(msg)
        setErrorMessageState(true)
        setTimeout(() => setErrorMessageState(false), 3000)
        setTimeout(() => setErrorMessage(""), 3500)
    }

    // Gate staff checks if all passengers are boarded and all bags loaded
    const handleCheckDeparture = async () => {
        if (!selectedFlight) {
            showError("No flight selected")
            return
        }

        setIsChecking(true)
        try {
            const status = await checkDepartureReadiness(authToken, selectedFlight.flightId)
            setDepartureStatus(status)
        } catch (err) {
            showError(err.message || "Failed to check departure readiness.")
        } finally {
            setIsChecking(false)
        }
    }

    // Gate staff notifies admin that flight is ready to depart
    const handleNotifyAdmin = async () => {
        if (!selectedFlight) return
        try {
            await postMessage(authToken, {
                boardType:      "Admin",
                senderUsername: currentUser.username,
                senderRole:     "Gate Staff",
                content:        `Flight ${selectedFlight.flightId} is ready for departure. All passengers boarded and all bags loaded.`,
                category:       "Departure Ready",
                airlineCode:    selectedFlight.airlineCode,
            })
            setNotified(true)
            showError(`Admin notified — flight ${selectedFlight.flightId} ready for departure.`)
        } catch (err) {
            showError(err.message || "Failed to notify admin.")
        }
    }

    return (
        <div className="w-full h-full flex flex-col justify-center items-center gap-6">

            <div className={`fixed top-32 right-4 z-40 h-24 w-[min(24rem,calc(100vw-2rem))] transition-all ease-in-out ${errorMessageState ? 'duration-300 translate-x-0 opacity-100' : 'duration-300 translate-x-full opacity-0'}`}>
                <Alert error={errorMessage} />
            </div>

            <div className="w-full h-9/12 overflow-scroll">
                <FlightsList
                    airline={airline}
                    selectedFlight={selectedFlight}
                    setSelectedFlight={(flight) => {
                        setSelectedFlight(flight)
                        // Reset departure status when a new flight is selected
                        setDepartureStatus(null)
                        setNotified(false)
                    }}
                />
            </div>

            {/* Departure readiness panel — only shown when a flight is selected */}
            {selectedFlight && (
                <div className="w-full max-w-2xl absolute bottom-0 bg-emerald-800 border-2 border-emerald-950 rounded-2xl p-6 flex flex-col gap-4 mb-8">
                    <h3 className="text-2xl text-white font-bold">
                        Departure — {selectedFlight.flightId}
                    </h3>

                    {/* Check readiness button */}
                    <button
                        onClick={handleCheckDeparture}
                        disabled={isChecking}
                        className="w-full h-14 bg-orange-50 border-2 border-emerald-950 rounded-xl text-emerald-950 text-xl font-semibold hover:scale-105 transition-transform duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isChecking ? "Checking..." : "Check Departure Readiness"}
                    </button>

                    {/* Show results of the readiness check */}
                    {departureStatus && (
                        <div className="flex flex-col gap-3">
                            <div className={`p-4 rounded-xl border-2 ${departureStatus.ready_for_departure ? 'bg-green-100 border-green-500' : 'bg-red-100 border-red-400'}`}>
                                <p className="text-lg font-bold text-emerald-950">
                                    {departureStatus.ready_for_departure
                                        ? "✓ All passengers boarded and bags loaded — ready to depart"
                                        : "✗ Not ready for departure"}
                                </p>
                            </div>

                            {/* Show what's still pending */}
                            {departureStatus.passengers_not_boarded?.length > 0 && (
                                <div className="bg-orange-50 border-2 border-emerald-950 rounded-xl p-4">
                                    <p className="text-emerald-950 font-semibold mb-2">
                                        Passengers not yet boarded:
                                    </p>
                                    {departureStatus.passengers_not_boarded.map(p => (
                                        <p key={p.ticket_number} className="text-emerald-950 text-sm">
                                            — {p.name} (Ticket: {p.ticket_number})
                                        </p>
                                    ))}
                                </div>
                            )}

                            {departureStatus.bags_not_loaded?.length > 0 && (
                                <div className="bg-orange-50 border-2 border-emerald-950 rounded-xl p-4">
                                    <p className="text-emerald-950 font-semibold mb-2">
                                        Bags not yet loaded:
                                    </p>
                                    {departureStatus.bags_not_loaded.map(bagId => (
                                        <p key={bagId} className="text-emerald-950 text-sm">
                                            — Bag ID: {bagId}
                                        </p>
                                    ))}
                                </div>
                            )}

                            {/* Notify admin button — only shown when ready and not yet notified */}
                            {departureStatus.ready_for_departure && !notified && (
                                <button
                                    onClick={handleNotifyAdmin}
                                    className="w-full h-14 bg-green-500 hover:bg-green-600 border-2 border-emerald-950 rounded-xl text-white text-xl font-semibold hover:scale-105 transition-all duration-200"
                                >
                                    Notify Admin — Ready for Departure
                                </button>
                            )}

                            {notified && (
                                <p className="text-center text-green-600 font-semibold text-lg">
                                    ✓ Admin has been notified
                                </p>
                            )}
                            
                            <button
                                onClick={() => setDepartureStatus(null)}
                                className="w-full h-14 bg-gray-100 border-2 border-emerald-950 rounded-xl text-emerald-950 text-xl font-semibold hover:scale-105 transition-transform duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Close
                            </button>
                        </div>

                    )}
                </div>
            )}
        </div>
    )
}