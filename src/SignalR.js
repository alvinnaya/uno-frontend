import { useCallback, useEffect, useState, useRef } from "react";
import * as signalR from "@microsoft/signalr";

export function useGameSignalR(playerName) {
  const [gameState, setGameState] = useState(null);
  const [playerState, setPlayerState] = useState(null);
  const [info, setInfo] = useState(null);
  const [error, setError] = useState(null);
  const [connectionState, setConnectionState] = useState("connecting");
  const [lastRawMessage, setLastRawMessage] = useState(null);
  const [playerUno, setPlayerUno] = useState(null);
  const [gameEndMessage, setGameEndMessage] = useState(null);

  const connectionRef = useRef(null);

  useEffect(() => {
    if (!playerName) return;

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`http://localhost:5000/ws`)
      .withAutomaticReconnect()
      .build();

    // Event handler
    connection.on("gameState", (data) => {
      console.log("Received gameState:", data);
      setGameState(data);
    });

    connection.on("playerState", (data) => {
      setPlayerState(data);
    });

    connection.on("info", (data) => {
      console.log("info:", data?.message);
      setInfo(data?.message);
    });

    connection.on("error", (data) => {
      setError(data?.message ?? data);
    });

    connection.on("UnoState", (data) => {
      setPlayerUno(data);
    });

    connection.on("GameEnd", (data) => {
      setGameEndMessage(data);
    });

    // Untuk pesan raw yang tidak dikenali
    connection.onclose(() => {
      console.log("SignalR disconnected");
      setConnectionState("disconnected");
    });

    connection.start()
      .then(() => {
        console.log("SignalR connected");
        setConnectionState("connected");
      })
      .catch((err) => {
        console.error("SignalR connection error:", err);
        setConnectionState("error");
      });

    connectionRef.current = connection;

    return () => {
      connection.stop().catch((err) => console.error("Error stopping SignalR:", err));
    };
  }, [playerName]);

  // Fungsi-fungsi dummy untuk interface sama dengan WebSocket versi lama
  
  return {
    gameState,
    playerState,
    info,
    error,
    connectionState,
    lastRawMessage,
    playerUno,
    gameEndMessage,
    
    setInfo,
    connection: connectionRef.current,
  };
}
