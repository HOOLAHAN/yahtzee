import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const EmailVerificationForm: React.FC<{ userEmail: string; onVerified: () => void }> = ({ userEmail, onVerified }) => {
  const [verificationCode, setVerificationCode] = useState('');
  const { confirmEmail } = useAuth(); 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await confirmEmail({ username: userEmail, confirmationCode: verificationCode });
      alert("Email verified successfully!");
      onVerified();
    } catch (error) {
      const e = error as Error;
      console.error("Verification error:", e);
      alert(e.message || JSON.stringify(e));
    }
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
      <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
        Verify Email
      </button>
    </form>
  );
};

export default EmailVerificationForm;
