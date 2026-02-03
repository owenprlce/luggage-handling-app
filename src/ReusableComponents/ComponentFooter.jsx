export default function ComponentFooter({ title }) {
    return (
        <div className="z-10 p-8 absolute h-40 w-full bottom-0 flex justify-center items-center bg-orange-50">
            <p className="font-normal text-7xl text-emerald-950 italic">{title}</p>
        </div>
    )
}