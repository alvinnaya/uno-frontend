import PlayerHand from "./PlayerHand"
import OpponentHand from "./OpponentHand"
import GameBoard from "./GameBoard"
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { useGameSignalR } from "./SignalR";
import { callUno, drawCard, getCurrentState, playCard, getCard } from "./Api";

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
      {gameState?.gameEnd && (
        <div className="w-screen h-screen bg-black/60 absolute z-50 flex flex-col items-center justify-center ">
          <div className="bg-amber-300 w-[30rem] h-[20rem] flex flex-col p-8 items-center rounded-xl ">
            <h1 className="text-3xl text-center p-6 font-bold">{`${gameEndMessage?.winner ? `Winner: ${gameEndMessage.winner}` : "Game ended"}`}</h1>
            <div className="p-4 my-16">
              <div onClick={() => { navigate(`/`); }}
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
