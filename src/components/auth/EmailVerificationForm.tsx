import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const EmailVerificationForm: React.FC<{ userEmail: string; onVerified: () => void }> = ({ userEmail, onVerified }) => {
  const [verificationCode, setVerificationCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { confirmEmail, resendVerificationCode } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    try {
      await confirmEmail({ username: userEmail, confirmationCode: verificationCode });
      alert("Email verified successfully!");
      onVerified();
    } catch (error) {
      const err = error as Error;
      console.error("Verification error:", err);
      setErrorMessage(err.message || "An error occurred during verification. Please try again.");
    }
  };

  const handleResendCode = async () => {
    if (!userEmail) {
      setErrorMessage("Email address is missing. Please ensure you've entered your email.");
      return;
    }
    try {
      await resendVerificationCode(userEmail);
      alert("Verification code resent.");
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

      <div className="mb-4">
        <label htmlFor="verificationCode" className="block text-sm font-semibold mb-2">Verification Code</label>
        <input
          id="verificationCode"
          type="text"
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value)}
          required
          className="w-full px-3 py-2 bg-black border border-neonCyan text-neonYellow rounded focus:outline-none focus:ring-2 focus:ring-electricPink"
        />
      </div>

      {errorMessage && (
        <div className="mb-4 text-red-500 text-sm">{errorMessage}</div>
      )}

      <div className="space-y-3 mt-6">
        <button
          type="submit"
          className="w-full py-2 bg-neonCyan text-black font-bold rounded-xl hover:bg-electricPink transition hover:scale-105 shadow-md"
        >
          Verify Email
        </button>
        <button
          type="button"
          onClick={handleResendCode}
          className="w-full py-2 bg-mintGlow text-black font-bold rounded-xl hover:bg-electricPink transition hover:scale-105 shadow-md"
        >
          Resend Code
        </button>
      </div>
    </form>
  );
};

export default EmailVerificationForm;
