// Settings.tsx

import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getMyProfile, updateMyPreferences, updateMyProfile } from '../../services/profiles';

interface SettingsProps {
  onClose: () => void;
  scoreSuggestionsEnabled?: boolean;
  onScoreSuggestionsChange?: (enabled: boolean) => void;
}

const Settings: React.FC<SettingsProps> = ({ onClose, scoreSuggestionsEnabled = true, onScoreSuggestionsChange }) => {
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
    isUserSignedIn,
  } = useAuth();

  useEffect(() => {
    if (!isUserSignedIn) return;
    void getMyProfile().then((profile) => onScoreSuggestionsChange?.(profile.scoreSuggestionsEnabled)).catch(() => undefined);
    // Load once when authentication becomes available; the callback is intentionally not a trigger.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUserSignedIn]);
  const changeSuggestions = (enabled: boolean) => { onScoreSuggestionsChange?.(enabled); if (isUserSignedIn) void getMyProfile().then((profile) => updateMyPreferences(enabled, profile.dailyReminderEnabled, profile.dailyReminderHour)).catch(() => setProfileError('Saved in this browser, but could not sync to your account.')); };

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
      setProfileMessage('Profile updated. Your leaderboard scores now use your new username.');
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
    <div className="fixed right-0 top-0 z-50 h-full w-full max-w-lg overflow-y-auto border-l border-neonCyan bg-deepBlack text-mintGlow shadow-2xl">
      <div className="relative space-y-5 p-5 sm:p-7">
        <button
          onClick={onClose}
          className="absolute top-0 right-0 mt-4 mr-4 text-3xl text-neonCyan hover:text-electricPink"
          aria-label="Close settings"
        >
          &times;
        </button>

        <div><p className="eyebrow">Your space</p><h2 className="section-heading">Account</h2><p className="mt-1 text-sm text-gray-400">Manage your profile, gameplay preferences and security.</p></div>

        <section className="account-panel">
          <div className="account-panel-heading"><span className="account-panel-icon">⚙</span><div><h3>Gameplay</h3><p>Preferences saved on this device</p></div></div>
          <label className="mt-3 flex cursor-pointer items-center justify-between gap-4">
            <span><strong className="block text-mintGlow">Score suggestions</strong><small className="mt-1 block leading-5 text-gray-400">Show the best available score after each roll.</small></span>
            <input type="checkbox" checked={scoreSuggestionsEnabled} onChange={(event) => changeSuggestions(event.target.checked)} className="account-toggle" />
          </label>
        </section>

        <section className="account-panel">
          <div className="account-panel-heading"><span className="account-avatar">{(userDetails.preferred_username || '?').charAt(0).toUpperCase()}</span><div><h3>{userDetails.preferred_username}</h3><p>Public player profile</p></div></div>
          <dl className="account-details"><div><dt>Email</dt><dd>{userDetails.email}</dd></div><div><dt>Name</dt><dd>{[userDetails.given_name, userDetails.family_name].filter(Boolean).join(' ') || 'Not set'}</dd></div></dl>
          <p className="mt-3 text-xs text-gray-400">Your name and email stay private. Only your username appears publicly.</p>
          {!editingProfile && (
            <button onClick={() => { setEditingProfile(true); setProfileMessage(''); }} className="w-full py-2 mt-3 border border-neonCyan text-neonCyan rounded-xl font-semibold hover:bg-neonCyan hover:text-black transition">
              Edit Profile
            </button>
          )}
        </section>

        {editingProfile && (
          <form onSubmit={handleSaveProfile} className="overflow-hidden rounded-2xl border border-slate-700 bg-slate-950/80">
            <div className="space-y-4 p-4">
            <div><h3 className="font-black text-white">Edit profile</h3><p className="mt-1 text-xs leading-5 text-gray-400">Your username appears publicly on scores. Your first name and surname stay private.</p></div>
            <label className="block text-sm font-bold text-mintGlow">Username <span className="ml-1 text-xs font-normal text-gray-500">Public</span>
              <input value={username} onChange={(e) => { setUsername(e.target.value); setProfileError(''); }} autoCapitalize="none" autoCorrect="off" className="mt-2 w-full rounded-xl border border-neonCyan bg-black px-3 py-3 text-white outline-none focus:ring-2 focus:ring-neonCyan/40" />
            </label>
            <label className="block text-sm font-bold text-mintGlow">First name <span className="ml-1 text-xs font-normal text-gray-500">Private</span>
              <input value={firstName} onChange={(e) => { setFirstName(e.target.value); setProfileError(''); }} autoComplete="given-name" className="mt-2 w-full rounded-xl border border-neonCyan bg-black px-3 py-3 text-white outline-none focus:ring-2 focus:ring-neonCyan/40" />
            </label>
            <label className="block text-sm font-bold text-mintGlow">Surname <span className="ml-1 text-xs font-normal text-gray-500">Private</span>
              <input value={lastName} onChange={(e) => { setLastName(e.target.value); setProfileError(''); }} autoComplete="family-name" className="mt-2 w-full rounded-xl border border-neonCyan bg-black px-3 py-3 text-white outline-none focus:ring-2 focus:ring-neonCyan/40" />
            </label>
            {profileError && <p role="alert" className="rounded-xl border border-red-500/50 bg-red-950/40 p-3 text-sm text-red-300">{profileError}</p>}
            </div>
            <div className="sticky bottom-0 flex gap-2 border-t border-slate-700 bg-slate-950 p-3 shadow-[0_-8px_20px_rgba(0,0,0,0.45)]">
              <button type="button" onClick={() => { setEditingProfile(false); setProfileError(''); }} className="flex-1 rounded-xl border border-gray-500 py-3 font-bold text-gray-300 hover:border-white hover:text-white">Cancel</button>
              <button type="submit" disabled={profileSaving} className="flex-[1.4] rounded-xl bg-neonCyan py-3 font-black text-black transition hover:bg-neonYellow disabled:cursor-wait disabled:opacity-50">{profileSaving ? 'Saving profile…' : 'Save profile'}</button>
            </div>
          </form>
        )}
        {!editingProfile && profileError && <p role="alert" className="text-sm text-red-400">{profileError}</p>}
        {profileMessage && <p className="text-sm text-mintGlow">{profileMessage}</p>}

        {!showConfirmDelete && !showResetPassword && (
          <section className="account-panel">
            <div className="account-panel-heading"><span className="account-panel-icon">⌁</span><div><h3>Security</h3><p>Update your account password</p></div></div>
            <button
              onClick={handleRequestResetPassword}
              className="mt-3 w-full py-2 px-4 bg-neonCyan text-black rounded-xl font-semibold hover:bg-electricPink transition"
            >
              Send Reset Code
            </button>
          </section>
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
          <section className="account-danger">
            <h3 className="font-semibold text-red-400 mb-1">Delete account</h3><p className="mb-3 text-xs leading-5 text-gray-500">Permanently remove your account, profile and leaderboard history.</p>
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
          </section>
        )}
      </div>
    </div>
  );
};

export default Settings;
