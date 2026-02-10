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
  const [connectionId, setConnectionId] = useState(null);

  const connectionRef = useRef(null);

  useEffect(() => {
    if (!playerName) return;

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`http://localhost:5047/gamehub`)
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build();

    // Event handler untuk menangani format JSON wrapper dari backend { type, data }
    const handleServerMessage = (messageString) => {
      try {
        console.log("Raw SignalR Message:", messageString);
        let payload = messageString;
        if (typeof messageString === "string") {
          payload = JSON.parse(messageString);
        }

        const { type, data } = payload;
        console.log("Parsed SignalR Type:", type);

        switch (type) {
          case "GameState":
            setGameState(data);
          case "gameState":
            setGameState(data);
          case "state":
            setGameState(data);
            break;
          case "info":
            // Handle variasi casing properti message
            console.log("info", data);
            const msg = data?.message || data?.Message;
            setInfo(msg);
            break;
          case "PlayerState":
            setPlayerState(data);
          case "playerState":
            setPlayerState(data);
            break;
          default:
            console.warn("Unknown message type:", type);
        }
      } catch (err) {
        console.error("Error parsing SignalR message:", err);
      }
    };

    // Listen ke berbagai kemungkinan nama method yang mungkin digunakan backend "Broadcast"
    connection.on("Broadcast", handleServerMessage);
    connection.on("broadcast", handleServerMessage);
    connection.on("json", handleServerMessage);
    connection.on("ReceiveMessage", handleServerMessage); // Default template name

    // Tetap listen ke event spesifik jika backend mengirim langsung (seperti playerState)
    connection.on("playerState", (data) => {
      console.log("Direct playerState received:", data);
      setPlayerState(data);
    });

    connection.on("gameState", (data) => {
      // Fallback jika dikirim ke channel ini tapi formatnya wrapper
      if (data?.type === "GameState" || data?.type === "state") {
        setGameState(data.data);
      } else {
        setGameState(data);
      }
    });

    connection.on("GameState", (data) => {
      if (data?.type === "GameState") {
        setGameState(data.data);
      } else {
        setGameState(data);
      }
    });

    connection.on("info", (data) => {
      // Fallback casing
      const msg = data?.message || data?.Message || data?.data?.message;
      setInfo(msg);
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
        // Get connectionId after connection is established
        setConnectionId(connection.connectionId);
        console.log("SignalR connectionId:", connection.connectionId);
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
    connectionId,

    setInfo,
    setGameState,
    setPlayerState,
    connection: connectionRef.current,
  };
}
