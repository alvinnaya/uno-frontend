import { useParams } from "react-router-dom"
import UnoCard from "./UnoCard"
import { useEffect } from "react";

export default function GameBoard({ drawCard, gameState, callUno }) {

  const { PlayerId } = useParams();
  useEffect(() => {
    console.log(gameState?.currentColor)
  }, [gameState])
  return (

    <div className="flex gap-8 items-center">

      <div className="flex gap-4 items-center relative">
        {/* Deck */}
        <div className={`relative w-32 h-40 `} onClick={() => { drawCard(PlayerId) }} >

          <div className="absolute -top-4 -left-4 z-0">
            <UnoCard hidden />
          </div>
          <div className="absolute -top-2 -left-2 z-1">
            <UnoCard hidden />
          </div>




        </div>

        <div className={`relative w-32 h-40 `} >

          <div style={{ background: `${gameState?.CurrentColor || gameState?.currentColor}`, boxShadow: `0 0 20px 8px ${gameState?.CurrentColor || gameState?.currentColor}` }} className="absolute p-2 z-0 rounded-lg  ">
            <UnoCard card={`${gameState?.LastCard || gameState?.lastCard}`} />
          </div>

        </div>




      </div>

      <div className="flex flex-col gap-2">
        {/* <div className={`w-[5rem] h-[5rem]  `}>

        </div> */}

        <div
          className="w-[6rem] h-[3rem] bg-yellow-400 border-2 border-black rounded-lg shadow-lg flex justify-center items-center cursor-pointer 
                    text-black font-extrabold text-xl select-none transform transition duration-150 
                    hover:bg-yellow-300 hover:scale-105 active:scale-95 z-[30] relative pointer-events-auto"
          onClick={() => {
            console.log("tolo")
            callUno(PlayerId)
            console.log("call uno")
          }}
        >
          <h1 className="pointer-events-none drop-shadow-md">
            UNO
          </h1>
        </div>




      </div>

    </div>

  )
}
