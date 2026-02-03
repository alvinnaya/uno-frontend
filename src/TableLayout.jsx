import PlayerHand from "./PlayerHand"
import OpponentHand from "./OpponentHand"
import GameBoard from "./GameBoard"
import { useParams } from "react-router-dom";
import { useGameSocket } from "./UseGameSocket"
import { useEffect } from "react";

export default function TableLayout({ gameState, playerState, getCurrentState, playCard, drawCard, getPlayerCards, connectionState }) {

  const { PlayerId } = useParams();
  

useEffect(() => {
    if (connectionState !== "connected") return;
    getPlayerCards(PlayerId);
    console.log("Fetched player cards for", PlayerId);
  },[connectionState])
  

useEffect(() => {
  console.log("gameState updated:", gameState);
  console.log("playerState updated:", playerState);
  
}, [gameState,playerState]);



  return (
    <div className="relative w-full h-screen bg-blue-800 overflow-hidden">
      
      {/* PLAYER 3 (ATAS) */}

      {gameState?.allPlayers?.length > 1 ? 
      <div className="absolute top-6 left-1/2 -translate-x-1/2">
        <OpponentHand direction="horizontal" label="PLAYER 3" />
      </div>: null}
      

      {/* PLAYER 2 (KIRI) */}
      {gameState?.allPlayers?.length > 2 ? 
     <div className="absolute left-6 top-1/2 -translate-y-1/2">
        <OpponentHand direction="vertical" label="PLAYER 2" />
      </div>: null}
      

    {gameState?.allPlayers?.length > 3 ? 
     <div className="absolute right-6 top-1/2 -translate-y-1/2">
        <OpponentHand direction="vertical" label="PLAYER 4" />
      </div>: null}
      {/* PLAYER 4 (KANAN) */}
      

      {/* TENGAH (DECK + DISCARD) */}
      <div className="absolute inset-0 flex items-center justify-center">
        <GameBoard drawCard={drawCard} gameState={gameState}  />
      </div>

      {/* PLAYER 1 (BAWAH - KAMU) */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
        <PlayerHand playCard={playCard} cards={playerState?.hand } />
        <p className="text-center text-white mt-2">{PlayerId}</p>
      </div>

    </div>
  )
}
