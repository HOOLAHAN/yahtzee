import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { cleanVerificationCode, friendlyAuthError, maskEmail } from '../../lib/authUx';

const EmailVerificationForm: React.FC<{ userEmail: string; onVerified: () => void; onChangeEmail: () => void }> = ({ userEmail, onVerified, onChangeEmail }) => {
  const [verificationCode, setVerificationCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [resendSeconds, setResendSeconds] = useState(30);
  const { confirmEmail, resendVerificationCode } = useAuth();
  useEffect(() => { if (!resendSeconds) return; const timer = window.setInterval(() => setResendSeconds((value) => Math.max(0, value - 1)), 1000); return () => window.clearInterval(timer); }, [resendSeconds]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (verificationCode.length !== 6) return setErrorMessage('Enter the six-digit code from your email.');
    setBusy(true);
    try {
      await confirmEmail({ username: userEmail, confirmationCode: verificationCode });
      alert("Email verified — your Yahtzee Hub account is ready!");
      onVerified();
    } catch (error) {
      const err = error as Error;
      console.error("Verification error:", err);
      setErrorMessage(friendlyAuthError(err));
    } finally { setBusy(false); }
  };

  const handleResendCode = async () => {
    if (!userEmail) {
      setErrorMessage("Email address is missing. Please ensure you've entered your email.");
      return;
    }
    try {
      await resendVerificationCode(userEmail);
      setResendSeconds(30); alert(`A new code was sent to ${maskEmail(userEmail)}.`);
    } catch (error) {
      setErrorMessage("Failed to resend verification code.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-deepBlack text-mintGlow shadow-xl border border-neonCyan rounded-xl px-8 pt-6 pb-8 mb-4 w-full"
    >
      <h2 className="text-neonYellow text-2xl font-bold mb-6 text-center">Verify Your Email</h2>
      <p className="text-center text-sm text-mintGlow mb-6">We sent a six-digit code to <strong className="text-neonCyan">{maskEmail(userEmail)}</strong>.</p>

      <div className="mb-4">
        <label htmlFor="verificationCode" className="block text-sm font-semibold mb-2">Verification Code</label>
        <input
          id="verificationCode"
          type="text" inputMode="numeric" autoComplete="one-time-code" maxLength={6}
          value={verificationCode}
          onChange={(e) => setVerificationCode(cleanVerificationCode(e.target.value))}
          required
          className="w-full px-3 py-3 text-center tracking-[0.6em] text-xl font-black bg-black border border-neonCyan text-neonYellow rounded focus:outline-none focus:ring-2 focus:ring-electricPink"
        />
      </div>

      {errorMessage && (
        <div className="mb-4 text-red-500 text-sm">{errorMessage}</div>
      )}

      <div className="space-y-3 mt-6">
        <button
          type="submit" disabled={busy}
          className="w-full py-2 mt-2 text-electricPink font-bold rounded-xl border border-electricPink hover:bg-electricPink hover:text-black transition hover:scale-105 shadow-md"
        >
          {busy ? 'Verifying…' : 'Verify Email'}
        </button>
        <button type="button" onClick={onChangeEmail} className="w-full mt-3 text-neonCyan text-sm">Use a different email</button>
        <button
          type="button"
          onClick={handleResendCode} disabled={busy || resendSeconds > 0}
          className="w-full py-2 mt-2 text-electricPink font-bold rounded-xl border border-electricPink hover:bg-electricPink hover:text-black transition hover:scale-105 shadow-md"
        >
          {resendSeconds > 0 ? `Resend code in ${resendSeconds}s` : 'Resend Code'}
        </button>
      </div>
    </form>
  );
};

export default EmailVerificationForm;
