import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { validateSignUpForm, SignUpFormErrors } from '../../lib/validationUtils';

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
        setGeneralError("An account with this email already exists.");
      } else {
        // Handle other types of errors or set a general error message
        setGeneralError("An unexpected error occurred. Please try again later.");
      }
    }
    
  };

  return (
    <form onSubmit={handleSignUp} className="bg-deepBlack text-mintGlow shadow-xl border border-neonCyan rounded-xl px-8 pt-6 pb-8 mb-4 w-full">
      <h2 className="text-neonYellow text-2xl font-bold mb-6 text-center">Sign Up</h2>

      <div className="mb-4">
        <label htmlFor="signUpEmail" className="block text-sm font-semibold mb-2">Email</label>
        <input
          id="signUpEmail"
          type="email"
          value={username}
          onChange={(e) => {
            setEmail(e.target.value);
            setGeneralError('');
          }}
          required
          className="w-full px-3 py-2 bg-black border border-neonCyan text-neonYellow rounded focus:outline-none focus:ring-2 focus:ring-electricPink"
        />
        {errors.email && <p className="text-red-500 text-xs italic mt-1">{errors.email}</p>}
      </div>

      <div className="mb-4">
        <label htmlFor="username" className="block text-sm font-semibold mb-2">Username</label>
        <input
          id="username"
          type="text"
          value={preferred_username}
          onChange={(e) => {
            setUsername(e.target.value);
            setGeneralError('');
          }}
          required
          className="w-full px-3 py-2 bg-black border border-neonCyan text-neonYellow rounded focus:outline-none focus:ring-2 focus:ring-electricPink"
        />
        {errors.preferred_username && <p className="text-red-500 text-xs italic mt-1">{errors.preferred_username}</p>}
      </div>

      <div className="mb-6">
        <label htmlFor="signUpPassword" className="block text-sm font-semibold mb-2">Password</label>
        <input
          id="signUpPassword"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full px-3 py-2 bg-black border border-neonCyan text-neonYellow rounded focus:outline-none focus:ring-2 focus:ring-electricPink"
        />
        {errors.password && <p className="text-red-500 text-xs italic mt-1">{errors.password}</p>}
        {generalError && (
          <div className="mt-2">
            <p className="text-red-500 text-xs italic">{generalError}</p>
            {generalError.includes("already exists") && onSwitchToVerifyEmail && (
              <button
                type="button"
                onClick={() => onSwitchToVerifyEmail(username)}
                className="mt-1 text-electricPink hover:underline text-sm"
              >
                Click here to verify your email.
              </button>
            )}
          </div>
        )}
      </div>

      <div className="mt-6 space-y-3">
        <button
          type="submit"
          className="w-full py-2 mt-2 text-electricPink font-bold rounded-xl border border-electricPink hover:bg-electricPink hover:text-black transition hover:scale-105 shadow-md"
        >
          Sign Up
        </button>
        <button
          type="button"
          onClick={onSwitch}
          className="block text-center w-full text-neonCyan hover:text-electricPink text-sm"
        >
          Already have an account? Login
        </button>
      </div>
    </form>
  );
};

export default SignUpForm;
