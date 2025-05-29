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
import { faBars } from '@fortawesome/free-solid-svg-icons';

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
      <nav className="bg-deepBlack text-white p-3 shadow-lg border-b-4 border-neonCyan">
        <div className="container mx-auto flex items-center justify-between">
          <div className="w-16 h-16 sm:w-14 sm:h-14 md:w-20 md:h-20 transform transition duration-200 ease-in-out">
            <img
              src={`${process.env.PUBLIC_URL}/yahtzee_dice_logo.png`} 
              alt="Yahtzee Dice Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="text-center">
            <h1 className="text-3xl sm:text-2xl md:text-5xl font-semibold text-neonYellow animate-pulse-glow">
              Yahtzee!
            </h1>
          </div>
          <div>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="w-8 h-8 rounded-full bg-neonCyan hover:bg-electricPink shadow-lg flex items-center justify-center transition transform hover:scale-110"
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
