import { useCallback, useEffect, useState } from "react"
import { connectSocket, sendRawMessage } from "./Socket"

export function useGameSocket() {
  const [gameState, setGameState] = useState(null)
  const [playerState, setPlayerState] = useState(null)
  const [info, setInfo] = useState(null)
  const [error, setError] = useState(null)
  const [connectionState, setConnectionState] = useState("connecting")
  const [lastRawMessage, setLastRawMessage] = useState(null)
  const [playerUno, setPlayerUno] = useState(null)
  const [gameEndMessege, setGameEndMessege] = useState(null)

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
            console.log("info",message.data?.message )
            
            setInfo(message.data?.message )
            break

          case "error":
            setError(message.data?.message ?? message.data)
            break

          case "RAW_MESSAGE":
            setLastRawMessage(message.data)
            break
          case "UnoState":
            setPlayerUno(message.data);
            break
          case "GameEnd":
            setGameEndMessege(message.data)

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

  const startGame = useCallback(() => {
    sendRawMessage("Game start")
  }, [])

  const getCurrentState = useCallback(() => {
    sendRawMessage("Game getcurrentstate")
    console.log("Requested current state")
  }, [])

  const getPlayerCards = useCallback((playerName) => {
    if (!playerName) return
    sendRawMessage(`${playerName} getcard`)
  }, [])

  const playCard = useCallback((playerName, cardIndex, color) => {
    if (!playerName && playerName !== 0) return
    sendRawMessage(`${playerName} play ${cardIndex} ${color}`)
  }, [])

  const drawCard = useCallback((playerName) => {
    if (!playerName && playerName !== 0) return
    sendRawMessage(`${playerName} draw`)
  }, [])

  const callUno = useCallback((playerName) => {
    if (!playerName) return
    sendRawMessage(`${playerName} uno`)
  }, [])

  const gameReset = useCallback(() =>{
    sendRawMessage(`Game reset`)
  },[])

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
    setInfo,
    playerUno,
    gameEndMessege,
    gameReset
  }
}
