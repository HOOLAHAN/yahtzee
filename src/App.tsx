// App.tsx

import { useState } from 'react';
import './styles/tailwind.css';
import Navbar from './components/Navbar';
import Game from './components/game/Game';
import { AuthProvider } from './context/AuthContext';
import { LeaderboardRefreshProvider } from './context/LeaderboardRefreshContext';

const App = () => {
  const [isTwoPlayer, setIsTwoPlayer] = useState(false);
  const [resetGameKey, setResetGameKey] = useState(0);

  const toggleTwoPlayerMode = () => {
    setIsTwoPlayer(!isTwoPlayer);
    setResetGameKey(prevKey => prevKey + 1);
  };

  return (
    <LeaderboardRefreshProvider>
      <AuthProvider>
        <div className="App bg-gray-200">
          <Navbar isTwoPlayer={isTwoPlayer} toggleTwoPlayerMode={toggleTwoPlayerMode} />
          <Game key={resetGameKey} isTwoPlayer={isTwoPlayer} setIsTwoPlayer={setIsTwoPlayer} />
        </div>
      </AuthProvider>
    </LeaderboardRefreshProvider>
  );
};

export default App;
