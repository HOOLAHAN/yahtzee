// App.tsx

import { useCallback, useEffect, useState } from 'react';
import './styles/tailwind.css';
import Navbar from './components/layout/Navbar';
import Game from './components/game/Game';
import RealDiceGame from './components/game/RealDiceGame';
import VirtualDice from './components/game/VirtualDice';
import { AuthProvider } from './context/AuthContext';
import { LeaderboardRefreshProvider } from './context/LeaderboardRefreshContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalculator, faComputer, faDice, faPeopleGroup } from '@fortawesome/free-solid-svg-icons';
import { SitePage } from './components/layout/Menu';
import Leaderboard from './components/common/Leaderboard';
import Progress from './components/common/Progress';
import Settings from './components/common/Settings';
import About from './components/common/About';
import AdminDashboard from './components/admin/AdminDashboard';
import { useAuth } from './context/AuthContext';

const pagePaths: Record<SitePage, string> = { play: '/play', scores: '/scores', progress: '/progress', account: '/account', about: '/about', admin: '/admin' };
const pageFromPath = (): SitePage => (Object.entries(pagePaths).find(([, path]) => window.location.pathname === path)?.[0] as SitePage | undefined) ?? 'play';

const AppContent = () => {
  type GameMode = 'solo' | 'daily' | 'computer' | 'pass' | 'virtual' | 'real';
  const [mode, setMode] = useState<GameMode>('solo');
  const [showGameChooser, setShowGameChooser] = useState(true);
  const [hasStartedGame, setHasStartedGame] = useState(false);
  const [resetGameKey, setResetGameKey] = useState(0);
  const [scoreSuggestionsEnabled, setScoreSuggestionsEnabled] = useState(() => localStorage.getItem('yahtzee.score-suggestions.v1') !== 'false');
  const [registrationRequest, setRegistrationRequest] = useState(0);
  const [showMyScores, setShowMyScores] = useState(false);
  const [activePage, setActivePage] = useState<SitePage>(pageFromPath);
  const { isUserSignedIn, userDetails } = useAuth();
  const gameModes = [
    { value: 'solo' as GameMode, label: 'Solo', description: 'Play a classic game at your own pace and submit your final score.', icon: faDice },
    { value: 'daily' as GameMode, label: 'Daily Challenge', description: 'Play today’s fixed roll sequence and compare your score. Everyone receives the same candidate dice on each numbered roll, but your holds and category choices are your own.', icon: faDice },
    { value: 'computer' as GameMode, label: 'Vs Computer', description: 'Test your choices against a strategic computer opponent.', icon: faComputer },
    { value: 'pass' as GameMode, label: 'Pass & Play', description: 'Share this device and take turns in a two-player game.', icon: faPeopleGroup },
  ];
  const diceTools = [
    { value: 'virtual' as GameMode, label: 'Dice roller', description: 'Roll 1 or 2 dice', icon: faDice },
    { value: 'real' as GameMode, label: 'Scorecard', description: 'For physical dice', icon: faCalculator },
  ];
  const pageTitle: Record<GameMode, string> = { solo: 'Single Player', daily: 'Daily Challenge', computer: 'Vs Computer', pass: 'Pass & Play', virtual: 'Dice Roller', real: 'Scorecard' };

  const changeMode = (nextMode: GameMode) => { setHasStartedGame(true); if (nextMode === mode) { setShowGameChooser(false); return; } setMode(nextMode); setShowGameChooser(false); setResetGameKey((key) => key + 1); };
  const changeScoreSuggestions = (enabled: boolean) => {
    setScoreSuggestionsEnabled(enabled);
    localStorage.setItem('yahtzee.score-suggestions.v1', String(enabled));
  };
  const navigate = useCallback((page: SitePage) => {
    const safePage = page === 'admin' && userDetails?.role !== 'ADMIN' ? 'play' : page === 'account' && !isUserSignedIn ? 'play' : page;
    if (window.location.pathname !== pagePaths[safePage]) window.history.pushState({}, '', pagePaths[safePage]);
    setActivePage(safePage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [isUserSignedIn, userDetails?.role]);
  useEffect(() => { const onPopState = () => setActivePage(pageFromPath()); window.addEventListener('popstate', onPopState); if (window.location.pathname === '/') window.history.replaceState({}, '', pagePaths.play); return () => window.removeEventListener('popstate', onPopState); }, []);
  useEffect(() => { if (activePage === 'admin' && userDetails?.role !== 'ADMIN') navigate('play'); if (activePage === 'account' && !isUserSignedIn) navigate('play'); }, [activePage, isUserSignedIn, userDetails?.role, navigate]);
  return (
    <div className="App min-h-screen bg-deepBlack text-mintGlow font-mono">
          <Navbar
            activePage={activePage}
            registrationRequest={registrationRequest}
            pageTitle={showGameChooser ? 'Yahtzee!' : pageTitle[mode]}
            playButtonLabel={!hasStartedGame ? 'Play' : showGameChooser ? 'Resume game' : 'Game settings'}
            onPlayButtonClick={() => {
              navigate('play');
              if (hasStartedGame) setShowGameChooser((showing) => !showing);
              else setShowGameChooser(true);
            }}
            onNavigate={navigate}
          />
          <main>
            <div className={activePage === 'play' ? '' : 'hidden'} aria-hidden={activePage !== 'play'}>
            {showGameChooser && <section className="game-chooser" aria-labelledby="game-chooser-heading">
              <div className="game-chooser-heading"><p className="eyebrow">Game settings</p><h2 id="game-chooser-heading" className="section-heading">Choose how to play</h2><p className="section-copy">Start a Yahtzee game or open a tool for your physical dice.</p></div>
              <div className="play-picker">
              <section id="game-modes" className="game-mode-picker scroll-mt-28" aria-labelledby="game-mode-heading">
                <span id="game-mode-heading" className="picker-label">Play Yahtzee</span>
                <div className="game-mode-tabs">
                  {gameModes.map((item) => <button key={item.value} onClick={() => changeMode(item.value)} className="game-choice-card"><span className="game-choice-icon"><FontAwesomeIcon icon={item.icon} /></span><span><strong>{item.label}</strong><small>{item.description}</small><em>Play now →</em></span></button>)}
                </div>
              </section>
              <section id="dice-tools" className="dice-tools scroll-mt-28" aria-labelledby="dice-tools-heading">
                <span id="dice-tools-heading" className="picker-label">Dice tools</span>
                <div className="dice-tool-tabs">
                  {diceTools.map((item) => <button key={item.value} onClick={() => changeMode(item.value)} aria-pressed={mode === item.value} className={`dice-tool-tab ${mode === item.value ? 'dice-tool-tab-active' : ''}`}><span className="dice-tool-icon"><FontAwesomeIcon icon={item.icon} /></span><span><strong>{item.label}</strong><small>{item.description}</small></span></button>)}
                </div>
              </section>
              </div>
            </section>}
            <div hidden={showGameChooser}>{mode === 'real' ? <RealDiceGame key={resetGameKey} /> : mode === 'virtual' ? <VirtualDice key={resetGameKey} /> : <Game key={resetGameKey} isTwoPlayer={mode === 'pass' || mode === 'computer'} isComputerOpponent={mode === 'computer'} isDailyChallenge={mode === 'daily'} scoreSuggestionsEnabled={scoreSuggestionsEnabled} onOpenSettings={() => setShowGameChooser(true)} onCreateAccount={() => setRegistrationRequest((request) => request + 1)} setIsTwoPlayer={(enabled) => changeMode(enabled ? 'pass' : 'solo')} />}</div></div>
            {activePage === 'scores' && <section className="site-page-content max-w-6xl"><div><p className="eyebrow">Shared leaderboard</p><h2 className="section-heading">High Scores</h2><p className="section-copy">Compare Solo games and Daily Challenge results, or review your own scores.</p></div>{!isUserSignedIn && <div className="mb-5 rounded-xl border border-[#315a5e] bg-[#142225] p-4 text-sm text-mintGlow"><strong className="block text-base text-neonYellow">Keep your scores and join the rankings</strong><p className="mt-1">Create a free player profile to save games, unlock your personal leaderboard and sync across devices.</p><button onClick={() => setRegistrationRequest((request) => request + 1)} className="mt-3 font-black text-neonCyan">Create player profile →</button></div>}<Leaderboard showUserScores={showMyScores} onShowUserScoresChange={setShowMyScores} canShowUserScores={isUserSignedIn} hideHeading /></section>}
            {activePage === 'progress' && <Progress embedded onCreateAccount={() => setRegistrationRequest((request) => request + 1)} />}
            {activePage === 'account' && isUserSignedIn && <Settings embedded scoreSuggestionsEnabled={scoreSuggestionsEnabled} onScoreSuggestionsChange={changeScoreSuggestions} />}
            {activePage === 'about' && <About embedded />}
            {activePage === 'admin' && userDetails?.role === 'ADMIN' && <AdminDashboard embedded />}
          </main>
          <footer className="site-footer"><div><strong>Yahtzee!</strong><span>Play on web and mobile with one shared account.</span></div><nav><a href="https://apps.apple.com/gb/app/yahtzee-hub/id6794910138" target="_blank" rel="noreferrer">Download for iPhone</a><a href="/support.html">Support</a><a href="/privacy.html">Privacy</a><a href="/terms.html">Terms</a><a href="/account-deletion.html">Delete account</a></nav><p>Yahtzee is a trademark of Hasbro. This independent game is not affiliated with or endorsed by Hasbro.</p></footer>
        </div>
  );
};

const App = () => <LeaderboardRefreshProvider><AuthProvider><AppContent /></AuthProvider></LeaderboardRefreshProvider>;

export default App;
