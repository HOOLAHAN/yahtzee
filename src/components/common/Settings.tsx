// Settings.tsx

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

interface SettingsProps {
  onClose: () => void;
}

const Settings: React.FC<SettingsProps> = ({ onClose }) => {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmationCode, setConfirmationCode] = useState('');
  const [showResetPassword, setShowResetPassword] = useState(false);
  const {
    deleteUser,
    resetUserPassword, 
    confirmUserPasswordReset,
    userDetails
  } = useAuth();

  const handleDeleteAccount = async () => {
    await deleteUser();
    onClose();
  };

  const handleRequestResetPassword = async () => {
    try {
      await resetUserPassword(userDetails.email);
      setShowResetPassword(true);
      setShowConfirmDelete(false);
    } catch (error) {
      console.error('Error requesting password reset:', error);
      alert('Failed to send reset code');
    }
  };

  const handleConfirmResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await confirmUserPasswordReset(userDetails.email, confirmationCode, newPassword);
      alert('Password has been reset successfully');
      onClose();
    } catch (error) {
      console.error('Error resetting password:', error);
      alert('Failed to reset password');
    }
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
        <h2 className="font-semibold text-lg mb-4">Settings</h2>
        <h3 className="font-semibold text-md mb-2">Account Details:</h3>
        <h3 className="text-sm mb-2">Username - {userDetails.preferred_username}</h3>
        <h3 className="text-sm mb-2">Email - {userDetails.email}</h3>
        {/* Password reset request form */}
        {!showConfirmDelete && !showResetPassword && (
          <div className="mt-4">
            <h3 className="font-semibold mb-4">Reset Password:</h3>
            <button
              onClick={handleRequestResetPassword}
              className="w-full p-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Send Reset Code
            </button>
          </div>
        )}
        {/* Confirm reset password form */}
        {showResetPassword && (
          <form onSubmit={handleConfirmResetPassword} className="space-y-4 mt-4">
            <h3 className="font-semibold">Enter Confirmation Code</h3>
            <input
              className="w-full p-2 border border-gray-300 rounded"
              type="text"
              placeholder="Confirmation Code"
              value={confirmationCode}
              onChange={(e) => setConfirmationCode(e.target.value)}
              required
            />
            <h3 className="font-semibold">Enter New Password</h3>
            <input
              className="w-full p-2 border border-gray-300 rounded"
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <button
              type="submit"
              className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Reset Password
            </button>
          </form>
        )}
        {/* Delete account button and confirmation */}
        {!showResetPassword && (
        <div className="mt-6">
          <h3 className="font-semibold mb-4">Delete Account:</h3>
          {!showConfirmDelete ? (
            <button
              onClick={() => setShowConfirmDelete(true)}
              className="w-full p-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Delete Account
            </button>
          ) : (
            <div className="space-y-2">
              <p>Are you sure you want to delete your account? This cannot be undone.</p>
              <div className="flex justify-between">
                <button
                  onClick={handleDeleteAccount}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Confirm
                </button>
                <button
                  onClick={() => setShowConfirmDelete(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
