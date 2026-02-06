import PlayerHand from "./PlayerHand"
import OpponentHand from "./OpponentHand"
import GameBoard from "./GameBoard"
import { useParams,useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";

export default function TableLayout({ 
  gameState, 
  playerState, 
  info,
  setInfo, 
  getCurrentState,
  playCard, 
  drawCard, 
  getPlayerCards, 
  connectionState, 
  callUno,
  gameEnd,
  gameReset,
  gameEndMessege,
 }) {

  const { PlayerId } = useParams();
  const [infoVisible, setInfoVisible] = useState(false)
  const [infoMessage, setInfoMessage] = useState("")
  const [infoGameEnd, setInfoGameEnd] = useState(null)
  const [isGameOver, setIsGameOver] = useState(false)
  const navigate = useNavigate();


 
useEffect(() => {
    if (connectionState !== "connected") return;
    getPlayerCards(PlayerId);
    console.log("Fetched player cards for", PlayerId);
  },[connectionState])
  

useEffect(() => {
  console.log("gameState updated:", gameState);
  console.log("playerState updated:", playerState);
  
}, [gameState,playerState]);

useEffect(()=>{
  getPlayerCards(PlayerId);
},[gameState])

useEffect(()=>{

  setInfoGameEnd(gameEndMessege?.winner)

},[gameEndMessege])

useEffect(() => {
  if (!info) return
  setInfoMessage(info)
  const timer = setTimeout(() => {
    setInfoMessage(null)
    setInfo(null)
  }, 2500)
  return () => clearTimeout(timer)
}, [info])




 const { me, opponents } = useMemo(() => {
    if (!gameState?.allPlayers) {
      return { me: null, opponents: [] };
    }

    const me = gameState.allPlayers.find(
      (p) => p.name === PlayerId
    );

    const opponents = gameState.allPlayers.filter(
      (p) => p.name !== PlayerId
    );

    return { me, opponents };
  }, [gameState, PlayerId]);

  /**
   * =========================
   * MAP OPPONENT POSITIONS
   * =========================
   */
  const topOpponent = opponents[0];
  const leftOpponent = opponents[1];
  const rightOpponent = opponents[2];



  return (
    <div className="relative w-full h-screen overflow-hidden bg-neutral-800">


    {gameState?.gameEnd&&(
      <div className="w-screen h-screen bg-black/60 absolute z-50 flex flex-col items-center justify-center ">
          <div className="bg-white w-[30rem] h-[20rem] flex flex-col p-8 items-center rounded-xl ">
             <h1 className="text-3xl text-center p-6 font-bold">{`${infoGameEnd? infoGameEnd:"the winner are not decided yet"}`}</h1>
             <div className="p-4 my-16">
                <div onClick={()=>{gameReset();  navigate(`/`);}}
                 className="bg-red-600 select-none text-lg p-2 font-semibold rounded-lg m-auto hover:bg-red-500">end game</div>
             </div>
          </div>
      </div>

    )}

      
      

      {infoMessage && (
        <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-[999] transition-opacity duration-500 bg-white`}>
          <div className="bg-white text-black px-4 py-2 rounded-lg shadow-lg">
            {infoMessage}
          </div>
        </div>
      )}


      

    
      
        {/* ========= PLAYER ATAS ========= */}
      {topOpponent && (
        <div className="absolute top-6 left-1/2 -translate-x-1/2 ">
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
        <p className="text-center text-white mt-2">{PlayerId}</p>
      </div>

    </div>
  )
}
