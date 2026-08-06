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
import { faBars, faCircleInfo, faHeadset, faRightFromBracket, faRightToBracket, faSliders, faTrophy } from '@fortawesome/free-solid-svg-icons';
import Progress from '../common/Progress';

const Navbar: React.FC = () => {
  const [showAbout, setShowAbout] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { isUserSignedIn, signOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [leaderboardDisplay, setLeaderboardDisplay] = useState('closed');
  const [showSettings, setShowSettings] = useState(false);
  const [showProgress, setShowProgress] = useState(false);
  const [currentForm, setCurrentForm] = useState('');

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
          <button onClick={showPlay} className="flex items-center gap-3 text-left">
          <div className="h-14 w-14 transform transition duration-200 ease-in-out lg:h-16 lg:w-16">
            <img
              src={`${process.env.PUBLIC_URL}/yahtzee_dice_logo.png`} 
              alt="Yahtzee Dice Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <h1 className="text-2xl font-black text-neonYellow animate-pulse-glow lg:text-3xl">
              Yahtzee!
            </h1>
            <p className="hidden text-xs font-bold text-gray-500 sm:block">Web game & app support</p>
          </div>
          </button>

          <div className="hidden items-center gap-1 lg:flex" aria-label="Primary navigation">
            <button onClick={showPlay} className="desktop-nav-button">Play</button>
            <button onClick={toggleLeaderboard} className={`desktop-nav-button ${leaderboardDisplay === 'allScores' ? 'desktop-nav-active' : ''}`}><FontAwesomeIcon icon={faTrophy} />Scores</button>
            <button onClick={() => setShowProgress(true)} className={`desktop-nav-button ${showProgress ? 'desktop-nav-active' : ''}`}><FontAwesomeIcon icon={faTrophy} />Progress</button>
            <button onClick={toggleAbout} className={`desktop-nav-button ${showAbout ? 'desktop-nav-active' : ''}`}><FontAwesomeIcon icon={faCircleInfo} />About</button>
            <a href="/support.html" className="desktop-nav-button"><FontAwesomeIcon icon={faHeadset} />Support</a>
            {isUserSignedIn ? <><button onClick={toggleSettings} className={`desktop-nav-button desktop-nav-account ${showSettings ? 'desktop-nav-active' : ''}`}><FontAwesomeIcon icon={faSliders} />Account</button><button onClick={handleSignOut} aria-label="Sign out" title="Sign out" className="desktop-nav-icon"><FontAwesomeIcon icon={faRightFromBracket} /></button></> : <button onClick={toggleAuthModal} className="desktop-nav-button desktop-nav-account"><FontAwesomeIcon icon={faRightToBracket} />Sign in</button>}
          </div>

          <div className="lg:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="bg-neonCyan w-8 h-8 rounded-full text-deepBlack hover:bg-electricPink hover:text-white hover:scale-110 focus:ring focus:ring-electricPink animate-glow-border"
              aria-label="Menu"
            >
              <FontAwesomeIcon icon={faBars} className="text-deepBlack text-sm animate-pulse-glow" />
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
          <div className="my-6 grid grid-cols-2 gap-2 rounded-2xl border border-[#2d3c40] bg-[#101719] p-1.5">
            <button onClick={() => setLeaderboardDisplay('allScores')} className={`score-drawer-tab ${leaderboardDisplay === 'allScores' ? 'score-drawer-tab-active' : ''}`}>Global</button>
            <button disabled={!isUserSignedIn} onClick={() => setLeaderboardDisplay('userScores')} className={`score-drawer-tab ${leaderboardDisplay === 'userScores' ? 'score-drawer-tab-active' : ''} disabled:cursor-not-allowed disabled:opacity-40`}>My Scores</button>
          </div>
          {!isUserSignedIn && <div className="mb-5 rounded-xl border border-[#315a5e] bg-[#142225] p-4 text-sm text-mintGlow"><p>Sign in to see scores submitted by your account.</p><button onClick={() => { setLeaderboardDisplay('closed'); setShowAuthModal(true); }} className="mt-3 font-black text-neonCyan hover:text-electricPink">Sign in</button></div>}
          <Leaderboard showUserScores={leaderboardDisplay === 'userScores'} hideHeading />
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
          <Settings onClose={toggleSettings} />
        </div>
      )}
      {showProgress && <Progress onClose={() => setShowProgress(false)} />}
    </>
  );
};

export default Navbar;
