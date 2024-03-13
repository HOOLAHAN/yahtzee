import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { validateSignUpForm, SignUpFormErrors } from '../functions/validationUtils';

interface SignUpFormProps {
  onSwitch: () => void;
  onClose: () => void;
  onSignUpSuccess: (email: string) => void;
}

const SignUpForm: React.FC<SignUpFormProps & { onSwitchToVerifyEmail?: (email: string) => void }> = ({ onSwitch, onSignUpSuccess, onSwitchToVerifyEmail }) => {
  const [username, setEmail] = useState('');
  const [preferred_username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<SignUpFormErrors>({});
  const [generalError, setGeneralError] = useState('');
  const { signUp } = useAuth();

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formErrors = validateSignUpForm({ username, preferred_username, password });

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    try {
      await signUp({ username, password, preferred_username });
      console.log('Sign-up successful');
      onSignUpSuccess(username);
    } catch (error) {
      console.error('Error during sign-up:', error);
      // Check if the error is a UsernameExistsException and set a friendly message
      if (error instanceof Error && error.name === "UsernameExistsException") {
        setGeneralError("An account with this email already exists. Please log in or use a different email.");
      } else {
        // Handle other types of errors or set a general error message
        setGeneralError("An unexpected error occurred. Please try again later.");
      }
    }
    
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
          value={username}
          onChange={(e) => {
            setEmail(e.target.value);
            setGeneralError('');
          }}
          required
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
        {errors.email && <p className="text-red-500 text-xs italic">{errors.email}</p>}
      </div>
      <div className="mb-4">
        <label htmlFor="username" className="block text-gray-700 text-sm font-bold mb-2">
          Username:
        </label>
        <input
          id="username"
          type="text"
          value={preferred_username}
          onChange={(e) => {
            setUsername(e.target.value);
            setGeneralError('');
          }}
          required
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
        {errors.preferred_username && <p className="text-red-500 text-xs italic">{errors.preferred_username}</p>}
      </div>
      <div className="mb-6">
        <label htmlFor="signUpPassword" className="block text-gray-700 text-sm font-bold mb-2">
          Password:
        </label>
        <input
          id="signUpPassword"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value) }
          required
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
        />
        {errors.password && <p className="text-red-500 text-xs italic">{errors.password}</p>}
        {generalError && (
        <div className="mb-4">
          {generalError && (
            <div className="mb-4">
              <p className="text-red-500 text-xs italic">{generalError}</p>
              {generalError.includes("already exists") && onSwitchToVerifyEmail && (
                <button
                  type="button"
                  onClick={() => onSwitchToVerifyEmail(username)}
                  className="text-blue-500 hover:text-blue-800 text-sm"
                >
                  Click here to verify your email.
                </button>
              )}
            </div>
          )}
        </div>
      )}
      </div>
      <div className="flex items-center justify-between">
        <button type="submit" className="transition duration-300 ease-in-out transform hover:scale-105 py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 focus:ring focus:ring-blue-200 mr-4">
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
