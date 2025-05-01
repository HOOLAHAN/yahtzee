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
      // Set the error message to be displayed below the form
      setErrorMessage(err.message || "An error occurred during verification. Please try again.");
    }
  }; 

  const handleResendCode = async () => {
    if (!userEmail) {
      setErrorMessage("Email address is missing. Please ensure you've entered your email.");
      return;
    }
    await resendVerificationCode(userEmail);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <div className="mb-4">
        <label htmlFor="verificationCode" className="block text-gray-700 text-sm font-bold mb-2">
          Verification Code:
        </label>
        <input
          id="verificationCode"
          type="text"
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value)}
          required
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      {errorMessage && (
        <div className="mb-4 text-red-500 text-sm">
          {errorMessage}
        </div>
      )}
      <button type="submit" className="transition duration-300 ease-in-out transform hover:scale-105 py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 focus:ring focus:ring-blue-200 mr-4">
        Verify Email
      </button>
      <button type="button" onClick={handleResendCode} className="transition duration-300 ease-in-out transform hover:scale-105 py-2 px-4 bg-green-600 text-white rounded hover:bg-green-700 focus:ring focus:ring-green-200">
        Resend Code
      </button>
    </form>
  );
};

export default EmailVerificationForm;
