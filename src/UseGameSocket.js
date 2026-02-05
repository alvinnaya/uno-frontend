import { useCallback, useEffect, useState } from "react"
import { connectSocket, sendRawMessage } from "./Socket"

export function useGameSocket() {
  const [gameState, setGameState] = useState(null)
  const [playerState, setPlayerState] = useState(null)
  const [info, setInfo] = useState(null)
  const [error, setError] = useState(null)
  const [connectionState, setConnectionState] = useState("connecting")
  const [lastRawMessage, setLastRawMessage] = useState(null)

  useEffect(() => {
    connectSocket(
      (message) => {
        switch (message.type) {
          case "gameState":
            console.log("Received gameState:", message.data);
            setGameState(message.data)
            
            break

          case "playerState":
            setPlayerState(message.data)
            break

          case "info":
            setInfo(message.data?.message ?? message.data)
            break

          case "error":
            setError(message.data?.message ?? message.data)
            break

          case "RAW_MESSAGE":
            setLastRawMessage(message.data)
            break

          default:
            console.warn("Unknown message:", message)
        }
      },
      {
        onOpen: () => setConnectionState("connected"),
        onClose: () => setConnectionState("disconnected"),
        onError: () => setConnectionState("error"),
      }
    )
  }, [])

  const init = useCallback(() => {
    sendRawMessage("Game init")
  }, [])

  const createPlayers = useCallback((count) => {
    if (!count && count !== 0) return
    sendRawMessage(`Game createplayer ${count}`)
  }, [])

  const startGame = useCallback((roomId) => {
    if (!roomId) return
    sendRawMessage(`Game start ${roomId}`)
  }, [])

  const getCurrentState = useCallback((roomId) => {
    if (!roomId) return
    sendRawMessage(`Game getcurrentstate ${roomId}`)
    console.log("Requested current state")
  }, [])

  const getPlayerCards = useCallback((playerName, roomId) => {
    if (!playerName || !roomId) return
    sendRawMessage(`${playerName} getcard ${roomId}`)
  }, [])

  const playCard = useCallback((playerName, roomId, cardIndex) => {
    if (!playerName || !roomId) return
    sendRawMessage(`${playerName} play ${roomId} ${cardIndex}`)
  }, [])

  const drawCard = useCallback((playerName, roomId) => {
    if (!playerName || !roomId) return
    sendRawMessage(`${playerName} draw ${roomId}`)
  }, [])

  const callUno = useCallback((playerName, roomId) => {
    if (!playerName || !roomId) return
    sendRawMessage(`${playerName} uno ${roomId}`)
  }, [])

  return {
    gameState,
    playerState,
    info,
    error,
    connectionState,
    lastRawMessage,
    init,
    createPlayers,
    startGame,
    getCurrentState,
    getPlayerCards,
    playCard,
    drawCard,
    callUno,
  }
}
