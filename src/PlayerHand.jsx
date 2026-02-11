import { useParams } from "react-router-dom"
import UnoCard from "./UnoCard"
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { playCard } from "./Api";


export default function PlayerHand({ cards, isActive, connectionId }) {
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
    } else {

      playCard(PlayerId, i, card.cardColor, connectionId)

    }

  }

  const handleColorPick = (color) => {
    if (pendingCardIndex === null) return
    playCard(PlayerId, pendingCardIndex, color, connectionId)
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

      {showColorPicker && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in">
          {/* Main Overlay Container */}
          <div className="relative bg-slate-900 border-4 border-white rounded-3xl p-8 shadow-2xl max-w-sm w-full mx-4 transform animate-scale-in">

            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-black text-white uppercase tracking-wider drop-shadow-md">
                Choose a Color
              </h2>
              <p className="text-slate-400 text-sm mt-1 font-bold uppercase tracking-widest">
                Wild Card Active
              </p>
            </div>

            {/* Color Grid */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              {/* Red */}
              <button
                onClick={() => handleColorPick("Red")}
                className="group relative h-24 rounded-2xl bg-red-500 border-b-4 border-red-700 active:border-b-0 active:translate-y-1 transition-all hover:brightness-110 shadow-lg"
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="sr-only">Red</span>
                  <div className="w-12 h-12 bg-white/20 rounded-full group-hover:scale-110 transition-transform"></div>
                </div>
              </button>

              {/* Blue */}
              <button
                onClick={() => handleColorPick("Blue")}
                className="group relative h-24 rounded-2xl bg-blue-500 border-b-4 border-blue-700 active:border-b-0 active:translate-y-1 transition-all hover:brightness-110 shadow-lg"
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="sr-only">Blue</span>
                  <div className="w-12 h-12 bg-white/20 rounded-full group-hover:scale-110 transition-transform"></div>
                </div>
              </button>

              {/* Green */}
              <button
                onClick={() => handleColorPick("Green")}
                className="group relative h-24 rounded-2xl bg-green-500 border-b-4 border-green-700 active:border-b-0 active:translate-y-1 transition-all hover:brightness-110 shadow-lg"
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="sr-only">Green</span>
                  <div className="w-12 h-12 bg-white/20 rounded-full group-hover:scale-110 transition-transform"></div>
                </div>
              </button>

              {/* Yellow */}
              <button
                onClick={() => handleColorPick("Yellow")}
                className="group relative h-24 rounded-2xl bg-yellow-400 border-b-4 border-yellow-600 active:border-b-0 active:translate-y-1 transition-all hover:brightness-110 shadow-lg"
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="sr-only">Yellow</span>
                  <div className="w-12 h-12 bg-white/20 rounded-full group-hover:scale-110 transition-transform"></div>
                </div>
              </button>
            </div>

            {/* Cancel Button */}
            <button
              onClick={closeColorPicker}
              className="w-full py-3 rounded-xl border-2 border-slate-700 text-slate-400 font-bold hover:bg-slate-800 hover:text-white hover:border-slate-500 transition-colors"
            >
              CANCEL
            </button>

          </div>
        </div>,
        document.body
      )}
    </>
  )
}
