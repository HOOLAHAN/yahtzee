// Navbar.tsx

import React, { useState } from 'react';
import About from './About';
import '../tailwind.css';
import AuthenticationManager from './AuthenticationManager';

const Navbar: React.FC = () => {
  const [showAbout, setShowAbout] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const toggleAbout = () => setShowAbout(!showAbout);
  const toggleAuthModal = () => setShowAuthModal(!showAuthModal);


  return (
    <>
      <nav className="bg-green-600 text-white p-2">
        <div className="container mx-auto flex items-center justify-between w-full">

          {/* Logo on the left */}
          <div className="flex-none">
            <img
              src={`${process.env.PUBLIC_URL}/yahtzee_logo.png`}
              alt="Yahtzee Logo"
              style={{ maxWidth: '70px', maxHeight: '70px' }}
            />
          </div>

          {/* Text in the center */}
          <div className="flex-grow text-center">
            <h1 className="text-4xl font-semibold">Yahtzee!</h1>
          </div>

          {/* About button on the right */}
          <div className="flex-none">
            <button
              onClick={toggleAbout}
              className="transition duration-300 ease-in-out transform hover:scale-105 py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 focus:ring focus:ring-blue-200 mr-4"
            >
              About
            </button>
            <button
              onClick={toggleAuthModal}
              className="py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 focus:ring focus:ring-blue-200"
            >
              Login / Sign Up
            </button>
          </div>

        </div>
      </nav>

      {/* About Drawer */}
      {showAbout && (
        <About />
      )}

      {/* Authentication Modal */}
      {showAuthModal && (
        <div className="absolute top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-4 rounded-lg">
            <AuthenticationManager onClose={toggleAuthModal} />
            <button onClick={toggleAuthModal} className="absolute top-0 right-0 mt-4 mr-4 text-gray-600 hover:text-gray-900">
              &times;
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
