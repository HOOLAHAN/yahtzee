// Navbar.tsx

import { useState, useEffect } from 'react';
import About from '../common/About';
import '../../styles/tailwind.css';
import AuthenticationManager from '../auth/AuthenticationManager';
import { useAuth } from '../../context/AuthContext';
import Leaderboard from '../common/Leaderboard';
import Menu from './Menu';
import Settings from '../common/Settings';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faRightToBracket, faSliders, faTrophy } from '@fortawesome/free-solid-svg-icons';
import Progress from '../common/Progress';

interface NavbarProps {
  onPlay?: () => void;
  pageTitle?: string;
  scoreSuggestionsEnabled?: boolean;
  onScoreSuggestionsChange?: (enabled: boolean) => void;
}

const Navbar: React.FC<NavbarProps> = ({ onPlay, pageTitle = 'Yahtzee!', scoreSuggestionsEnabled = true, onScoreSuggestionsChange }) => {
  const [showAbout, setShowAbout] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { isUserSignedIn, signOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [leaderboardDisplay, setLeaderboardDisplay] = useState('closed');
  const [showSettings, setShowSettings] = useState(false);
  const [showProgress, setShowProgress] = useState(false);
  const [currentForm, setCurrentForm] = useState('');
  const displayTitle = leaderboardDisplay !== 'closed' ? 'High Scores' : showProgress ? 'Progress' : showSettings || showAuthModal ? 'Account' : showAbout ? 'About' : pageTitle;

  const toggleSettings = () => {
    setShowSettings(!showSettings);
    setIsMenuOpen(false);
  };
  
  const toggleAbout = () => {
    setShowAbout(!showAbout);
    setIsMenuOpen(false);
  };

  const toggleAuthModal = () => setShowAuthModal(!showAuthModal);

  const showPlay = () => {
    setShowAbout(false); setLeaderboardDisplay('closed'); setShowSettings(false); setShowProgress(false); setIsMenuOpen(false);
    onPlay?.();
    window.requestAnimationFrame(() => document.getElementById('play')?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  };

  const toggleLeaderboard = () => {
    setLeaderboardDisplay(prevState =>
      prevState === 'allScores' ? 'closed' : 'allScores'
    );
    setIsMenuOpen(false);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.log('error signing out:', error);
    }
  };

  // Function to handle outside click
  const handleCloseModal = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && currentForm !== 'verifyEmail') {
      toggleAuthModal();
    }
  };

  // Handle outside click for About, Leaderboard, and Settings
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      const menuElement = document.getElementById('menu');
      const aboutElement = document.getElementById('about-drawer');
      const leaderboardElement = document.getElementById('leaderboard-drawer');
      const settingsElement = document.getElementById('settings-drawer');
      
      if (menuElement && !menuElement.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
      if (aboutElement && !aboutElement.contains(event.target as Node)) {
        setShowAbout(false);
      }
      if (leaderboardElement && !leaderboardElement.contains(event.target as Node)) {
        setLeaderboardDisplay('closed');
      }
      if (settingsElement && !settingsElement.contains(event.target as Node)) {
        setShowSettings(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isMenuOpen, showAbout, leaderboardDisplay, showSettings]);

  useEffect(() => {
    const drawerOpen = isMenuOpen || showAbout || leaderboardDisplay !== 'closed' || showSettings || showProgress;
    if (drawerOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isMenuOpen, leaderboardDisplay, showAbout, showProgress, showSettings]);
    
  return (
    <>
      <nav className="sticky top-0 z-30 border-b-2 border-neonCyan bg-deepBlack/95 px-4 py-3 text-white shadow-lg backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6">
          <button onClick={showPlay} className="flex min-w-0 items-center gap-3 text-left">
          <div className="h-14 w-14 transform transition duration-200 ease-in-out lg:h-16 lg:w-16">
            <img
              src={`${process.env.PUBLIC_URL}/yahtzee_dice_logo.png`} 
              alt="Yahtzee Dice Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="min-w-0">
            <h1 className="max-w-[11rem] truncate text-xl font-black text-neonYellow animate-pulse-glow sm:max-w-xs sm:text-2xl lg:text-3xl">
              {displayTitle}
            </h1>
          </div>
          </button>

          <div className="ml-auto hidden items-center gap-1 sm:flex" aria-label="Primary navigation">
            <button onClick={showPlay} className="desktop-nav-button">Games</button>
            <button onClick={toggleLeaderboard} className={`desktop-nav-button ${leaderboardDisplay === 'allScores' ? 'desktop-nav-active' : ''}`}><FontAwesomeIcon icon={faTrophy} />Scores</button>
            {isUserSignedIn ? <button onClick={toggleSettings} className={`desktop-nav-button desktop-nav-account ${showSettings ? 'desktop-nav-active' : ''}`}><FontAwesomeIcon icon={faSliders} />Account</button> : <button onClick={toggleAuthModal} className="desktop-nav-button desktop-nav-account"><FontAwesomeIcon icon={faRightToBracket} />Sign in</button>}
          </div>

          <div>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex h-9 items-center gap-2 rounded-full bg-neonCyan px-3 font-black text-deepBlack transition hover:scale-105 hover:bg-electricPink hover:text-white focus:ring focus:ring-electricPink sm:h-10"
              aria-label="More navigation options"
              aria-expanded={isMenuOpen}
            >
              <FontAwesomeIcon icon={faBars} className="text-sm" />
              <span className="hidden lg:inline">More</span>
            </button>
          </div>
        </div>
      </nav>

      {/* About Drawer */}
      {showAbout && (
        <div id="about-drawer">
          <About onClose={toggleAbout} />
        </div>
      )}

      {/* Leaderboard Drawer */}
      {leaderboardDisplay !== 'closed' && (
        <div className="fixed inset-0 z-40 bg-black/75 backdrop-blur-sm" onClick={() => setLeaderboardDisplay('closed')}>
        <aside id="leaderboard-drawer" role="dialog" aria-modal="true" aria-labelledby="scores-title" className="absolute right-0 top-0 h-full w-full max-w-xl overflow-y-auto border-l border-neonCyan bg-deepBlack p-5 shadow-2xl sm:p-7" onClick={(event) => event.stopPropagation()}>
          <div className="flex items-start justify-between gap-4"><div><p className="eyebrow">Shared leaderboard</p><h2 id="scores-title" className="section-heading">High Scores</h2></div><button onClick={() => setLeaderboardDisplay('closed')} aria-label="Close scores" className="text-4xl text-neonCyan hover:text-electricPink">&times;</button></div>
          {!isUserSignedIn && <div className="mb-5 rounded-xl border border-[#315a5e] bg-[#142225] p-4 text-sm text-mintGlow"><p>Sign in to see scores submitted by your account.</p><button onClick={() => { setLeaderboardDisplay('closed'); setShowAuthModal(true); }} className="mt-3 font-black text-neonCyan hover:text-electricPink">Sign in</button></div>}
          <Leaderboard showUserScores={leaderboardDisplay === 'userScores'} onShowUserScoresChange={(mine) => setLeaderboardDisplay(mine ? 'userScores' : 'allScores')} canShowUserScores={isUserSignedIn} hideHeading />
        </aside>
        </div>
      )}

      {/* Authentication Modal */}
      {showAuthModal && (
        <div           
          id="modal-overlay"
          className="absolute top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          onClick={handleCloseModal}
        >
          <div className="relative p-4 rounded-lg w-full sm:w-[410px] max-w-full" onClick={(e) => e.stopPropagation()}>
            <AuthenticationManager onClose={toggleAuthModal} onFormChange={setCurrentForm} />
            <button onClick={toggleAuthModal} className="absolute top-2 right-3 mt-4 mr-4 text-gray-600 hover:text-gray-900">
              &times;
            </button>
          </div>
        </div>
      )}

      {/* Menu Component */}
      <Menu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        toggleAbout={toggleAbout}
        toggleAuthModal={toggleAuthModal}
        isUserSignedIn={isUserSignedIn}
        handleSignOut={handleSignOut}
        toggleLeaderboard={toggleLeaderboard}
        toggleSettings={toggleSettings}
        toggleProgress={() => setShowProgress(true)}
        onPlay={showPlay}
      />

      {/* Settings Component */}
      {showSettings && (
        <div id="settings-drawer">
          <Settings onClose={toggleSettings} scoreSuggestionsEnabled={scoreSuggestionsEnabled} onScoreSuggestionsChange={onScoreSuggestionsChange} />
        </div>
      )}
      {showProgress && <Progress onClose={() => setShowProgress(false)} />}
    </>
  );
};

export default Navbar;
