import { useEffect, useState } from "react";
import { fetchMessages } from "../api/backend";
import { useData } from "../GlobalData/ApplicationData";

export default function MessageBoard({ airline, role }) {

    const { messages, authToken } = useData()
    const [backendMessages, setBackendMessages] = useState(null)

    const boardTypeByRole = {
        "airline-staff": "Airline",
    };

    const boardType = boardTypeByRole[role];

    useEffect(() => {
        if (!authToken || !boardType) {
            setBackendMessages(null);
            return;
        }

        let cancelled = false;

        fetchMessages(authToken, boardType)
            .then(data => {
                if (!cancelled) setBackendMessages(data);
            })
            .catch(() => {
                if (!cancelled) setBackendMessages(null);
            });

        return () => {
            cancelled = true;
        };
    }, [authToken, boardType])

    const localMessagesToDisplay = messages.filter(msg => {
        switch (role) {
            case "ground-staff":
                return msg.from === "GROUND";

            case "airline-staff":
                return msg.to === "AIRLINE" && msg.airline === airline

            case "gate-staff":
                return msg.to === "GATE" && msg.airline === airline

            case "admin":
                return msg.from === "AIRLINE" || msg.from === "GATE" || msg.from === "GROUND";

            default:
                null
        }
    })

    const messagesToDisplay = backendMessages || localMessagesToDisplay

    if (messagesToDisplay.length < 1) return (
        <div className="w-full min-h-screen bg-orange-50 flex justify-center items-center px-4 py-28">
            <p className="text-emerald-950 text-4xl md:text-6xl text-center">No messages</p>
        </div>
    );

    return (
        <div className="w-full min-h-screen flex justify-center items-center bg-orange-50 px-4 py-28">
            <div className="w-full max-w-6xl h-auto max-h-[70vh] p-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 overflow-y-auto">
                {messagesToDisplay.map((msg, idx) => (
                    <div key={idx} className="p-4 bg-emerald-800 rounded-xl border-2 border-emerald-950 shadow-md flex flex-col gap-2">
                        {msg.category && <p className="text-orange-100 text-sm font-semibold">{msg.category}</p>}
                        <p className="text-white font-semibold">{msg.content || msg.msg}</p>

                        {(msg.senderUsername || msg.senderAirline || msg.airline || msg.flightNumber || msg.terminal || msg.gate || msg.from || msg.fromWhom) && (
                            <span className="text-sm text-white flex flex-col justify-start items-start gap-2 py-2">
                                {(msg.senderAirline || msg.airline) && <p>{`Airline: ${msg.senderAirline || msg.airline}`}</p>}
                                {msg.senderUsername && <p>{`Sender: ${msg.senderUsername}`}</p>}
                                {msg.flightNumber && <p>{`Flight Number: ${msg.flightNumber}`}</p>}
                                {msg.terminal && <p>{`Terminal: ${msg.terminal}`}</p>}
                                {msg.gate && <p>{`Gate: ${msg.gate}`}</p>}
                                {msg.from && <p>{`${msg.from} ${msg.fromWhom}`}</p>}
                            </span>
                        )}

                        <span className="text-xs text-white">{new Date(msg.createdAt || msg.time).toLocaleString()}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}
