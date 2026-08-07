import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { validateSignUpForm, SignUpFormErrors } from '../../lib/validationUtils';
import { isUsernameAvailable } from '../../services/profiles';
import { friendlyAuthError } from '../../lib/authUx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

interface SignUpFormProps {
  onSwitch: () => void;
  onClose: () => void;
  onSignUpSuccess: (email: string) => void;
}

const SignUpForm: React.FC<SignUpFormProps & { onSwitchToVerifyEmail?: (email: string) => void }> = ({ onSwitch, onSignUpSuccess, onSwitchToVerifyEmail }) => {
  const [username, setEmail] = useState('');
  const [preferred_username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [errors, setErrors] = useState<SignUpFormErrors>({});
  const [generalError, setGeneralError] = useState('');
  const { signUp } = useAuth();

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formErrors = validateSignUpForm({ username, preferred_username, password, confirmPassword, given_name: firstName, family_name: lastName });

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setBusy(true); setGeneralError('');
    try {
      if (!(await isUsernameAvailable(preferred_username))) {
        setErrors({ preferred_username: 'That username is already taken.' });
        return;
      }
      await signUp({ username, password, preferred_username, given_name: firstName.trim(), family_name: lastName.trim() });
      onSignUpSuccess(username);
    } catch (error) {
      console.error('Error during sign-up:', error);
      // Check if the error is a UsernameExistsException and set a friendly message
      if (error instanceof Error && error.name === "UsernameExistsException") {
        setGeneralError("An account with this email already exists.");
      } else setGeneralError(friendlyAuthError(error));
    } finally { setBusy(false); }
    
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

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <label htmlFor="firstName" className="block text-sm font-semibold mb-2">First name</label>
          <input id="firstName" type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required className="w-full px-3 py-2 bg-black border border-neonCyan text-neonYellow rounded focus:outline-none focus:ring-2 focus:ring-electricPink" />
          {errors.given_name && <p className="text-red-500 text-xs italic mt-1">{errors.given_name}</p>}
        </div>
        <div>
          <label htmlFor="lastName" className="block text-sm font-semibold mb-2">Surname</label>
          <input id="lastName" type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} required className="w-full px-3 py-2 bg-black border border-neonCyan text-neonYellow rounded focus:outline-none focus:ring-2 focus:ring-electricPink" />
          {errors.family_name && <p className="text-red-500 text-xs italic mt-1">{errors.family_name}</p>}
        </div>
      </div>
      <p className="text-xs text-gray-400 mb-4">Your first name and surname are private and are not shown on leaderboards.</p>

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
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => { setPassword(e.target.value); setErrors((value) => ({ ...value, password: undefined })); }}
          autoComplete="new-password"
          required
          className="w-full px-3 py-2 bg-black border border-neonCyan text-neonYellow rounded focus:outline-none focus:ring-2 focus:ring-electricPink"
        />
        {errors.password && <p className="text-red-500 text-xs italic mt-1">{errors.password}</p>}
        <p className="text-gray-400 text-xs mt-1">Use at least 8 characters.</p>
        <label htmlFor="confirmPassword" className="block text-sm font-semibold mb-2 mt-4">Confirm password</label>
        <input id="confirmPassword" type={showPassword ? 'text' : 'password'} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} autoComplete="new-password" required className="w-full px-3 py-2 bg-black border border-neonCyan text-neonYellow rounded focus:outline-none focus:ring-2 focus:ring-electricPink" />
        {errors.confirmPassword && <p className="text-red-500 text-xs italic mt-1">{errors.confirmPassword}</p>}
        <button type="button" aria-label={showPassword ? 'Hide passwords' : 'Show passwords'} onClick={() => setShowPassword((value) => !value)} className="mt-2 text-neonCyan text-sm"><FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} className="mr-2" />{showPassword ? 'Hide passwords' : 'Show passwords'}</button>
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
          type="submit" disabled={busy}
          className="w-full py-2 mt-2 text-electricPink font-bold rounded-xl border border-electricPink hover:bg-electricPink hover:text-black transition hover:scale-105 shadow-md"
        >
          {busy ? 'Creating account…' : 'Create Account'}
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
