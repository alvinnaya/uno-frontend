import UnoCard from "./UnoCard"

export default function OpponentHand({ direction = "horizontal", label, count = 7,isActive }) {
  const cards = new Array(Math.max(0, count)).fill(0)

  return (
    <div className={`flex flex-col items-center `}>
      <div
        className={`flex  ${
          direction === "vertical" ? "flex-col " : "flex-row "
        } gap-1 ${isActive ? "bg-yellow-400  rounded-lg shadow-[0_0_20px_8px_rgba(250,204,21,0.6)] animate-pulse" : ""}

`}
      >
        {cards.map((_, i) => (
            <div className={direction === "vertical" ? "-mt-30 first:mt-0 z-10 hover:z-50" : "-ml-10 first:ml-0 z-10 hover:z-50"} key={i}>
                <UnoCard key={i} hidden />
            </div>
          
        ))}
      </div>
      <p className="text-white text-sm mt-2">{label}</p>
    </div>
  )
}
