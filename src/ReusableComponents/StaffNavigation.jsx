export default function StaffNavigation({ type, setView }) {

    const staffMapping = {
        "airline-staff": <AirlineStaff setView={setView} />,
        "gate-staff": <GateStaff setView={setView} />,
        "ground-staff": <GroundStaff setView={setView} />,

    }

    return (
        <div className={`z-0 h-full bg-emerald-800 outline-2 outline-emerald-950 rounded-tr-2xl rounded-br-2xl shadow-2xs`}>
            {staffMapping[type]}
        </div>
    )
}

function AirlineStaff({ setView }) {
    return (
        // Been here
        <div className="p-4 gap-6 w-full h-full flex flex-col justify-center items-center">

            <div
                onClick={() => setView("check-in")}
                className="transition-all duration-150 ease-in hover:scale-105 p-2 w-full bg-emerald-950 h-24 flex justify-center items-center rounded-xl shadow-md">
                <div className="w-full p-2 flex flex-row justify-between items-center gap-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#FFFFFF" viewBox="0 0 256 256"><path d="M221.35,104.11a8,8,0,0,0-6.57,9.21A88.85,88.85,0,0,1,216,128a87.62,87.62,0,0,1-22.24,58.41,79.66,79.66,0,0,0-36.06-28.75,48,48,0,1,0-59.4,0,79.66,79.66,0,0,0-36.06,28.75A88,88,0,0,1,128,40a88.76,88.76,0,0,1,14.68,1.22,8,8,0,0,0,2.64-15.78,103.92,103.92,0,1,0,85.24,85.24A8,8,0,0,0,221.35,104.11ZM96,120a32,32,0,1,1,32,32A32,32,0,0,1,96,120ZM74.08,197.5a64,64,0,0,1,107.84,0,87.83,87.83,0,0,1-107.84,0ZM237.66,45.66l-32,32a8,8,0,0,1-11.32,0l-16-16a8,8,0,0,1,11.32-11.32L200,60.69l26.34-26.35a8,8,0,0,1,11.32,11.32Z"></path></svg>
                    <p className="text-2xl text-white">Check-in</p>
                </div>
            </div>

            <div
                onClick={() => setView("view-flights")}
                className="transition-all duration-150 ease-in hover:scale-105 p-2 w-full bg-emerald-950 h-24 flex justify-center items-center rounded-xl shadow-md">
                <div className="p-2 w-full flex flex-row justify-between items-center gap-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#FFFFFF" viewBox="0 0 256 256"><path d="M235.58,128.84,160,91.06V48a32,32,0,0,0-64,0V91.06L20.42,128.84A8,8,0,0,0,16,136v32a8,8,0,0,0,9.57,7.84L96,161.76v18.93L82.34,194.34A8,8,0,0,0,80,200v32a8,8,0,0,0,11,7.43l37-14.81,37,14.81A8,8,0,0,0,176,232V200a8,8,0,0,0-2.34-5.66L160,180.69V161.76l70.43,14.08A8,8,0,0,0,240,168V136A8,8,0,0,0,235.58,128.84ZM224,158.24l-70.43-14.08A8,8,0,0,0,144,152v32a8,8,0,0,0,2.34,5.66L160,203.31v16.87l-29-11.61a8,8,0,0,0-5.94,0L96,220.18V203.31l13.66-13.65A8,8,0,0,0,112,184V152a8,8,0,0,0-9.57-7.84L32,158.24v-17.3l75.58-37.78A8,8,0,0,0,112,96V48a16,16,0,0,1,32,0V96a8,8,0,0,0,4.42,7.16L224,140.94Z"></path></svg>
                    <p className="text-2xl text-white">Flight List</p>
                </div>
            </div>

            <div
                onClick={() => setView("message-board")}
                className="transition-all duration-150 ease-in hover:scale-105 p-2 w-full bg-emerald-950 h-24 flex justify-center items-center rounded-xl shadow-md">
                <div className="p-2 w-full flex flex-row justify-between items-center gap-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#FFFFFF" viewBox="0 0 256 256"><path d="M216,80H184V48a16,16,0,0,0-16-16H40A16,16,0,0,0,24,48V176a8,8,0,0,0,13,6.22L72,154V184a16,16,0,0,0,16,16h93.59L219,230.22a8,8,0,0,0,5,1.78,8,8,0,0,0,8-8V96A16,16,0,0,0,216,80ZM66.55,137.78,40,159.25V48H168v88H71.58A8,8,0,0,0,66.55,137.78ZM216,207.25l-26.55-21.47a8,8,0,0,0-5-1.78H88V152h80a16,16,0,0,0,16-16V96h32Z"></path></svg>
                    <p className="text-2xl text-white">Message Board</p>
                </div>
            </div>

        </div>
    )
}

function GateStaff({ setView }) {
    return (
        <div className="p-4 gap-6 w-full h-full flex flex-col justify-center items-center">
            <div
                onClick={() => setView("manage-bags")}
                className="transition-all duration-150 ease-in hover:scale-105 p-2 w-full bg-emerald-950 h-24 flex justify-center items-center rounded-xl shadow-md">
                <div className="p-2 w-full flex flex-row justify-between items-center gap-4">
                    <svg className="fill-white" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 256 256"><path d="M224,232a8,8,0,0,1-8,8H112a8,8,0,0,1,0-16H216A8,8,0,0,1,224,232Zm0-72v32a16,16,0,0,1-16,16H114.11a15.93,15.93,0,0,1-14.32-8.85l-58.11-116a16.1,16.1,0,0,1,0-14.32l22.12-44A16,16,0,0,1,85,17.56l33.69,14.22.47.22a16,16,0,0,1,7.15,21.46,1.51,1.51,0,0,1-.11.22L112,80l31.78,64L208,144A16,16,0,0,1,224,160Zm-16,0H143.77a15.91,15.91,0,0,1-14.31-8.85l-31.79-64a16.07,16.07,0,0,1,0-14.29l.12-.22L112,46.32,78.57,32.21A4.84,4.84,0,0,1,78.1,32L56,76,114.1,192H208Z"></path></svg>
                    <p className="text-2xl text-white">Flight List</p>
                </div>
            </div>

            <div
                onClick={() => setView("message-board")}
                className="transition-all duration-150 ease-in hover:scale-105 p-2 w-full bg-emerald-950 h-24 flex justify-center items-center rounded-xl shadow-md">
                <div className="p-2 w-full flex flex-row justify-between items-center gap-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#FFFFFF" viewBox="0 0 256 256"><path d="M216,80H184V48a16,16,0,0,0-16-16H40A16,16,0,0,0,24,48V176a8,8,0,0,0,13,6.22L72,154V184a16,16,0,0,0,16,16h93.59L219,230.22a8,8,0,0,0,5,1.78,8,8,0,0,0,8-8V96A16,16,0,0,0,216,80ZM66.55,137.78,40,159.25V48H168v88H71.58A8,8,0,0,0,66.55,137.78ZM216,207.25l-26.55-21.47a8,8,0,0,0-5-1.78H88V152h80a16,16,0,0,0,16-16V96h32Z"></path></svg>
                    <p className="text-2xl text-white">Message Board</p>
                </div>
            </div>

        </div>
    )
}
function GroundStaff({ setView }) {
    return (
        <div className="p-4 gap-6 w-full h-full flex flex-col justify-center items-center">
            <div
                onClick={() => setView("boarding")}
                className="transition-all duration-150 ease-in hover:scale-105 p-2 w-full bg-emerald-950 h-24 flex justify-center items-center rounded-xl shadow-md">
                <div className="p-2 w-full flex flex-row justify-between items-center gap-4">
                    <svg className="fill-white" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 256 256"><path d="M224,232a8,8,0,0,1-8,8H112a8,8,0,0,1,0-16H216A8,8,0,0,1,224,232Zm0-72v32a16,16,0,0,1-16,16H114.11a15.93,15.93,0,0,1-14.32-8.85l-58.11-116a16.1,16.1,0,0,1,0-14.32l22.12-44A16,16,0,0,1,85,17.56l33.69,14.22.47.22a16,16,0,0,1,7.15,21.46,1.51,1.51,0,0,1-.11.22L112,80l31.78,64L208,144A16,16,0,0,1,224,160Zm-16,0H143.77a15.91,15.91,0,0,1-14.31-8.85l-31.79-64a16.07,16.07,0,0,1,0-14.29l.12-.22L112,46.32,78.57,32.21A4.84,4.84,0,0,1,78.1,32L56,76,114.1,192H208Z"></path></svg>
                    <p className="text-2xl text-white">Flight List</p>
                </div>
            </div>

            <div
                onClick={() => setView("message-board")}
                className="transition-all duration-150 ease-in hover:scale-105 p-2 w-full bg-emerald-950 h-24 flex justify-center items-center rounded-xl shadow-md">
                <div className="p-2 w-full flex flex-row justify-between items-center gap-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#FFFFFF" viewBox="0 0 256 256"><path d="M216,80H184V48a16,16,0,0,0-16-16H40A16,16,0,0,0,24,48V176a8,8,0,0,0,13,6.22L72,154V184a16,16,0,0,0,16,16h93.59L219,230.22a8,8,0,0,0,5,1.78,8,8,0,0,0,8-8V96A16,16,0,0,0,216,80ZM66.55,137.78,40,159.25V48H168v88H71.58A8,8,0,0,0,66.55,137.78ZM216,207.25l-26.55-21.47a8,8,0,0,0-5-1.78H88V152h80a16,16,0,0,0,16-16V96h32Z"></path></svg>
                    <p className="text-2xl text-white">Message Board</p>
                </div>
            </div>

        </div>
    )
}