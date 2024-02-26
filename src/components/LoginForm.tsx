import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const LoginForm: React.FC<{ onSwitch: () => void, onClose: () => void }> = ({ onSwitch, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signIn } = useAuth();

  const handleSignIn = async () => {
    try {
      await signIn({ username: email, password }); // Use context's signIn
      console.log('login success');
      onClose(); // Close the modal on successful login
    } catch (error) {
      console.error('error signing in', error);
      // Handle login errors here
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
          value={email}
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
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div className="flex items-center justify-between">
        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-black font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
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
