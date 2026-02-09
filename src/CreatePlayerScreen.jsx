import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { connectSocket, sendRawMessage } from "./Socket";
import { createPlayer, startGame } from "./Api";

const PLAYER_OPTIONS = [2, 3, 4];

export default function CreatePlayerScreen() {
  const navigate = useNavigate();
  const [numPlayers, setNumPlayers] = useState(2);
  const [playerName, setPlayerName] = useState("Player1");
  const [playersCreated, setPlayersCreated] = useState(false);
  const [connectionState, setConnectionState] = useState("connecting");
  const [serverNotice, setServerNotice] = useState(null);
  const [started, setStarted] = useState(false);

  const playerList = useMemo(
    () => Array.from({ length: numPlayers }, (_, i) => `Player${i + 1}`),
    [numPlayers]
  );



  const handleCreatePlayers = async() => {
    // sendRawMessage(`Game createplayer ${numPlayers}`);
    const res = await createPlayer(numPlayers);
    console.log("createPlayer", res)
    if(res.statusText == "OK"){
    await setPlayersCreated(true);
    }
    
  };

  const handleStartGame = async() => {
    const res = await startGame();
    console.log("start game", res)
    if(res.statusText == "OK"){
      await navigate(`/${playerName}`);
    }
    
  };

  return (
  <>
  {!started && (
        // ===== Landing Screen =====
         <div className="min-h-screen w-full relative">
  <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900 text-white">
    
    {/* Gambar kartu UNO */}
    <img
      src="Uno-Logo-2010.png" // ganti path sesuai folder proyekmu
      alt="UNO Card"
      className="w-128 mb-8 animate-pulse"
    />

    {/* <h1 className="text-6xl font-black mb-8 text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.8)]">
      UNO Web Game
    </h1> */}

    <p className="text-xl mb-12 animate-pulse">press to start</p>

    <button
      onClick={() => setStarted(true)}
      className="px-6 py-2 text-xl animate-pulse-glow font-bold rounded-xl bg-yellow-400 text-black shadow-[0_0_20px_8px_rgba(250,204,21,0.6)] hover:bg-yellow-300 transition transform hover:scale-105 active:scale-95"
    >
      START
    </button>
  </div>
</div>

        
      )}
      
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-6">
      <div className="w-full max-w-xl rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur p-8 shadow-2xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">UNO WebSocket Lobby</p>
            <h1 className="text-3xl font-semibold text-white mt-2">Buat Game Baru</h1>
          </div>
          {/* <div
            className={`text-xs px-3 py-1 rounded-full border ${
              connectionState === "connected"
                ? "border-emerald-400 text-emerald-300"
                : connectionState === "error"
                  ? "border-rose-400 text-rose-300"
                  : "border-slate-600 text-slate-300"
            }`}
          >
            {connectionState}
          </div> */}
        </div>

        <div className="mt-8 space-y-6">
          <div className="space-y-2">
            <label className="block text-sm text-slate-300">Jumlah pemain</label>
            <div className="flex flex-wrap gap-2">
              {PLAYER_OPTIONS.map((count) => (
                <button
                  key={count}
                  type="button"
                  onClick={() => {
                    setNumPlayers(count);
                    setPlayersCreated(false);
                  }}
                  className={`px-4 py-2 rounded-full border text-sm transition ${
                    numPlayers === count
                      ? "border-amber-400 bg-amber-400/20 text-amber-200 shadow-[0_0_20px_8px_rgba(250,204,21,0.6)] "
                      : "border-slate-700 text-slate-300 hover:border-slate-500"
                  }`}
                >
                  {count} pemain
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-[1.2fr,0.8fr]">
            <div className="space-y-2">
              <label className="block text-sm text-slate-300">Kamu sebagai</label>
              <select
                value={playerName}
                onChange={(event) => setPlayerName(event.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-400"
              >
                {playerList.map((player) => (
                  <option key={player} value={player}>
                    {player}
                  </option>
                ))}
              </select>
              <p className="text-xs text-slate-400">
                Player name ini harus sama dengan yang dibuat server (Player1, Player2, dst).
              </p>
            </div>
            <div className="space-y-2">
              <label className="block text-sm text-slate-300">Aksi</label>
              <div className="grid gap-3">
                <button
                  type="button"
                  onClick={handleCreatePlayers}
                  // disabled={connectionState !== "connected"}
                  className="w-full rounded-xl shadow-[0_0_20px_8px_rgba(250,204,21,0.6)]  bg-amber-400 px-4 py-2 text-slate-900 font-semibold shadow hover:bg-amber-300 disabled:opacity-50"
                >
                  Create Players
                </button>
                <button
                  type="button"
                  onClick={handleStartGame}
                  // disabled={!playersCreated || connectionState !== "connected"}
                  className="w-full rounded-xl border border-slate-700 px-4 py-2 text-slate-100 hover:border-amber-400 disabled:opacity-50"
                >
                  Start Game
                </button>
              </div>
            </div>
          </div>

          {serverNotice && (
            <div
              className={`rounded-xl border px-4 py-3 text-sm ${
                serverNotice.type === "error"
                  ? "border-rose-400/40 bg-rose-500/10 text-rose-200"
                  : "border-emerald-400/40 bg-emerald-500/10 text-emerald-200"
              }`}
            >
              {serverNotice.text}
            </div>
          )}

          <div className="rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-3 text-xs text-slate-400">
            <p className="font-semibold text-slate-300">Format command yang dikirim:</p>
            <p className="mt-1">`Game createplayer {numPlayers}` lalu `Game start`</p>
          </div>
        </div>
      </div>
    </div>
  </>
   
  );
}
