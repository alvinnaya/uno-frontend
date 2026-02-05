import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { connectSocket, sendRawMessage } from "./Socket";

const PLAYER_OPTIONS = [2, 3, 4];

export default function CreatePlayerScreen() {
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState("");
  const [maxPlayers, setMaxPlayers] = useState(3);
  const [rooms, setRooms] = useState([]);
  const [selectedRoomId, setSelectedRoomId] = useState("");
  const [joinPlayer, setJoinPlayer] = useState("");
  const [connectionState, setConnectionState] = useState("connecting");
  const [serverNotice, setServerNotice] = useState(null);

  const selectedRoom = useMemo(
    () => rooms.find((room) => room.roomId === selectedRoomId),
    [rooms, selectedRoomId]
  );

  useEffect(() => {
    if (!selectedRoom?.players?.length) {
      setJoinPlayer("");
      return;
    }

    if (!selectedRoom.players.includes(joinPlayer)) {
      setJoinPlayer(selectedRoom.players[0]);
    }
  }, [selectedRoom, joinPlayer]);

  useEffect(() => {
    connectSocket(
      (message) => {
        if (message?.type === "error") {
          setServerNotice({ type: "error", text: message.data?.message ?? "Error" });
          return;
        }

        if (message?.type === "info") {
          setServerNotice({ type: "info", text: message.data?.message ?? "Info" });
          return;
        }

        if (message?.type === "roomList") {
          setRooms(message.data?.rooms ?? []);
          console.log("Received room list:", message.data?.rooms);
          return;
        }

        if (message?.type === "RAW_MESSAGE") {
          setServerNotice({ type: "info", text: message.data });
        }
      },
      {
        onOpen: () => {
          setConnectionState("connected");
          sendRawMessage("Game listrooms");
        },
        onClose: () => setConnectionState("disconnected"),
        onError: () => setConnectionState("error"),
      }
    );
  }, []);

  const handleCreateRoom = () => {
    if (!roomId.trim()) {
      setServerNotice({ type: "error", text: "Room ID wajib diisi." });
      return;
    }
    sendRawMessage(`Game createroom ${roomId.trim()} ${maxPlayers}`);
    setSelectedRoomId(roomId.trim());
    sendRawMessage("Game listrooms");
  };

  const handleStartGame = () => {
    if (!roomId.trim()) {
      setServerNotice({ type: "error", text: "Room ID wajib diisi untuk start." });
      return;
    }
    sendRawMessage(`Game start ${roomId.trim()}`);
  };

  const handleJoinRoom = () => {
    if (!selectedRoomId || !joinPlayer) {
      setServerNotice({ type: "error", text: "Pilih room dan player dulu." });
      return;
    }
    navigate(`/${selectedRoomId}/${joinPlayer}`);
  };

  const handleRefreshRooms = () => {
    sendRawMessage("Game listrooms");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-6">
      <div className="w-full max-w-4xl rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur p-8 shadow-2xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">UNO WebSocket Lobby</p>
            <h1 className="text-3xl font-semibold text-white mt-2">Create & Join Game Room</h1>
          </div>
          <div
            className={`text-xs px-3 py-1 rounded-full border ${
              connectionState === "connected"
                ? "border-emerald-400 text-emerald-300"
                : connectionState === "error"
                  ? "border-rose-400 text-rose-300"
                  : "border-slate-600 text-slate-300"
            }`}
          >
            {connectionState}
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="space-y-6 rounded-2xl border border-slate-800 bg-slate-950/50 p-6">
            <div>
              <h2 className="text-lg font-semibold text-white">Create Room</h2>
              <p className="text-xs text-slate-400 mt-1">Buat room baru lalu jalankan game.</p>
            </div>

            <div className="space-y-2">
              <label className="block text-sm text-slate-300">Room ID</label>
              <input
                value={roomId}
                onChange={(event) => setRoomId(event.target.value)}
                placeholder="contoh: roomA"
                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm text-slate-300">Maksimal pemain</label>
              <div className="flex flex-wrap gap-2">
                {PLAYER_OPTIONS.map((count) => (
                  <button
                    key={count}
                    type="button"
                    onClick={() => setMaxPlayers(count)}
                    className={`px-4 py-2 rounded-full border text-sm transition ${
                      maxPlayers === count
                        ? "border-amber-400 bg-amber-400/20 text-amber-200"
                        : "border-slate-700 text-slate-300 hover:border-slate-500"
                    }`}
                  >
                    {count} pemain
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <button
                type="button"
                onClick={handleCreateRoom}
                disabled={connectionState !== "connected"}
                className="w-full rounded-xl bg-amber-400 px-4 py-2 text-slate-900 font-semibold shadow hover:bg-amber-300 disabled:opacity-50"
              >
                Create Room
              </button>
              <button
                type="button"
                onClick={handleStartGame}
                disabled={connectionState !== "connected"}
                className="w-full rounded-xl border border-slate-700 px-4 py-2 text-slate-100 hover:border-amber-400 disabled:opacity-50"
              >
                Start Game
              </button>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-3 text-xs text-slate-400">
              <p className="font-semibold text-slate-300">Format command:</p>
              <p className="mt-1">`Game createroom {roomId || "<roomId>"} {maxPlayers}` lalu `Game start {roomId || "<roomId>"}`</p>
            </div>
          </div>

          <div className="space-y-6 rounded-2xl border border-slate-800 bg-slate-950/50 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-white">Join Room</h2>
                <p className="text-xs text-slate-400 mt-1">Pilih room yang sudah dibuat lalu masuk sebagai player.</p>
              </div>
              <button
                type="button"
                onClick={handleRefreshRooms}
                disabled={connectionState !== "connected"}
                className="text-xs rounded-full border border-slate-700 px-3 py-1 text-slate-300 hover:border-amber-400 disabled:opacity-50"
              >
                Refresh
              </button>
            </div>

            <div className="space-y-2">
              <label className="block text-sm text-slate-300">Room tersedia</label>
              <select
                value={selectedRoomId}
                onChange={(event) => setSelectedRoomId(event.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-400"
              >
                <option value="">-- pilih room --</option>
                {rooms.map((room) => (
                  <option key={room.roomId} value={room.roomId}>
                    {room.roomId} ({room.players?.length ?? 0} pemain)
                  </option>
                ))}
              </select>
              {rooms.length === 0 && (
                <p className="text-xs text-slate-500">Belum ada room. Buat dulu dari panel kiri.</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm text-slate-300">Masuk sebagai</label>
              <select
                value={joinPlayer}
                onChange={(event) => setJoinPlayer(event.target.value)}
                disabled={!selectedRoom?.players?.length}
                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-400 disabled:opacity-50"
              >
                <option value="">-- pilih player --</option>
                {selectedRoom?.players?.map((player) => (
                  <option key={player} value={player}>
                    {player}
                  </option>
                ))}
              </select>
              <p className="text-xs text-slate-400">
                Player name harus sesuai daftar dari server.
              </p>
            </div>

            <button
              type="button"
              onClick={handleJoinRoom}
              disabled={!selectedRoomId || !joinPlayer || connectionState !== "connected"}
              className="w-full rounded-xl bg-emerald-400 px-4 py-2 text-slate-900 font-semibold shadow hover:bg-emerald-300 disabled:opacity-50"
            >
              Join Room
            </button>

            {selectedRoom && (
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-3 text-xs text-slate-400">
                <p className="font-semibold text-slate-300">Isi room:</p>
                <p className="mt-1">{selectedRoom.players?.join(", ") || "-"}</p>
              </div>
            )}
          </div>
        </div>

        {serverNotice && (
          <div
            className={`mt-6 rounded-xl border px-4 py-3 text-sm ${
              serverNotice.type === "error"
                ? "border-rose-400/40 bg-rose-500/10 text-rose-200"
                : "border-emerald-400/40 bg-emerald-500/10 text-emerald-200"
            }`}
          >
            {serverNotice.text}
          </div>
        )}
      </div>
    </div>
  );
}
