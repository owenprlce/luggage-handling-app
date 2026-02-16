export default function Alert({ error }) {

    return (
        <div className="w-full h-auto bg-orange-50 border-2 border-orange-950 shadow-2xl rounded-3xl flex justify-center items-center">
            <p className="p-4 leading-relaxed wrap-break-word text-2xl h-auto text-black">{error}</p>
        </div>
    )
}