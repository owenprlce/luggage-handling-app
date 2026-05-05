export default function ComponentFooter({ title }) {
    return (
        <div className="pointer-events-none z-10 p-8 absolute min-h-24 w-full bottom-0 flex justify-center items-center bg-orange-50/95">
            <p className="font-normal text-4xl md:text-6xl lg:text-7xl text-emerald-950 italic text-center">{title}</p>
        </div>
    )
}
