import './App.css'
import GameBoard from './GameBoard'
import PlayerHand from './PlayerHand'
import TableLayout from './TableLayout'
import { useGameSocket } from "./UseGameSocket"
import { Routes, Route } from "react-router-dom";
import CreatePlayerScreen from "./CreatePlayerScreen";


function App() {

const {
    gameState,
    playerState,
    connectionState,
    playCard,
    drawCard,
    getCurrentState,
    getPlayerCards,
    callUno,
  } = useGameSocket();


  return (
    <>
     

       <Routes>
      <Route path="/" element={<CreatePlayerScreen />} />
      <Route path="/:roomId/:playerId" element={<TableLayout 
        gameState={gameState}
        playerState={playerState}
        playCard={playCard}
        drawCard={drawCard}
        getCurrentState={getCurrentState}
        getPlayerCards={getPlayerCards}
        connectionState={connectionState}
        callUno={callUno}
      />} />
     
    </Routes>
    </>
  )
}

export default App
