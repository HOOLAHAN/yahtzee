import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { cleanVerificationCode, friendlyAuthError, maskEmail } from '../../lib/authUx';

const LoginForm: React.FC<{
  onSwitch: () => void;
  onClose: () => void;
  onSwitchToVerifyEmail?: (email: string) => void;
}> = ({ onSwitch, onClose, onSwitchToVerifyEmail }) => {
  const [loginEmail, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showResetForm, setShowResetForm] = useState(false);
  const [resetCodeSent, setResetCodeSent] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [resendSeconds, setResendSeconds] = useState(0);
  const { signIn, resetUserPassword, confirmUserPasswordReset } = useAuth();
  useEffect(() => { if (!resendSeconds) return; const timer = window.setInterval(() => setResendSeconds((value) => Math.max(0, value - 1)), 1000); return () => window.clearInterval(timer); }, [resendSeconds]);

  const handleSignIn = async () => {
    setError('');
    try {
      await signIn({ username: loginEmail, password });
      onClose(); 
    } catch (error) {
      console.error('Error signing in:', error);
      if (error instanceof Error) {
        if (error.name === "NotAuthorizedException") {
          if (error.message.includes("Incorrect username or password.")) {
            setError('Incorrect username or password.');
          } else if (error.message.includes("Unauthenticated access is not supported for this identity pool.")) {
            setError('Your account requires verification.');
          } else {
            setError(error.message);
          }
        } else if (error.name === "UserNotFoundException" || error.message.includes("User does not exist.")) {
          setError("Account does not exist. Please follow the sign up link below.");
        } else {
          setError('An unexpected error occurred. Please try again.');
        }
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!showResetForm) {
      await handleSignIn();
    } else if (!resetCodeSent) {
      await handleRequestResetCode();
    } else {
      await handleResetPassword();
    }
  };

  const handleRequestResetCode = async () => {
    if (!/^\S+@\S+\.\S+$/.test(loginEmail.trim())) return setError('Enter a valid email address.');
    setBusy(true);
    try {
      await resetUserPassword(loginEmail);
      setResetCodeSent(true);
      setError('');
      setResendSeconds(30);
      alert('If an account with that email exists, a password reset code has been sent.');
    } catch (error) {
      console.error('Error requesting password reset code:', error);
      setError(friendlyAuthError(error));
    } finally { setBusy(false); }
  };

  const handleResetPassword = async () => {
    if (verificationCode.length !== 6) return setError('Enter the six-digit code from your email.');
    if (newPassword.length < 8) return setError('Use a password with at least 8 characters.');
    if (newPassword !== confirmPassword) return setError('The passwords do not match.');
    setBusy(true);
    try {
      await confirmUserPasswordReset(loginEmail, verificationCode, newPassword);
      alert('Your password has been reset successfully.');
      setShowResetForm(false);
      setResetCodeSent(false);
      setVerificationCode(''); setNewPassword(''); setConfirmPassword('');
    } catch (error) {
      console.error('Error resetting password:', error);
      setError(friendlyAuthError(error));
    } finally { setBusy(false); }
  };

  return (
    <div className="bg-deepBlack text-mintGlow shadow-xl border border-neonCyan rounded-xl px-8 pt-6 pb-8 mb-4 w-full">
      <h2 className="text-neonYellow text-2xl font-bold mb-6 text-center">
        {showResetForm ? 'Reset Password' : 'Login'}
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-semibold mb-2">Email</label>
          <input
            id="email"
            type="email"
            value={loginEmail}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 bg-black border border-neonCyan text-neonYellow rounded focus:outline-none focus:ring-2 focus:ring-electricPink"
          />
        </div>

        {showResetForm ? (
          <>
            {resetCodeSent && (
              <>
                <div className="mb-4">
                  <p className="text-sm mb-4">Enter the six-digit code sent to <strong className="text-neonCyan">{maskEmail(loginEmail)}</strong>.</p><label htmlFor="verificationCode" className="block text-sm font-semibold mb-2">Verification Code</label>
                  <input
                    id="verificationCode"
                    type="text" inputMode="numeric" autoComplete="one-time-code" maxLength={6}
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(cleanVerificationCode(e.target.value))}
                    required
                    className="w-full px-3 py-3 text-center tracking-[0.6em] text-xl font-black bg-black border border-neonCyan text-neonYellow rounded focus:outline-none focus:ring-2 focus:ring-electricPink"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="newPassword" className="block text-sm font-semibold mb-2">New Password</label>
                  <input
                    id="newPassword"
                    type={showPassword ? 'text' : 'password'} autoComplete="new-password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-black border border-neonCyan text-neonYellow rounded focus:outline-none focus:ring-2 focus:ring-electricPink"
                  />
                </div>
                <div className="mb-4"><label htmlFor="confirmNewPassword" className="block text-sm font-semibold mb-2">Confirm New Password</label><input id="confirmNewPassword" type={showPassword ? 'text' : 'password'} autoComplete="new-password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="w-full px-3 py-2 bg-black border border-neonCyan text-neonYellow rounded focus:outline-none focus:ring-2 focus:ring-electricPink" /><p className="text-gray-400 text-xs mt-1">Use at least 8 characters.</p><button type="button" onClick={() => setShowPassword((value) => !value)} className="mt-2 text-neonCyan text-sm">{showPassword ? 'Hide passwords' : 'Show passwords'}</button></div>
              </>
            )}
            <button type="submit" disabled={busy} className="w-full py-2 mt-2 text-electricPink font-bold rounded-xl border border-electricPink hover:bg-electricPink hover:text-black transition hover:scale-105 shadow-md">
              {busy ? 'Please wait…' : resetCodeSent ? 'Reset Password' : 'Send Reset Code'}
            </button>
            {resetCodeSent && <button type="button" disabled={busy || resendSeconds > 0} onClick={() => void handleRequestResetCode()} className="w-full mt-3 text-neonCyan text-sm">{resendSeconds > 0 ? `Resend code in ${resendSeconds}s` : 'Resend reset code'}</button>}
            {resetCodeSent && <button type="button" onClick={() => { setResetCodeSent(false); setVerificationCode(''); setError(''); }} className="w-full mt-3 text-neonCyan text-sm">Use a different email</button>}
          </>
        ) : (
          <>
            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-semibold mb-2">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2 bg-black border border-neonCyan text-neonYellow rounded focus:outline-none focus:ring-2 focus:ring-electricPink"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 mt-2 text-electricPink font-bold rounded-xl border border-electricPink hover:bg-electricPink hover:text-black transition hover:scale-105 shadow-md"           >
              Login
            </button>
          </>
        )}

        {error && <p className="text-red-500 text-xs italic mt-2">{error}</p>}
        
        {error === 'Your account requires verification.' && onSwitchToVerifyEmail && (
          <button
            onClick={() => onSwitchToVerifyEmail(loginEmail)}
            className="mt-4 text-electricPink hover:underline text-sm"
          >
            Click here to verify your email.
          </button>
        )}

        {!showResetForm && (
          <p className="mt-4 text-neonCyan hover:text-electricPink text-sm cursor-pointer" onClick={() => setShowResetForm(true)}>
            Forgot Password?
          </p>
        )}

        {!showResetForm && (
          <p className="mt-2 text-neonCyan hover:text-electricPink text-sm cursor-pointer" onClick={onSwitch}>
            Don’t have an account? Sign up
          </p>
        )}
      </form>
    </div>
  );
};

export default LoginForm;
