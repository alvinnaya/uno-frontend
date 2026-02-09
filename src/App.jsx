import './App.css'
import GameBoard from './GameBoard'
import PlayerHand from './PlayerHand'
import TableLayout from './TableLayout'
import { useGameSocket } from "./UseGameSocket"
import { Routes, Route } from "react-router-dom";
import CreatePlayerScreen from "./CreatePlayerScreen";
import { useEffect } from "react";


function App() {


  return (
    <>
     

       <Routes>
      <Route path="/" element={<CreatePlayerScreen />} />
      <Route path="/:PlayerId" element={<TableLayout 
       
      />} />
     
    </Routes>
    </>
  )
}

export default App
