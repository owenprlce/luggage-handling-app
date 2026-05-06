import { useState } from "react"

import ComponentFooter from "../../ReusableComponents/ComponentFooter"
import { useData } from "../../GlobalData/ApplicationData"
import { fetchMessages } from "../../api/backend"

export default function MessageBoard() {

    const { authToken } = useData()   // <-- get token from context

    const [messages, setMessages] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        async function loadMessages() {
            try {
                const data = await fetchMessages(authToken, "Admin")
                setMessages(data)
            } catch (err) {
                setError(err.message || "Failed to load messages.")
            } finally {
                setIsLoading(false)
            }
        }
        loadMessages()
    }, [authToken])

    if (isLoading) {
        return (
            <div className="w-full h-full bg-orange-50 flex justify-center items-center">
                <p className="text-emerald-950 text-4xl">Loading messages...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="w-full h-full bg-orange-50 flex justify-center items-center">
                <p className="text-red-500 text-4xl">{error}</p>
            </div>
        )
    }

    return (
        <div className="w-full h-full bg-orange-50 flex justify-center items-center">

            <ComponentFooter title={'Message Board'} />

            {
                messages.length < 1 ? (
                    <div className="w-full h-full flex justify-center items-center">
                        <p className="text-emerald-950 text-6xl">No messages</p>
                    </div>
                ) : (
                    <div className="w-full h-full flex justify-center items-center">
                        {messages.map((m) => (
                        <div key={m.messageId} className="w-full max-w-3xl bg-white border-2 border-emerald-950 rounded-2xl p-6 flex flex-col gap-2">
                            <div className="flex justify-between items-center">
                                <span className="text-emerald-800 font-bold text-lg">{m.category}</span>
                                <span className="text-gray-400 text-sm">
                                    {new Date(m.createdAt).toLocaleString()}
                                </span>
                            </div>
                            <p className="text-emerald-950 text-xl">{m.content}</p>
                            <div className="flex gap-4 text-sm text-gray-500">
                                <span>From: {m.senderUsername}</span>
                                <span>Role: {m.senderRole}</span>
                                {m.senderAirline && <span>Airline: {m.senderAirline}</span>}
                            </div>
                        </div>
                    ))}
                    </div>
                )
            }
        </div>
    )
}