// App.tsx

import './tailwind.css';
import Navbar from './components/Navbar';
import Game from './components/Game';
import { AuthProvider } from './context/AuthContext'
import { LeaderboardRefreshProvider } from './context/LeaderboardRefreshContext';

const App = () => {
  return (
    <LeaderboardRefreshProvider>
      <AuthProvider>
        <div className="App bg-gray-200">
          <Navbar />
          <Game />
        </div>
      </AuthProvider>
    </LeaderboardRefreshProvider>
  );
};

export default App;
