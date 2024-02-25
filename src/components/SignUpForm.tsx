import React, { useState } from 'react';
import { userPool } from '../awsConfig';
import { CognitoUserAttribute } from 'amazon-cognito-identity-js';

const SignUpForm: React.FC<{ onSwitch: () => void, onClose: () => void }> = ({ onSwitch, onClose }) => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    
    const attributeList = [
        new CognitoUserAttribute({
            Name: 'email',
            Value: email,
        }),
        new CognitoUserAttribute({
            Name: 'preferred_username',
            Value: username,
        }),
    ];

    userPool.signUp(email, password, attributeList, [], (err, result) => {
      if (err) {
          console.error(err.message || JSON.stringify(err));
          return;
      }
      console.log('Sign-up successful', result);
      onClose(); // Close the modal on successful sign-up
      // Redirect user or update UI as necessary
  });
  
};

  return (
    <form onSubmit={handleSignUp} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <h2 className="block text-gray-700 text-lg font-bold mb-2">Sign Up</h2>
      <div className="mb-4">
        <label htmlFor="signUpEmail" className="block text-gray-700 text-sm font-bold mb-2">
          Email:
        </label>
        <input
          id="signUpEmail"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="username" className="block text-gray-700 text-sm font-bold mb-2">
          Username:
        </label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div className="mb-6">
        <label htmlFor="signUpPassword" className="block text-gray-700 text-sm font-bold mb-2">
          Password:
        </label>
        <input
          id="signUpPassword"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div className="flex items-center justify-between">
        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
          Sign Up
        </button>
        <button type="button" onClick={onSwitch} className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800">
          Already have an account? Login
        </button>
      </div>
    </form>
  );
};

export default SignUpForm;
