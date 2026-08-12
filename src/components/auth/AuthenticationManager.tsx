import React, { useState, useEffect } from 'react';
import LoginForm from './LoginForm';
import SignUpForm from './SignUpForm';
import EmailVerificationForm from './EmailVerificationForm';

interface AuthenticationManagerProps {
  onClose: () => void;
  initialForm?: 'login' | 'signup';
}

const AuthenticationManager: React.FC<AuthenticationManagerProps & { onFormChange?: (form: string) => void }> = ({ onClose, onFormChange, initialForm = 'login' }) => {
  const [userEmail, setUserEmail] = useState('');
  const [currentForm, setCurrentForm] = useState<'login' | 'signup' | 'verifyEmail'>(initialForm);

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

  const handleSwitchToVerifyEmail = (email: string) => {
    setUserEmail(email);
    setCurrentForm('verifyEmail');
  };

  useEffect(() => {
    if (onFormChange) {
      onFormChange(currentForm);
    }
  }, [currentForm, onFormChange]);

  return (
    <div className="flex justify-center items-center min-h-[400px] p-4 bg-deepBlack rounded-xl shadow-lg">
      {currentForm === 'login' && (
        <div className="transition-opacity duration-300 ease-in-out w-full max-w-md">
          <LoginForm
            onSwitch={() => setCurrentForm('signup')}
            onClose={handleLoginSuccess}
            onSwitchToVerifyEmail={handleSwitchToVerifyEmail}
          />
        </div>
      )}
      {currentForm === 'signup' && (
        <div className="transition-opacity duration-300 ease-in-out w-full max-w-md">
          <SignUpForm
            onSwitch={() => setCurrentForm('login')}
            onClose={onClose}
            onSignUpSuccess={handleSignUpSuccess}
            onSwitchToVerifyEmail={handleSwitchToVerifyEmail}
          />
        </div>
      )}
      {currentForm === 'verifyEmail' && (
        <div className="transition-opacity duration-300 ease-in-out w-full max-w-md">
          <EmailVerificationForm
            userEmail={userEmail}
            onVerified={handleVerificationSuccess}
            onChangeEmail={() => setCurrentForm('signup')}
          />
        </div>
      )}
    </div>
  );
};

export default AuthenticationManager;
