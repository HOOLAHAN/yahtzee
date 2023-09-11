import React from 'react';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-gray-600 text-black p-4 relative">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <img
            src={`${process.env.PUBLIC_URL}/yahtzee_logo.png`}
            alt="Yahtzee Logo"
            style={{ maxWidth: '70px', maxHeight: '70px' }}
            className="mr-2 border-2 border-white rounded"
          />
        </div>
        <div className="absolute inset-x-0 flex justify-center">
          <h1 className="text-2xl font-semibold">Yahtzee!</h1>
        </div>
        <div className="flex items-center"></div>
      </div>
    </nav>
  );
};

export default Navbar;
