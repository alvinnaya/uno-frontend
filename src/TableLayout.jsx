import PlayerHand from "./PlayerHand"
import OpponentHand from "./OpponentHand"
import GameBoard from "./GameBoard"
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { useGameSignalR } from "./SignalR";
import { callUno, drawCard, getCurrentState, playCard, getCard, resetGame } from "./Api";

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
    connectionState,
    connectionId,
    setGameState,
    setPlayerState
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

  const handleCallUno = async (player) => {
    try {
      await callUno(player);
      // Info notification will be handled by SignalR broadcast
    } catch (err) {
      console.error("Error calling UNO:", err);
    }
  };

  const handleDrawCard = async (player) => {
    try {
      const res = await drawCard(player);
      if (res.data && !res.data.message) {
        console.log("Draw card response:", res.data);
        setPlayerState(res.data);
      }
    } catch (err) {
      console.error("Error drawing card:", err);
    }
  };


  useEffect(() => {
    if (connectionState === "connected") {
      getCurrentState().then((res) => {
        console.log("Initial GameState:", res.data);
        if (res.data) setGameState(res.data);
      });
      getCard(PlayerId).then((res) => {
        console.log("Initial PlayerState:", res.data);
        if (res.data) setPlayerState(res.data);
      });
    }
  }, [connectionState, PlayerId, setGameState, setPlayerState]);

  useEffect(() => {
    console.log("game State", gameState)
  }, [gameState])



  // ================= PLAYER / OPPONENT MAPPING =================
  const { me, opponents } = useMemo(() => {
    // Handle both PascalCase (C#) and camelCase (JSON default)
    const allPlayers = gameState?.AllPlayers || gameState?.allPlayers;

    if (!allPlayers) return { me: null, opponents: [] };

    const me = allPlayers.find((p) => (p.Name || p.name) === PlayerId);
    const opponents = allPlayers.filter((p) => (p.Name || p.name) !== PlayerId);
    return { me, opponents };
  }, [gameState, PlayerId]);

  const topOpponent = opponents[0];
  const leftOpponent = opponents[1];
  const rightOpponent = opponents[2];




  return (
    <div className="relative w-full h-screen overflow-hidden bg-neutral-800">

      {/* navigate ke home untuk mengakhiti permainan */}
      {/* navigate ke home untuk mengakhiti permainan */}
      {(gameState?.GameEnd || gameState?.gameEnd) && (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-slate-900/95 backdrop-blur-md animate-fade-in">
          {/* Confetti/Fireworks Background Effect (Simple CSS dots implementation could be added, but keeping it clean for now) */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 left-1/4 w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
            <div className="absolute top-10 right-1/4 w-3 h-3 bg-yellow-500 rounded-full animate-ping delay-100"></div>
            <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-blue-500 rounded-full animate-ping delay-300"></div>
          </div>

          <div className="relative flex flex-col items-center p-12 text-center animate-scale-in">

            {/* Trophy Icon / Header */}
            <div className="text-8xl mb-6 filter drop-shadow-[0_0_20px_rgba(250,204,21,0.8)] animate-bounce-slow">
              🏆
            </div>

            <h1 className="text-6xl font-black text-white uppercase tracking-wider mb-2 drop-shadow-lg">
              {gameEndMessage?.name ? "WINNER!" : "GAME OVER"}
            </h1>

            <div className="text-3xl font-bold text-yellow-400 mb-12 tracking-wide uppercase">
              {gameEndMessage?.name || gameEndMessage?.Name || gameEndMessage?.winner || "No Winner"}
            </div>

            {/* Action Button */}
            <button
              onClick={async () => {
                try {
                  await resetGame(); // Call ResetGame from API
                } catch (error) {
                  console.error("Failed to reset game:", error);
                }
                navigate(`/`);
              }}
              className="group relative px-10 py-5 bg-red-600 rounded-full font-black text-2xl text-white tracking-widest uppercase shadow-[0_10px_20px_rgba(220,38,38,0.5)] hover:bg-red-500 hover:scale-110 hover:shadow-[0_15px_30px_rgba(220,38,38,0.7)] active:scale-95 transition-all duration-300"
            >
              Back to Lobby
              <span className="absolute inset-0 rounded-full ring-4 ring-white/30 group-hover:ring-white/60 transition-all"></span>
            </button>

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
            label={topOpponent.Name || topOpponent.name}
            count={topOpponent.CardCount || topOpponent.cardCount}
            isActive={(gameState?.CurrentPlayer || gameState?.currentPlayer) === (topOpponent.Name || topOpponent.name)}

          />
        </div>
      )}


      {/* ========= PLAYER KIRI ========= */}
      {leftOpponent && (
        <div className="absolute left-6 top-1/2 -translate-y-1/2">
          <OpponentHand
            direction="vertical"
            label={leftOpponent.Name || leftOpponent.name}
            count={leftOpponent.CardCount || leftOpponent.cardCount}
            isActive={(gameState?.CurrentPlayer || gameState?.currentPlayer) === (leftOpponent.Name || leftOpponent.name)}

          />
        </div>
      )}


      {/* ========= PLAYER KANAN ========= */}
      {rightOpponent && (
        <div className="absolute right-6 top-1/2 -translate-y-1/2">
          <OpponentHand
            direction="vertical"
            label={rightOpponent.Name || rightOpponent.name}
            count={rightOpponent.CardCount || rightOpponent.cardCount}
            isActive={(gameState?.CurrentPlayer || gameState?.currentPlayer) === (rightOpponent.Name || rightOpponent.name)}

          />
        </div>
      )}


      {/* TENGAH (DECK + DISCARD) */}
      <div className="absolute inset-0 flex items-center justify-center">
        <GameBoard drawCard={() => { handleDrawCard(PlayerId) }} gameState={gameState} callUno={() => handleCallUno(PlayerId)} />
      </div>

      {/* PLAYER 1 (BAWAH - KAMU) */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
        <PlayerHand
          cards={playerState?.hand}
          isActive={(gameState?.CurrentPlayer || gameState?.currentPlayer) == PlayerId}
          connectionId={connectionId}
        />
        <p className="text-center mt-2 font-bold text-yellow-500">{PlayerId}</p>
      </div>

    </div>
  )
}
