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
    <div className="fixed right-0 top-0 z-50 h-full w-72 bg-deepBlack text-mintGlow shadow-xl transform transition-transform duration-300 border-l-4 border-neonCyan">
      <div className="relative p-5 space-y-6">
        <button
          onClick={onClose}
          className="absolute top-0 right-0 mt-4 mr-4 text-3xl text-neonCyan hover:text-electricPink"
          aria-label="Close settings"
        >
          &times;
        </button>

        <h2 className="text-2xl font-bold text-neonYellow animate-pulse-glow">Settings</h2>

        <div>
          <h3 className="font-semibold">Account:</h3>
          <p className="text-sm">Username: {userDetails.preferred_username}</p>
          <p className="text-sm">Email: {userDetails.email}</p>
        </div>

        {!showConfirmDelete && !showResetPassword && (
          <div>
            <h3 className="font-semibold">Reset Password</h3>
            <button
              onClick={handleRequestResetPassword}
              className="w-full py-2 px-4 bg-neonCyan text-black rounded-xl font-semibold hover:bg-electricPink transition"
            >
              Send Reset Code
            </button>
          </div>
        )}

        {showResetPassword && (
          <form onSubmit={handleConfirmResetPassword} className="space-y-4">
            <h3 className="font-semibold">Enter Confirmation Code</h3>
            <input
              className="w-full px-3 py-2 bg-black text-white border border-neonCyan rounded focus:outline-none focus:ring-2 focus:ring-neonCyan"
              type="text"
              placeholder="Confirmation Code"
              value={confirmationCode}
              onChange={(e) => setConfirmationCode(e.target.value)}
              required
            />
            <h3 className="font-semibold">Enter New Password</h3>
            <input
              className="w-full px-3 py-2 bg-black text-white border border-neonCyan rounded focus:outline-none focus:ring-2 focus:ring-neonCyan"
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <button
              type="submit"
              className="w-full py-2 bg-neonCyan text-black rounded-xl font-semibold hover:bg-electricPink transition"
            >
              Reset Password
            </button>
          </form>
        )}

        {!showResetPassword && (
          <div>
            <h3 className="font-semibold">Delete Account</h3>
            {!showConfirmDelete ? (
              <button
                onClick={() => setShowConfirmDelete(true)}
                className="w-full py-2 font-semibold rounded-xl border border-red-500 text-red-400 bg-deepBlack hover:bg-red-900 hover:text-white hover:border-red-400 transition duration-300 shadow-md hover:shadow-red-500"
              >
                Delete Account
              </button>
            ) : (
              <div className="space-y-2 text-sm">
                <p className="text-red-400">Are you sure? This cannot be undone.</p>
                <div className="flex justify-between gap-2">
                  <button
                    onClick={handleDeleteAccount}
                    className="flex-1 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => setShowConfirmDelete(false)}
                    className="flex-1 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
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
