// App.tsx

import { useState } from 'react';
import './styles/tailwind.css';
import Navbar from './components/layout/Navbar';
import Game from './components/game/Game';
import RealDiceGame from './components/game/RealDiceGame';
import { AuthProvider } from './context/AuthContext';
import { LeaderboardRefreshProvider } from './context/LeaderboardRefreshContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalculator, faComputer, faDice, faPeopleGroup } from '@fortawesome/free-solid-svg-icons';

const App = () => {
  type GameMode = 'solo' | 'computer' | 'pass' | 'real';
  const [mode, setMode] = useState<GameMode>('solo');
  const [resetGameKey, setResetGameKey] = useState(0);
  const modes = [
    { value: 'solo' as GameMode, label: 'Solo', description: 'Classic game', icon: faDice },
    { value: 'computer' as GameMode, label: 'Computer', description: 'Strategic opponent', icon: faComputer },
    { value: 'pass' as GameMode, label: 'Pass & Play', description: 'Two players', icon: faPeopleGroup },
    { value: 'real' as GameMode, label: 'Real Dice', description: '2–6 scorecards', icon: faCalculator },
  ];

  const changeMode = (nextMode: GameMode) => { setMode(nextMode); setResetGameKey((key) => key + 1); };

  const toggleTwoPlayerMode = () => {
    changeMode(mode === 'pass' ? 'solo' : 'pass');
  };

  return (
    <LeaderboardRefreshProvider>
      <AuthProvider>
        <div className="App min-h-screen bg-deepBlack text-mintGlow font-mono">
          <Navbar isTwoPlayer={mode === 'pass'} toggleTwoPlayerMode={toggleTwoPlayerMode} />
          <main id="play">
            <div className="mode-picker" aria-label="Game mode">
              {modes.map((item) => <button key={item.value} onClick={() => changeMode(item.value)} aria-pressed={mode === item.value} className={`mode-tab ${mode === item.value ? 'mode-tab-active' : ''}`}><span className="mode-tab-icon"><FontAwesomeIcon icon={item.icon} /></span><span className="mode-tab-copy"><strong>{item.label}</strong><small>{item.description}</small></span><span className="mode-tab-status" /></button>)}
            </div>
            {mode === 'real' ? <RealDiceGame key={resetGameKey} /> : <Game key={resetGameKey} isTwoPlayer={mode !== 'solo'} isComputerOpponent={mode === 'computer'} setIsTwoPlayer={(enabled) => changeMode(enabled ? 'pass' : 'solo')} />}
          </main>
          <footer className="site-footer"><div><strong>Yahtzee!</strong><span>Play on web and iPhone with one shared account.</span></div><nav><a href="/support.html">Support</a><a href="/privacy.html">Privacy</a><a href="/terms.html">Terms</a><a href="/account-deletion.html">Delete account</a></nav><p>Yahtzee is a trademark of Hasbro. This independent game is not affiliated with or endorsed by Hasbro.</p></footer>
        </div>
      </AuthProvider>
    </LeaderboardRefreshProvider>
  );
};

export default App;
