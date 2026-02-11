import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPlayer, startGame } from "./Api";

const PLAYER_OPTIONS = [2, 3, 4];

export default function CreatePlayerScreen() {
  const navigate = useNavigate();
  const [numPlayers, setNumPlayers] = useState(2);
  const [playerName, setPlayerName] = useState("Player1");
  const [playersCreated, setPlayersCreated] = useState(false);
  // const [connectionState, setConnectionState] = useState("connecting"); // Not used in UI currently but good to keep if needed later
  const [serverNotice, setServerNotice] = useState(null);
  const [started, setStarted] = useState(false);

  // New states for feedback
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const playerList = useMemo(
    () => Array.from({ length: numPlayers }, (_, i) => `Player${i + 1}`),
    [numPlayers]
  );

  const handleCreatePlayers = async () => {
    setIsLoading(true);
    setServerNotice(null);
    try {
      const res = await createPlayer(numPlayers);
      console.log("createPlayer", res);
      if (res.status === 200 || res.statusText === "OK") {
        setPlayersCreated(true);
        setShowSuccess(true);
      } else {
        setServerNotice({ type: "error", text: "Failed to create players. Please try again." });
      }
    } catch (error) {
      console.error("Error creating players:", error);
      setServerNotice({ type: "error", text: "Connection error. Is the server running?" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartGame = async () => {
    setIsLoading(true);
    try {
      const res = await startGame();
      console.log("start game", res);
      if (res.status === 200 || res.statusText === "OK") {
        navigate(`/${playerName}`);
      } else {
        setServerNotice({ type: "error", text: "Failed to start game." });
      }
    } catch (error) {
      console.error("Error starting game:", error);
      setServerNotice({ type: "error", text: "Connection error during start." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {!started && (
        // ===== Landing Screen =====
        <div className="min-h-screen w-full relative bg-gradient-to-br from-red-600 to-yellow-500 overflow-hidden font-sans">
          {/* Background Circles for visual interest */}
          <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-yellow-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-red-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-32 left-20 w-96 h-96 bg-orange-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>

          <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
            {/* Gambar kartu UNO */}
            <img
              src="Uno-Logo-2010.png"
              alt="UNO Card"
              className="w-80 mb-8 drop-shadow-2xl hover:scale-105 transition-transform duration-300"
            />

            <p className="text-2xl font-bold text-white mb-12 tracking-widest uppercase drop-shadow-md">
              The Classic Card Game
            </p>

            <button
              onClick={() => setStarted(true)}
              className="px-10 py-4 text-3xl font-black rounded-full bg-yellow-400 text-red-700 shadow-[0_10px_20px_rgba(0,0,0,0.2)] hover:bg-yellow-300 hover:scale-110 hover:shadow-[0_15px_25px_rgba(0,0,0,0.3)] active:scale-95 transition-all duration-200 border-4 border-white"
            >
              PLAY NOW
            </button>
          </div>
        </div>
      )}

      {started && (
        <div className="min-h-screen bg-slate-800 flex items-center justify-center py-10 px-4">
          <div className="w-full max-w-2xl relative">

            {/* Main Card Container */}
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-8 border-yellow-400">

              {/* Header */}
              <div className="bg-red-600 p-8 text-center border-b-4 border-red-700">
                <h1 className="text-4xl font-black text-white uppercase tracking-wider drop-shadow-sm">
                  Game Setup
                </h1>
                <p className="text-red-100 mt-2 font-medium">Create a lobby and invite friends!</p>
              </div>

              <div className="p-8 bg-slate-50">

                {/* Success View */}
                {showSuccess ? (
                  <div className="text-center py-10 animate-fade-in-up">
                    <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg rotate-3">
                      <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h2 className="text-3xl font-black text-slate-800 mb-2">Success!</h2>
                    <p className="text-slate-600 text-lg mb-8">Game lobby created for {numPlayers} players.</p>

                    <div className="space-y-4 max-w-xs mx-auto">
                      <div className="bg-white p-4 rounded-xl border-2 border-slate-200 shadow-sm">
                        <label className="block text-sm font-bold text-slate-500 uppercase mb-1">You are playing as</label>
                        <div className="text-2xl font-black text-blue-600">{playerName}</div>
                      </div>

                      <button
                        type="button"
                        onClick={handleStartGame}
                        disabled={isLoading}
                        className="w-full py-4 rounded-xl bg-green-500 text-white font-black text-xl shadow-[0_4px_0_rgb(21,128,61)] hover:shadow-[0_2px_0_rgb(21,128,61)] hover:translate-y-[2px] active:shadow-none active:translate-y-[4px] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isLoading ? "STARTING..." : "START GAME"}
                      </button>

                      <button
                        onClick={() => { setShowSuccess(false); setPlayersCreated(false); }}
                        className="text-slate-400 font-bold hover:text-slate-600 text-sm mt-4 underline decoration-2 underline-offset-2"
                      >
                        Reset / Back
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Form View */
                  <div className="space-y-8">
                    {/* Number of Players */}
                    <div className="space-y-3">
                      <label className="block text-lg font-black text-slate-700 uppercase">Number of Players</label>
                      <div className="flex justify-center gap-4">
                        {PLAYER_OPTIONS.map((count) => (
                          <button
                            key={count}
                            type="button"
                            onClick={() => {
                              setNumPlayers(count);
                              setPlayersCreated(false);
                            }}
                            className={`
                            w-16 h-16 rounded-2xl text-2xl font-black transition-all transform duration-200
                            ${numPlayers === count
                                ? "bg-blue-500 text-white scale-110 rotate-3 shadow-[0_8px_16px_rgba(59,130,246,0.5)] border-4 border-blue-600"
                                : "bg-white text-slate-400 border-4 border-slate-200 hover:border-blue-300 hover:text-blue-300 hover:-rotate-2"
                              }
                          `}
                          >
                            {count}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Player Selection */}
                    <div className="space-y-3">
                      <label className="block text-lg font-black text-slate-700 uppercase">Your Role</label>
                      <div className="relative">
                        <select
                          value={playerName}
                          onChange={(event) => setPlayerName(event.target.value)}
                          className="w-full appearance-none rounded-2xl border-4 border-slate-200 bg-white px-6 py-4 text-xl font-bold text-slate-700 focus:outline-none focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/20 transition-all cursor-pointer"
                        >
                          {playerList.map((player) => (
                            <option key={player} value={player}>
                              {player}
                            </option>
                          ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-6 text-slate-500">
                          <svg className="h-6 w-6 fill-current" viewBox="0 0 20 20">
                            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                          </svg>
                        </div>
                      </div>
                      <p className="text-sm font-semibold text-slate-400 text-center">
                        Ensure this matches your server assignment.
                      </p>
                    </div>

                    {/* Action Button */}
                    <div className="pt-4">
                      <button
                        type="button"
                        onClick={handleCreatePlayers}
                        disabled={isLoading}
                        className="w-full py-4 rounded-2xl bg-yellow-400 text-red-800 font-black text-2xl uppercase tracking-wider shadow-[0_6px_0_rgb(202,138,4)] hover:shadow-[0_4px_0_rgb(202,138,4)] hover:translate-y-[2px] active:shadow-none active:translate-y-[6px] transition-all disabled:opacity-50 disabled:grayscale"
                      >
                        {isLoading ? (
                          <span className="flex items-center justify-center gap-2">
                            <svg className="animate-spin h-6 w-6 text-red-800" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Creating...
                          </span>
                        ) : "Create Game"}
                      </button>
                    </div>
                  </div>
                )}

                {/* Server Notice/Error */}
                {serverNotice && (
                  <div className={`mt-6 p-4 rounded-xl border-l-4 font-bold ${serverNotice.type === "error"
                      ? "bg-red-50 border-red-500 text-red-700"
                      : "bg-green-50 border-green-500 text-green-700"
                    }`}>
                    {serverNotice.text}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="bg-slate-100 p-4 text-center border-t border-slate-200">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">UNO Game Lobby</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
