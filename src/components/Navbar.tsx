// Navbar.tsx

import { useState, useEffect } from 'react';
import About from './About';
import '../tailwind.css';
import AuthenticationManager from './AuthenticationManager';
import { useAuth } from '../context/AuthContext';
import Leaderboard from './Leaderboard'
import Menu from './Menu';
import Settings from './Settings'

const Navbar = () => {
  const [showAbout, setShowAbout] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { isUserSignedIn, signOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [leaderboardDisplay, setLeaderboardDisplay] = useState('closed');
  const [showSettings, setShowSettings] = useState(false);
  const [currentForm, setCurrentForm] = useState('');

  const toggleSettings = () => {
    if (!showSettings) {
      setShowSettings(true);
      setIsMenuOpen(false);
    } else {
      setShowSettings(false);
      setIsMenuOpen(true);
    }
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

  // Handle outside click
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      const menuElement = document.getElementById('menu');
      if (menuElement && !menuElement.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }

    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isMenuOpen]);
    
  return (
    <>
      <nav className="bg-green-600 text-white p-2">
        <div className="container mx-auto flex items-center justify-between">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="focus:outline-none">
            <div className="w-16 h-16 sm:w-12 sm:h-12 md:w-20 md:h-20 hover:scale-110 transform transition duration-200 ease-in-out">
              <img src={`${process.env.PUBLIC_URL}/yahtzee_logo.png`} alt="Yahtzee Logo" className="w-full h-full object-contain" />
            </div>
          </button>
          <div className="text-center">
            <h1 className="text-3xl sm:text-2xl md:text-5xl font-semibold">Yahtzee!</h1>
          </div>
          <div>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="transition duration-300 ease-in-out transform hover:scale-105 py-2 px-4 text-sm sm:text-lg bg-blue-600 text-white rounded hover:bg-blue-700 focus:ring focus:ring-blue-200"
            >
              Menu
            </button>
          </div>
        </div>
      </nav>

      {/* About Drawer */}
      {showAbout && (
        <About onClose={toggleAbout} />
      )}

      {/* Leaderboard Drawer */}
      {leaderboardDisplay !== 'closed' && (
        <div className='bg-gray-200 mx-5'>
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
      />

      {/* Settings Component */}
      {showSettings && (
        <Settings onClose={toggleSettings} />
      )}
    </>
  );
};

export default Navbar;
