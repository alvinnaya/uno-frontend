import { useParams } from "react-router-dom"
import UnoCard from "./UnoCard"
import { useEffect } from "react";


export default function PlayerHand({playCard, cards}) {

  useEffect(() => {
    console.log()
    console.log("PlayerHand cards updated:", cards);
  }, [cards]);


  const { roomId, playerId } = useParams();
  return (
    <div className="flex gap-0">
      {cards?.map((card, i) => (
        <div onClick={() => playCard(playerId, roomId, i)} className={`-ml-10 first:ml-0 z-10 hover:z-50`} key={i}> 
            <UnoCard key={i} card={card.card} />
        </div>
        
      ))}
    </div>
  )
}
