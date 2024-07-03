// App.tsx

import { useState } from 'react';
import './tailwind.css';
import Navbar from './components/Navbar';
import Game from './components/Game';
import { AuthProvider } from './context/AuthContext';
import { LeaderboardRefreshProvider } from './context/LeaderboardRefreshContext';

const App = () => {
  const [isTwoPlayer, setIsTwoPlayer] = useState(false);

  const toggleTwoPlayerMode = () => {
    setIsTwoPlayer(!isTwoPlayer);
  };

  return (
    <LeaderboardRefreshProvider>
      <AuthProvider>
        <div className="App bg-gray-200">
          <Navbar />
          <div className="flex justify-center my-4">
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded"
              onClick={toggleTwoPlayerMode}
            >
              {isTwoPlayer ? 'Switch to Single Player' : 'Switch to Two Player'}
            </button>
          </div>
          <Game isTwoPlayer={isTwoPlayer} />
        </div>
      </AuthProvider>
    </LeaderboardRefreshProvider>
  );
};

export default App;
