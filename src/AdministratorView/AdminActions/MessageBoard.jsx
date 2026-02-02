import { useState } from "react"

export default function MessageBoard() {

    const [messages, setMessages] = useState([

    ])

    return (
        <div className="w-full h-full bg-orange-50 flex justify-center items-center">
            {
                messages.length < 1 ? (
                    <div className="w-full h-full flex justify-center items-center">
                        <p className="text-emerald-950 text-6xl">No messages</p>
                    </div>
                ) : (
                    <div className="w-full h-full flex justify-center items-center">
                        {messages.map((m) => {
                            <p className="text-emerald-950 text-4xl">{m}</p>
                        })}
                    </div>
                )
            }
        </div>
    )
}