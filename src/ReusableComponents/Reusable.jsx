export default function RemovalPopup({ toRemove, confirm, cancel, message }) {
    return (
        <div className="fixed inset-0 z-40 min-h-screen overflow-y-auto p-4 flex justify-center items-center bg-black/30 backdrop-blur-xs">
            <div className="p-8 w-full max-w-xl mx-4 bg-emerald-800 border-2 border-emerald-950 flex flex-col rounded-2xl shadow-2xl">
                <div className="w-24 h-24 mx-auto mb-8 bg-emerald-500 border-2 border-emerald-950 rounded-full flex items-center justify-center">
                    <svg className="fill-emerald-950" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 256 256"><path d="M144,200a16,16,0,1,1-16-16A16,16,0,0,1,144,200Zm-16-40a8,8,0,0,0,8-8V48a8,8,0,0,0-16,0V152A8,8,0,0,0,128,160Z"></path></svg>
                </div>


                <h2 className="text-3xl font-bold text-white text-center mb-8">
                    Confirm Deletion
                </h2>
                <p className="text-white text-xl text-center mb-16">
                    {message}
                </p>

                <div className="flex flex-col sm:flex-row gap-4 sm:gap-12">
                    <div className="w-full h-full">
                        <button
                            className="w-full h-full flex-1 p-4 bg-zinc-50 hover:bg-zinc-300 text-black rounded-xl transition-all duration-300 cursor-pointer hover:scale-105"
                            onClick={cancel}>
                            Cancel
                        </button>
                    </div>
                    <div className="w-full h-full">
                        <button
                            className="w-full h-full flex-1 p-4 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-all duration-300 cursor-pointer hover:scale-105"
                            onClick={confirm}>
                            Remove
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
