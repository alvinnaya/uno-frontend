import { useParams } from "react-router-dom"
import UnoCard from "./UnoCard"

export default function GameBoard({drawCard, gameState}) {

   const { PlayerId } = useParams();
  return (

    <div className="flex gap-4 items-center">

      <div className="flex gap-6 items-center">
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

        <div className="absolute -top-4 -left-4 z-0">
          <UnoCard card={`${gameState?.lastCard}`} />
        </div>
          


        

        </div>
        
        

      
      </div>

      <div className="flex flex-col gap-2">
        <div className={`w-[5rem] h-[5rem]  `}>

        </div>

        <div className="w-[5rem] h-[5rem]">
          <h1 className="bg-white p-4 rounded-xl text-xl">
            Uno
          </h1>

        </div>

      </div>
      
    </div>
   
  )
}
