// Settings.tsx

import React from 'react';

interface SettingsProps {
  onClose: () => void;
}

const Settings: React.FC<SettingsProps> = ({ onClose }) => {
  return (
    <div className="fixed right-0 top-0 z-50 h-full w-64 bg-white shadow-lg transform transition-transform duration-300">
      <div className="relative p-4">
        <button
          onClick={onClose}
          className="absolute top-0 right-0 mt-4 mr-4 text-xl text-gray-800 hover:text-gray-600"
          aria-label="Close settings"
        >
          &times;
        </button>
        <h2 className="font-semibold text-lg">Settings</h2>

      </div>
    </div>
  );
};

export default Settings;
