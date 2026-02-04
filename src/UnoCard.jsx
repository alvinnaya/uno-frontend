import { useEffect } from "react"
import { cardImages } from "./cardImage.jsx"

export default function UnoCard({ color, value, hidden, card }) {
const parts = card?.split(" ") ?? [];
const key = `${(parts[0] ?? "").toLowerCase()}_${(parts[1] ?? "").toLowerCase()}`;
const src = cardImages[key] ?? cardImages.back;


    

  return (
    <div className="w-28  hover:-translate-y-2 transition">
      <img
        src={src}
        className="w-full h-full object-contain"
        alt="UNO card"
      />
    </div>
  )
}
