// Settings.tsx

import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { updateMyProfile } from '../../services/profiles';

interface SettingsProps {
  onClose: () => void;
}

const Settings: React.FC<SettingsProps> = ({ onClose }) => {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmationCode, setConfirmationCode] = useState('');
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileError, setProfileError] = useState('');
  const [profileMessage, setProfileMessage] = useState('');
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const {
    deleteUser,
    resetUserPassword, 
    confirmUserPasswordReset,
    userDetails,
    checkAuthStatus,
  } = useAuth();

  useEffect(() => {
    setUsername(userDetails?.preferred_username ?? '');
    setFirstName(userDetails?.given_name ?? '');
    setLastName(userDetails?.family_name ?? '');
  }, [userDetails]);

  const handleSaveProfile = async (event: React.FormEvent) => {
    event.preventDefault();
    setProfileError('');
    setProfileMessage('');
    if (!/^[A-Za-z0-9_]{3,20}$/.test(username)) {
      setProfileError('Username must be 3–20 letters, numbers, or underscores.');
      return;
    }
    if (!firstName.trim() || !lastName.trim()) {
      setProfileError('First name and surname are required.');
      return;
    }
    try {
      setProfileSaving(true);
      await updateMyProfile(username, firstName.trim(), lastName.trim());
      await checkAuthStatus();
      setEditingProfile(false);
      setProfileMessage('Profile updated. Your new username will be used for future scores.');
    } catch (error) {
      setProfileError(error instanceof Error ? error.message : 'Could not update profile.');
    } finally {
      setProfileSaving(false);
    }
  };

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
    <div className="fixed right-0 top-0 z-50 h-full w-full max-w-md overflow-y-auto bg-deepBlack text-mintGlow shadow-xl transform transition-transform duration-300 border-l-4 border-neonCyan">
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
          <p className="text-sm">Name: {[userDetails.given_name, userDetails.family_name].filter(Boolean).join(' ') || 'Not set'}</p>
          <p className="text-xs text-gray-400 mt-1">Your name is private. Only your username is shown publicly.</p>
          {!editingProfile && (
            <button onClick={() => { setEditingProfile(true); setProfileMessage(''); }} className="w-full py-2 mt-3 border border-neonCyan text-neonCyan rounded-xl font-semibold hover:bg-neonCyan hover:text-black transition">
              Edit Profile
            </button>
          )}
        </div>

        {editingProfile && (
          <form onSubmit={handleSaveProfile} className="space-y-3">
            <label className="block text-sm">Username
              <input value={username} onChange={(e) => setUsername(e.target.value)} autoCapitalize="none" className="mt-1 w-full px-3 py-2 bg-black border border-neonCyan rounded" />
            </label>
            <label className="block text-sm">First name
              <input value={firstName} onChange={(e) => setFirstName(e.target.value)} className="mt-1 w-full px-3 py-2 bg-black border border-neonCyan rounded" />
            </label>
            <label className="block text-sm">Surname
              <input value={lastName} onChange={(e) => setLastName(e.target.value)} className="mt-1 w-full px-3 py-2 bg-black border border-neonCyan rounded" />
            </label>
            <div className="flex gap-2">
              <button type="submit" disabled={profileSaving} className="flex-1 py-2 bg-neonCyan text-black rounded-xl font-semibold disabled:opacity-50">{profileSaving ? 'Saving…' : 'Save'}</button>
              <button type="button" onClick={() => setEditingProfile(false)} className="flex-1 py-2 border border-gray-500 rounded-xl">Cancel</button>
            </div>
          </form>
        )}
        {profileError && <p className="text-sm text-red-400">{profileError}</p>}
        {profileMessage && <p className="text-sm text-mintGlow">{profileMessage}</p>}

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
          <div className="pb-8">
            <h3 className="font-semibold text-red-400 mb-2">Delete Account</h3>
            {!showConfirmDelete ? (
              <button
                onClick={() => { setDeleteConfirmation(''); setShowConfirmDelete(true); }}
                className="w-full py-2 font-semibold rounded-xl border border-red-500 text-red-400 bg-deepBlack hover:bg-red-900 hover:text-white hover:border-red-400 transition duration-300 shadow-md hover:shadow-red-500"
              >
                Delete Account
              </button>
            ) : (
              <div className="space-y-2 text-sm">
                <p className="text-red-400">This permanently removes your login, private profile and leaderboard scores. Type DELETE to continue.</p>
                <label className="block text-xs font-bold text-gray-300">Confirmation
                  <input value={deleteConfirmation} onChange={(event) => setDeleteConfirmation(event.target.value.toUpperCase())} placeholder="DELETE" className="mt-1 w-full rounded border border-red-500 bg-black px-3 py-2 text-center font-black tracking-widest text-white" />
                </label>
                <div className="flex justify-between gap-2">
                  <button
                    onClick={handleDeleteAccount}
                    disabled={deleteConfirmation !== 'DELETE'}
                    className="flex-1 py-2 font-semibold rounded-xl border border-red-500 text-red-400 bg-deepBlack hover:bg-red-800 hover:text-white hover:border-red-400 transition shadow-sm hover:shadow-red-500 disabled:cursor-not-allowed disabled:opacity-35"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => { setShowConfirmDelete(false); setDeleteConfirmation(''); }}
                    className="flex-1 py-2 font-semibold rounded-xl border border-gray-500 text-gray-300 bg-deepBlack hover:bg-gray-700 hover:text-white hover:border-gray-300 transition"
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
