import React, { useState } from 'react';
import LoginForm from './LoginForm';
import SignUpForm from './SignUpForm';
import EmailVerificationForm from './EmailVerificationForm';

interface AuthenticationManagerProps {
  onClose: () => void;
}

const AuthenticationManager: React.FC<AuthenticationManagerProps> = ({ onClose }) => {
  const [userEmail, setUserEmail] = useState('');
  const [currentForm, setCurrentForm] = useState('login');

  const handleSignUpSuccess = (email: string) => {
    setUserEmail(email);
    setCurrentForm('verifyEmail');
  };

  const handleLoginSuccess = () => {
    onClose();
  };

  const handleVerificationSuccess = () => {
    onClose();
  };

  return (
    <div>
      {currentForm === 'login' && (
        <LoginForm onSwitch={() => setCurrentForm('signup')} onClose={handleLoginSuccess} />
      )}
      {currentForm === 'signup' && (
        <SignUpForm
          onSwitch={() => setCurrentForm('login')}
          onClose={onClose}
          onSignUpSuccess={handleSignUpSuccess}
        />
      )}
      {currentForm === 'verifyEmail' && (
        <EmailVerificationForm userEmail={userEmail} onVerified={handleVerificationSuccess} />
      )}
    </div>
  );
};

export default AuthenticationManager;
