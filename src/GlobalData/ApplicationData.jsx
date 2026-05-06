import { createContext, useContext, useState, useEffect } from "react";
import { fetchInitialDemoData } from "../api/backend";

const Data = createContext(null);

export function ApplicationData({ children }) {
    const [staff, setStaff] = useState([]);
    const [flights, setFlights] = useState([]);
    const [passengers, setPassengers] = useState([]);
    const [bags, setBags] = useState([]);
    const [messages, setMessages] = useState([]);
    const [currentUser, setCurrentUser] = useState([]);
    const [authToken, setAuthToken] = useState(null);
    const [alerted, setAlerted] = useState([]);

    useEffect(() => {
        if (!authToken) return;

        async function loadData() {
            try {
                const data = await fetchInitialDemoData(authToken, currentUser.type);
                setFlights(data.flights);
                setPassengers(data.passengers);
                setBags(data.bags);
                setStaff(data.staff);
            } catch (err) {
                console.error("Failed to load initial data:", err);
            }
        }

        loadData();
    }, [authToken]);

    return (
        <Data.Provider
            value={{
                staff, setStaff,
                flights, setFlights,
                passengers, setPassengers,
                bags, setBags,
                messages, setMessages,
                currentUser, setCurrentUser,
                authToken, setAuthToken,
                alerted, setAlerted
            }}
        >
            {children}
        </Data.Provider>
    );
}

export function useData() {
    return useContext(Data);
}