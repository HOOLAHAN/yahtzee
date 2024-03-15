import React, { useState, useEffect } from 'react';
import LoginForm from './LoginForm';
import SignUpForm from './SignUpForm';
import EmailVerificationForm from './EmailVerificationForm';

interface AuthenticationManagerProps {
  onClose: () => void;
}

const AuthenticationManager: React.FC<AuthenticationManagerProps & { onFormChange?: (form: string) => void }> = ({ onClose, onFormChange }) => {
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
    setCurrentForm('login');
  };

  // Function to switch to the verification form
  const handleSwitchToVerifyEmail = (email: string) => {
    setUserEmail(email);
    setCurrentForm('verifyEmail');
  };

  useEffect(() => {
    if(onFormChange) {
      onFormChange(currentForm);
    }
  }, [currentForm, onFormChange]);

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
          onSwitchToVerifyEmail={handleSwitchToVerifyEmail}
        />
      )}
      {currentForm === 'verifyEmail' && (
        <EmailVerificationForm userEmail={userEmail} onVerified={handleVerificationSuccess} />
      )}
    </div>
  );
};

export default AuthenticationManager;
