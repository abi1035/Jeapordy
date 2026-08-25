import { useState } from "react";
import Homepage from "./pages/Homepage";
import Gamepage from "./pages/Gamepage";
import "./App.css";

function App() {
  const [currentPage, setCurrentPage] = useState("home");

  const [participants, setParticipants] = useState([]);

  const handleStartGame = (players) => {
    setParticipants(players);
    setCurrentPage("game");
  };

  const handleBackHome = () => {
    setCurrentPage("home");
  };

  return (
    <div className="app">
      {currentPage === "home" && <Homepage onStartGame={handleStartGame} />}

      {currentPage === "game" && (
        <Gamepage participants={participants} onBackHome={handleBackHome} />
      )}
    </div>
  );
}

export default App;
