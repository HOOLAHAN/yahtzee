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

interface NavbarProps {
  isTwoPlayer: boolean;
  toggleTwoPlayerMode: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ isTwoPlayer, toggleTwoPlayerMode }) => {
  const [showAbout, setShowAbout] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { isUserSignedIn, signOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [leaderboardDisplay, setLeaderboardDisplay] = useState('closed');
  const [showSettings, setShowSettings] = useState(false);
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

  const toggleLeaderboard = () => {
    setLeaderboardDisplay(prevState =>
      prevState === 'allScores' ? 'closed' : 'allScores'
    );
    setIsMenuOpen(false);
  };

  const toggleUserScores = () => {
    setLeaderboardDisplay(prevState =>
      prevState === 'userScores' ? 'closed' : 'userScores'
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
    
  return (
    <>
      <nav className="sticky top-0 z-30 border-b-2 border-neonCyan bg-deepBlack/95 px-4 py-3 text-white shadow-lg backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6">
          <a href="#play" className="flex items-center gap-3">
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
          </a>

          <div className="hidden items-center gap-1 lg:flex" aria-label="Primary navigation">
            <a href="#play" className="desktop-nav-button">Play</a>
            <button onClick={toggleLeaderboard} className={`desktop-nav-button ${leaderboardDisplay === 'allScores' ? 'desktop-nav-active' : ''}`}><FontAwesomeIcon icon={faTrophy} />Scores</button>
            {isUserSignedIn && <button onClick={toggleUserScores} className={`desktop-nav-button ${leaderboardDisplay === 'userScores' ? 'desktop-nav-active' : ''}`}>My Scores</button>}
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
        <div id="leaderboard-drawer" className='bg-deepBlack m-5'>
          <Leaderboard showUserScores={leaderboardDisplay === 'userScores'}/>
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
        toggleUserScores={toggleUserScores}
        toggleSettings={toggleSettings}
        toggleTwoPlayerMode={toggleTwoPlayerMode}
        isTwoPlayer={isTwoPlayer}
      />

      {/* Settings Component */}
      {showSettings && (
        <div id="settings-drawer">
          <Settings onClose={toggleSettings} />
        </div>
      )}
    </>
  );
};

export default Navbar;
