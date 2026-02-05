import { useParams } from "react-router-dom"
import UnoCard from "./UnoCard"
import { useEffect } from "react";

export default function GameBoard({drawCard, gameState, callUno}) {

   const { PlayerId } = useParams();
   useEffect(()=>{
console.log(gameState?.currentColor)
   },[gameState])
  return (

    <div className="flex gap-8 items-center">

      <div className="flex gap-4 items-center">
        {/* Deck */}
        <div className={`relative w-32 h-40 `} onClick={()=>{drawCard(PlayerId)}} >

          <div className="absolute -top-4 -left-4 z-0">
              <UnoCard hidden />
          </div>
          <div className="absolute -top-2 -left-2 z-1">
              <UnoCard hidden />
          </div>


        

        </div>

        <div className={`relative w-32 h-40 `} >

          <div style={{ background: `${gameState?.currentColor}` }} className="absolute p-2 z-0">
            <UnoCard card={`${gameState?.lastCard}`} />
          </div>

        </div>
        
        

      
      </div>

      <div className="flex flex-col gap-2">
        {/* <div className={`w-[5rem] h-[5rem]  `}>

        </div> */}

        <div className="w-[5rem] h-[3rem] text-xl font-black  border-4 border-red-600
         flex justify-center items-center bg-zinc-100 hover:bg-zinc-200 text-black  rounded-xl"
        onClick={()=>{
            callUno(PlayerId)
            console.log("call uno")
        }}>
      
            <h1 className="select-none pointer-events-none">
              uno
            </h1>
        </div>

      

      </div>
      
    </div>
   
  )
}
