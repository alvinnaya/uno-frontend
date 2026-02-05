import PlayerHand from "./PlayerHand"
import OpponentHand from "./OpponentHand"
import GameBoard from "./GameBoard"
import { useParams } from "react-router-dom";
import { useEffect,useMemo } from "react";

export default function TableLayout({ gameState, playerState, getCurrentState, playCard, drawCard, getPlayerCards, connectionState,callUno }) {

  const { roomId, playerId } = useParams();
  

useEffect(() => {
    if (connectionState !== "connected") return;
    if (!roomId || !playerId) return;
    getCurrentState(roomId);
    getPlayerCards(playerId, roomId);
    console.log("Fetched player cards for", playerId);
  },[connectionState, roomId, playerId, getCurrentState, getPlayerCards])
  

useEffect(() => {
  console.log("gameState updated:", gameState);
  console.log("playerState updated:", playerState);
  
}, [gameState,playerState]);

useEffect(()=>{
  if (!roomId || !playerId) return;
  getPlayerCards(playerId, roomId);
},[gameState, roomId, playerId, getPlayerCards])


 const { me, opponents } = useMemo(() => {
    if (!gameState?.allPlayers) {
      return { me: null, opponents: [] };
    }

    const me = gameState.allPlayers.find(
      (p) => p.name === playerId
    );

    const opponents = gameState.allPlayers.filter(
      (p) => p.name !== playerId
    );

    return { me, opponents };
  }, [gameState, playerId]);

  /**
   * =========================
   * MAP OPPONENT POSITIONS
   * =========================
   */
  const topOpponent = opponents[0];
  const leftOpponent = opponents[1];
  const rightOpponent = opponents[2];



  return (
    <div className="relative w-full h-screen bg-blue-800 overflow-hidden">
      
        {/* ========= PLAYER ATAS ========= */}
      {topOpponent && (
        <div className="absolute top-6 left-1/2 -translate-x-1/2">
          <OpponentHand
            direction="horizontal"
            label={topOpponent.name}
            count={topOpponent.cardCount}
            isActive={gameState?.currentPlayer === topOpponent.name}
          />
        </div>
      )}
      

       {/* ========= PLAYER KIRI ========= */}
      {leftOpponent && (
        <div className="absolute left-6 top-1/2 -translate-y-1/2">
          <OpponentHand
            direction="vertical"
            label={leftOpponent.name}
            count={leftOpponent.cardCount}
            isActive={gameState?.currentPlayer === leftOpponent.name}
          />
        </div>
      )}
      

   {/* ========= PLAYER KANAN ========= */}
      {rightOpponent && (
        <div className="absolute right-6 top-1/2 -translate-y-1/2">
          <OpponentHand
            direction="vertical"
            label={rightOpponent.name}
            count={rightOpponent.cardCount}
            isActive={gameState?.currentPlayer === rightOpponent.name}
          />
        </div>
      )}
      

      {/* TENGAH (DECK + DISCARD) */}
      <div className="absolute inset-0 flex items-center justify-center">
        <GameBoard drawCard={drawCard} gameState={gameState} callUno={callUno} />
      </div>

      {/* PLAYER 1 (BAWAH - KAMU) */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
        <PlayerHand playCard={playCard} cards={playerState?.hand } />
        <p className="text-center text-white mt-2">{playerId}</p>
      </div>

    </div>
  )
}
