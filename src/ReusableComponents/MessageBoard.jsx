import { useData } from "../GlobalData/ApplicationData";

export default function MessageBoard({ airline, role }) {

    const { messages } = useData()

    const messagesToDisplay = messages.filter(msg => {
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

    if (messagesToDisplay.length < 1) return (
        <div className="w-full h-full bg-orange-50 flex justify-center items-center">
            <p className="text-emerald-950 text-6xl">No messages</p>
        </div>
    );

    return (
        <div className="w-screen h-screen flex justify-center items-center bg-orange-50">
            <div className="w-9/12 h-auto max-h-9/12 p-4 grid grid-cols-3 gap-6 overflow-y-scroll">
                {messagesToDisplay.map((msg, idx) => (
                    <div key={idx} className="p-4 bg-emerald-800 rounded-xl border-2 border-emerald-950 shadow-md flex flex-col gap-2">
                        <p className="text-white font-semibold">{msg.msg}</p>

                        {(msg.airline || msg.flightNumber || msg.terminal || msg.gate || msg.from || msg.fromWhom) && (
                            <span className="text-sm text-white flex flex-col justify-start items-start gap-2 py-2">
                                {msg.airline && <p>{`Airline: ${msg.airline}`}</p>}
                                {msg.flightNumber && <p>{`Flight Number: ${msg.flightNumber}`}</p>}
                                {msg.terminal && <p>{`Terminal: ${msg.terminal}`}</p>}
                                {msg.gate && <p>{`Gate: ${msg.gate}`}</p>}
                                {msg.from && <p>{`${msg.from} ${msg.fromWhom}`}</p>}
                            </span>
                        )}

                        <span className="text-xs text-white">{new Date(msg.time).toLocaleString()}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}