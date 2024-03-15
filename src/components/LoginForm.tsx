import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const LoginForm: React.FC<{
  onSwitch: () => void;
  onClose: () => void;
  onSwitchToVerifyEmail?: () => void;
}> = ({ onSwitch, onClose, onSwitchToVerifyEmail }) => {
  const [login_email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { signIn } = useAuth();

  const handleSignIn = async () => {
    setError('');
    try {
      await signIn({ username: login_email, password });
      onClose(); 
    } catch (error) {
      console.error('Error signing in:', error);
      if (error instanceof Error) {
        if (error.name === "NotAuthorizedException") {
          setError('Your account requires verification.');
        } else {
          setError('Failed to sign in. Please check your email and password.');
        }
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleSignIn();
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <h2 className="block text-gray-700 text-lg font-bold mb-2">Login</h2>
      <div className="mb-4">
        <label htmlFor="loginEmail" className="block text-gray-700 text-sm font-bold mb-2">
          Email:
        </label>
        <input
          id="loginEmail"
          type="email"
          value={login_email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div className="mb-6">
        <label htmlFor="loginPassword" className="block text-gray-700 text-sm font-bold mb-2">
          Password:
        </label>
        <input
          id="loginPassword"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-2 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      {error && <div className="text-red-500 text-xs italic">{error}</div>}
      {error === 'Your account requires verification.' && onSwitchToVerifyEmail && (
        <button
          onClick={onSwitchToVerifyEmail}
          className="text-blue-500 hover:text-blue-800 text-sm mb-2 font-bold"
        >
          Click here to verify your email.
        </button>
      )}
      <div className="flex items-center justify-between">
        <button type="submit" className="transition duration-300 ease-in-out transform hover:scale-105 py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 focus:ring focus:ring-blue-200 mr-4">
          Login
        </button>
        <button type="button" onClick={onSwitch} className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800">
          Don't have an account? Sign up
        </button>
      </div>
    </form>
  );
};

export default LoginForm;
