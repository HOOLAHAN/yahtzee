// Navbar.tsx

import { useState } from 'react';
import About from './About';
import '../tailwind.css';
import AuthenticationManager from './AuthenticationManager';
import { useAuth } from '../context/AuthContext';
import Leaderboard from './Leaderboard'

const Navbar = () => {
  const [showAbout, setShowAbout] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const { isUserSignedIn, signOut, userDetails } = useAuth();

  const toggleAbout = () => setShowAbout(!showAbout);
  const toggleAuthModal = () => setShowAuthModal(!showAuthModal);
  const toggleLeaderboard = () => setShowLeaderboard(!showLeaderboard);
  
  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.log('error signing out:', error);
    }
  };

  // Function to handle outside click
  const handleCloseModal = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      toggleAuthModal();
    }
  };
    
  return (
    <>
      <nav className="bg-green-600 text-white p-2">
        <div className="container mx-auto flex items-center justify-between flex-wrap">
          <div className="flex-none mb-2 w-16 h-16 sm:w-12 sm:h-12 md:w-20 md:h-20">
            <img
              src={`${process.env.PUBLIC_URL}/yahtzee_logo.png`}
              alt="Yahtzee Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="flex-grow text-center">
            <h1 className="text-4xl sm:text-2xl md:text-5xl font-semibold">Yahtzee!</h1>
          </div>
          {isUserSignedIn && userDetails?.username && (
              <span className="mr-4 text-xl">{userDetails.signInDetails.loginId}</span>
            )}
          <div className="flex-none w-full sm:w-auto flex justify-center sm:justify-start">
          <button
            onClick={toggleAbout}
            className="transition duration-300 ease-in-out transform hover:scale-105 py-2 px-4 text-sm sm:text-lg bg-blue-600 text-white rounded hover:bg-blue-700 focus:ring focus:ring-blue-200 mr-2"
          >
            About
          </button>
          <button
            onClick={toggleLeaderboard}
            className="transition duration-300 ease-in-out transform hover:scale-105 py-2 px-4 text-sm sm:text-lg bg-blue-600 text-white rounded hover:bg-blue-700 focus:ring focus:ring-blue-200 mr-2"
          >
            Leaderboard
          </button>
          {!isUserSignedIn ? (
            <button
              onClick={toggleAuthModal}
              className="transition duration-300 ease-in-out transform hover:scale-105 py-2 px-4 text-sm sm:text-lg bg-blue-600 text-white rounded hover:bg-blue-700 focus:ring focus:ring-blue-200"
            >
              Login
            </button>
          ) : (
            <button
              onClick={handleSignOut}
              className="transition duration-300 ease-in-out transform hover:scale-105 py-2 px-4 text-sm sm:text-lg bg-blue-600 text-white rounded hover:bg-blue-700 focus:ring focus:ring-blue-200"
            >
              Log Out
            </button>
          )}
          </div>
        </div>
      </nav>

      {/* About Drawer */}
      {showAbout && (
        <About />
      )}

      {/* Leaderboard Drawer */}
      {showLeaderboard && (
        <div className='bg-gray-200'>
          <Leaderboard />
        </div>
      )}

      {/* Authentication Modal */}
      {showAuthModal && (
        <div           
          id="modal-overlay"
          className="absolute top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          onClick={handleCloseModal}
        >
          <div className="relative p-4 rounded-lg" onClick={(e) => e.stopPropagation()}>
            <AuthenticationManager onClose={toggleAuthModal} />
            <button onClick={toggleAuthModal} className="absolute top-2 right-3 mt-4 mr-4 text-gray-600 hover:text-gray-900">
              &times;
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
