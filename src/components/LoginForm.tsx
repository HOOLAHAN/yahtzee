import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const LoginForm: React.FC<{
  onSwitch: () => void;
  onClose: () => void;
  onSwitchToVerifyEmail?: (email: string) => void
}> = ({ onSwitch, onClose, onSwitchToVerifyEmail }) => {
  const [loginEmail, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showResetForm, setShowResetForm] = useState(false);
  const [resetCodeSent, setResetCodeSent] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const { signIn, resetUserPassword, confirmUserPasswordReset } = useAuth();

  const handleSignIn = async () => {
    setError('');
    try {
      await signIn({ username: loginEmail, password });
      onClose(); 
    } catch (error) {
      console.error('Error signing in:', error);
      if (error instanceof Error) {
        // Check for NotAuthorizedException
        if (error.name === "NotAuthorizedException") {
          if (error.message.includes("Incorrect username or password.")) {
            setError('Incorrect username or password.');
          } else if (error.message.includes("Unauthenticated access is not supported for this identity pool.")) {
            setError('Your account requires verification.');
          } else {
            setError(error.message); // For any other NotAuthorizedException messages
          }
        } 
        // Check for UserNotFoundException
        else if (error.name === "UserNotFoundException" || error.message.includes("User does not exist.")) {
          setError("Account does not exist. Please follow the sign up link below.");
        } 
        else {
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
    try {
      await resetUserPassword(loginEmail);
      setResetCodeSent(true);
      setError('');
      alert('If an account with that email exists, a password reset code has been sent.');
    } catch (error) {
      console.error('Error requesting password reset code:', error);
      setError('Error sending password reset code.');
    }
  };

  const handleResetPassword = async () => {
    if (!verificationCode || !newPassword) {
      setError('Please fill in all fields.');
      return;
    }
    try {
      await confirmUserPasswordReset(loginEmail, verificationCode, newPassword);
      alert('Your password has been reset successfully.');
      setShowResetForm(false);
      setResetCodeSent(false);
    } catch (error) {
      console.error('Error resetting password:', error);
      setError('Failed to reset password.');
    }
  };

  return (
    <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <h2 className="text-gray-700 text-lg font-bold mb-2">
        {showResetForm ? 'Reset Password' : 'Login'}
      </h2>
      <form onSubmit={handleSubmit}>
        {/* Common email input field */}
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
            Email:
          </label>
          <input
            id="email"
            type="email"
            value={loginEmail}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        {/* Toggle between reset password form and login form */}
        {showResetForm ? (
          <>
            {resetCodeSent ? (
              <>
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
                <div className="mb-6">
                  <label htmlFor="newPassword" className="block text-gray-700 text-sm font-bold mb-2">
                    New Password:
                  </label>
                  <input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
              </>
            ) : null}
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
              {resetCodeSent ? 'Reset Password' : 'Send Reset Code'}
            </button>
          </>
        ) : (
          <>
            <div className="mb-6">
              <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
                Password:
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
              Login
            </button>
          </>
        )}
        {error && <p className="text-red-500 text-xs italic mt-2">{error}</p>}
        {error === 'Your account requires verification.' && onSwitchToVerifyEmail && (
        <button
          onClick={() => onSwitchToVerifyEmail(loginEmail)}
          className="mt-4 text-blue-500 hover:text-blue-800 text-sm cursor-pointer" 
        >
          Click here to verify your email.
        </button>
      )}
        {!showResetForm && (
          <p className="mt-4 text-blue-500 hover:text-blue-800 text-sm cursor-pointer" onClick={() => setShowResetForm(true)}>
            Forgot Password?
          </p>
        )}
        <div className="mt-4">
          {!showResetForm && (
            <p className="mt-2 text-blue-500 hover:text-blue-800 text-sm cursor-pointer" onClick={onSwitch}>
              Don't have an account? Sign up
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
