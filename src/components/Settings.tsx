// Settings.tsx

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

interface SettingsProps {
  onClose: () => void;
}

const Settings: React.FC<SettingsProps> = ({ onClose }) => {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const { deleteUser } = useAuth();

  const handleDeleteAccount = async () => {
    await deleteUser();
    onClose();
  };
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
        {/* Button to initiate the delete account process */}
        {!showConfirmDelete && (
          <button
            onClick={() => setShowConfirmDelete(true)}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded block"
          >
            Delete Account
          </button>
        )}
        {/* Confirmation prompt */}
        {showConfirmDelete && (
          <div>
            <p>Are you sure you want to delete your account? This cannot be undone.</p>
            <button
              onClick={handleDeleteAccount}
              className="mt-2 px-4 py-2 bg-red-600 text-white rounded"
            >
              Confirm
            </button>
            <button
              onClick={() => setShowConfirmDelete(false)}
              className="mt-2 ml-2 px-4 py-2 bg-gray-500 text-white rounded"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
