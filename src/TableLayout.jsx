import PlayerHand from "./PlayerHand"
import OpponentHand from "./OpponentHand"
import GameBoard from "./GameBoard"
import { useParams,useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { useGameSignalR } from "./SignalR";
import { callUno, drawCard, getCurrentState, playCard } from "./Api";

export default function TableLayout({ 
 }) {

  const { PlayerId } = useParams();
  const navigate = useNavigate();

    const {
    gameState,
    playerState,
    info,
    setInfo,
    playerUno,
    gameEndMessage,
    connectionState
  } = useGameSignalR(PlayerId)

const [infoMessage, setInfoMessage] = useState("");

  // ================= INFO MESSAGE AUTO HIDE =================
  useEffect(() => {
    if (!info) return;
    setInfoMessage(info);
    const timer = setTimeout(() => {
      setInfoMessage(null);
      setInfo(null);
    }, 2500);
    return () => clearTimeout(timer);
  }, [info, setInfo]);

  // ================= GAME END MESSAGE =================
  useEffect(() => {
    if (gameEndMessage?.winner) {
      console.log("Game ended:", gameEndMessage.winner);
    }
  }, [gameEndMessage]);

  useEffect(()=>{
    const res =  getCurrentState();
    console.log("getData", res)
    
  },[connectionState])

  useEffect(()=>{
console.log("game State", gameState)
  },[gameState])

  

  // ================= PLAYER / OPPONENT MAPPING =================
  const { me, opponents } = useMemo(() => {
    if (!gameState?.AllPlayers) return { me: null, opponents: [] };
    const me = gameState.AllPlayers.find((p) => p.Name === PlayerId);
    const opponents = gameState.AllPlayers.filter((p) => p.Name !== PlayerId);
    return { me, opponents };
  }, [gameState, PlayerId]);

  const topOpponent = opponents[0];
  const leftOpponent = opponents[1];
  const rightOpponent = opponents[2];


  return (
    <div className="relative w-full h-screen overflow-hidden bg-neutral-800">

{/* navigate ke home untuk mengakhiti permainan */}
    {gameState?.GameEnd&&(
      <div className="w-screen h-screen bg-black/60 absolute z-50 flex flex-col items-center justify-center ">
          <div className="bg-amber-300 w-[30rem] h-[20rem] flex flex-col p-8 items-center rounded-xl ">
             <h1 className="text-3xl text-center p-6 font-bold">{`${infoGameEnd? infoGameEnd:"the winner are not decided yet"}`}</h1>
             <div className="p-4 my-16">
                <div onClick={()=>{gameReset();  navigate(`/`);}}
                 className="bg-red-600 select-none text-lg p-2 font-semibold rounded-lg m-auto hover:bg-red-500">end game</div>
             </div>
          </div>
      </div>

    )}

      
      

  {infoMessage && (
  <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[999] shadow-[0_0_20px_8px_rgba(250,204,21,0.6)] ">
    <div className="flex items-center justify-center max-w-sm px-6 py-4 bg-yellow-400 text-black font-extrabold text-lg rounded-xl shadow-lg border-2 border-yellow-500 animate-pop">
      {infoMessage}
    </div>
  </div>
)}





      

    
      
        {/* ========= PLAYER ATAS ========= */}
      {topOpponent && (
        <div className="absolute top-6 left-1/2 -translate-x-1/2 ">
          <OpponentHand
            direction="horizontal"
            label={topOpponent.Name}
            count={topOpponent.CardCount}
            isActive={gameState?.CurrentPlayer === topOpponent.Name}
            
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
            isActive={gameState?.CurrentPlayer === leftOpponent.Name}
            
          />
        </div>
      )}
      

   {/* ========= PLAYER KANAN ========= */}
      {rightOpponent && (
        <div className="absolute right-6 top-1/2 -translate-y-1/2">
          <OpponentHand
            direction="vertical"
            label={rightOpponent.Name}
            count={rightOpponent.CardCount}
            isActive={gameState?.CurrentPlayer === rightOpponent.Name}
            
          />
        </div>
      )}
      

      {/* TENGAH (DECK + DISCARD) */}
      <div className="absolute inset-0 flex items-center justify-center">
        <GameBoard drawCard={()=>{drawCard(PlayerId)}} gameState={gameState} callUno={callUno(PlayerId)} />
      </div>

      {/* PLAYER 1 (BAWAH - KAMU) */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
        <PlayerHand 
        cards={playerState?.hand}
        isActive={gameState?.CurrentPlayer == PlayerId}
         />
        <p className="text-center mt-2 font-bold text-yellow-500">{PlayerId}</p>
      </div>

    </div>
  )
}
