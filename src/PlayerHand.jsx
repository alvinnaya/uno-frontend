import { useParams } from "react-router-dom"
import UnoCard from "./UnoCard"
import { useEffect, useState } from "react";
import { playCard } from "./Api";


export default function PlayerHand({ cards, isActive}) {
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [pendingCardIndex, setPendingCardIndex] = useState(null)

  useEffect(() => {
    console.log()
    console.log("PlayerHand cards updated:", cards);
  }, [cards]);

  const playCardModif = (card, i) => {
    const cardType = card.cardType
    if (cardType === "WildDrawFour" || cardType === "Wild") {
      setPendingCardIndex(i)
      setShowColorPicker(true)
      return
    }else{

      playCard(PlayerId,i, card.cardColor)

    }
    
  }

  const handleColorPick = (color) => {
    if (pendingCardIndex === null) return
    playCard(PlayerId, pendingCardIndex, color)
    setPendingCardIndex(null)
    setShowColorPicker(false)
  }

  const closeColorPicker = () => {
    setPendingCardIndex(null)
    setShowColorPicker(false)
  }


  const { PlayerId } = useParams();
  return (
    <>
      <div className={`flex gap-0 ${isActive ? "bg-yellow-400  rounded-lg shadow-[0_0_20px_8px_rgba(250,204,21,0.6)] " : ""}`}>
        {cards?.map((card, i) => (
          <div onClick={() => playCardModif(card, i)} className={`-ml-10 first:ml-0 z-10 hover:z-50`} key={i}> 
              <UnoCard key={i} card={card.card} />
          </div>
          
        ))}
      </div>

      {showColorPicker && (
        <div className="fixed inset-0 z-[999] h-full w-full flex items-center justify-center bg-black/50">
          <div className="bg-slate-200 rounded-xl p-6 w-[18rem]">
            <div className="text-lg font-semibold mb-4">Pilih warna</div>
            <div className="grid grid-cols-2 gap-3">
              <button className="h-12 rounded-lg bg-red-500 text-white" onClick={() => handleColorPick("Red")}>
                Merah
              </button>
              <button className="h-12 rounded-lg bg-blue-500 text-white" onClick={() => handleColorPick("Blue")}>
                Biru
              </button>
              <button className="h-12 rounded-lg bg-green-500 text-white" onClick={() => handleColorPick("Green")}>
                Hijau
              </button>
              <button className="h-12 rounded-lg bg-yellow-400 text-black" onClick={() => handleColorPick("Yellow")}>
                Kuning
              </button>
            </div>
            <button className="mt-4 w-full h-10 text-slate-100 rounded-lg border border-gray-300 bg-slate-800  rounded-lg" onClick={closeColorPicker}>
              Batal
            </button>
          </div>
        </div>
      )}
    </>
  )
}
