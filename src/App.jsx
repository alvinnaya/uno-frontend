import './App.css'
import GameBoard from './GameBoard'
import PlayerHand from './PlayerHand'
import TableLayout from './TableLayout'
import { useGameSocket } from "./UseGameSocket"
import { Routes, Route } from "react-router-dom";
import CreatePlayerScreen from "./CreatePlayerScreen";
import { useEffect } from "react";


function App() {

  const {
    gameState,
    playerState,
    info,
    connectionState,
    playCard,
    drawCard,
    getCurrentState,
    getPlayerCards,
    callUno,
    setInfo,
    gameEndMessege,
    gameReset,
  } = useGameSocket();


  useEffect(() => {
    if (connectionState !== "connected") return;
    getCurrentState();
  

    console.log("TableLayout useEffect ran");
  }, [connectionState]);
  return (
    <>
     

       <Routes>
      <Route path="/" element={<CreatePlayerScreen />} />
      <Route path="/:PlayerId" element={<TableLayout 
        gameState={gameState}
        playerState={playerState}
        info={info}
        playCard={playCard}
        drawCard={drawCard}
        getCurrentState={getCurrentState}
        getPlayerCards={getPlayerCards}
        connectionState={connectionState}
        callUno={callUno}
        setInfo={setInfo}
        gameReset={gameReset}
        gameEndMessege={gameEndMessege}
      />} />
     
    </Routes>
    </>
  )
}

export default App
