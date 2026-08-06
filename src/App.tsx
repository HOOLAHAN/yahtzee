// App.tsx

import { useState } from 'react';
import './styles/tailwind.css';
import Navbar from './components/layout/Navbar';
import Game from './components/game/Game';
import RealDiceGame from './components/game/RealDiceGame';
import VirtualDice from './components/game/VirtualDice';
import { AuthProvider } from './context/AuthContext';
import { LeaderboardRefreshProvider } from './context/LeaderboardRefreshContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalculator, faComputer, faDice, faPeopleGroup } from '@fortawesome/free-solid-svg-icons';

const App = () => {
  type GameMode = 'solo' | 'daily' | 'computer' | 'pass' | 'virtual' | 'real';
  const [mode, setMode] = useState<GameMode>('solo');
  const [showGameChooser, setShowGameChooser] = useState(true);
  const [resetGameKey, setResetGameKey] = useState(0);
  const gameModes = [
    { value: 'solo' as GameMode, label: 'Solo', description: 'Play a classic game at your own pace and submit your final score.', icon: faDice },
    { value: 'daily' as GameMode, label: 'Daily Challenge', description: 'Everyone gets the same dice. Play once today and compare your result.', icon: faDice },
    { value: 'computer' as GameMode, label: 'Vs Computer', description: 'Test your choices against a strategic computer opponent.', icon: faComputer },
    { value: 'pass' as GameMode, label: 'Pass & Play', description: 'Share this device and take turns in a two-player game.', icon: faPeopleGroup },
  ];
  const diceTools = [
    { value: 'virtual' as GameMode, label: 'Dice roller', description: 'Roll 1 or 2 dice', icon: faDice },
    { value: 'real' as GameMode, label: 'Scorecard', description: 'For physical dice', icon: faCalculator },
  ];

  const changeMode = (nextMode: GameMode) => { setMode(nextMode); setShowGameChooser(false); setResetGameKey((key) => key + 1); };
  return (
    <LeaderboardRefreshProvider>
      <AuthProvider>
        <div className="App min-h-screen bg-deepBlack text-mintGlow font-mono">
          <Navbar onPlay={() => setShowGameChooser(true)} />
          <main id="play">
            {showGameChooser ? <section className="game-chooser" aria-labelledby="game-chooser-heading">
              <div className="game-chooser-heading"><p className="eyebrow">Game settings</p><h2 id="game-chooser-heading" className="section-heading">Choose how to play</h2><p className="section-copy">Start a Yahtzee game or open a tool for your physical dice.</p></div>
              <div className="play-picker">
              <section className="game-mode-picker" aria-labelledby="game-mode-heading">
                <span id="game-mode-heading" className="picker-label">Play Yahtzee</span>
                <div className="game-mode-tabs">
                  {gameModes.map((item) => <button key={item.value} onClick={() => changeMode(item.value)} className="game-choice-card"><span className="game-choice-icon"><FontAwesomeIcon icon={item.icon} /></span><span><strong>{item.label}</strong><small>{item.description}</small><em>Play now →</em></span></button>)}
                </div>
              </section>
              <section className="dice-tools" aria-labelledby="dice-tools-heading">
                <span id="dice-tools-heading" className="picker-label">Dice tools</span>
                <div className="dice-tool-tabs">
                  {diceTools.map((item) => <button key={item.value} onClick={() => changeMode(item.value)} aria-pressed={mode === item.value} className={`dice-tool-tab ${mode === item.value ? 'dice-tool-tab-active' : ''}`}><span className="dice-tool-icon"><FontAwesomeIcon icon={item.icon} /></span><span><strong>{item.label}</strong><small>{item.description}</small></span></button>)}
                </div>
              </section>
              </div>
            </section> : mode === 'real' ? <RealDiceGame key={resetGameKey} /> : mode === 'virtual' ? <VirtualDice key={resetGameKey} /> : <Game key={resetGameKey} isTwoPlayer={mode === 'pass' || mode === 'computer'} isComputerOpponent={mode === 'computer'} isDailyChallenge={mode === 'daily'} setIsTwoPlayer={(enabled) => changeMode(enabled ? 'pass' : 'solo')} />}
          </main>
          <footer className="site-footer"><div><strong>Yahtzee!</strong><span>Play on web and iPhone with one shared account.</span></div><nav><a href="/support.html">Support</a><a href="/privacy.html">Privacy</a><a href="/terms.html">Terms</a><a href="/account-deletion.html">Delete account</a></nav><p>Yahtzee is a trademark of Hasbro. This independent game is not affiliated with or endorsed by Hasbro.</p></footer>
        </div>
      </AuthProvider>
    </LeaderboardRefreshProvider>
  );
};

export default App;
