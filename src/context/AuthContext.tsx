import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { getCurrentUser, signOut as amplifySignOut, signUp as amplifySignUp, confirmSignUp as amplifyConfirmSignUp, SignInInput, ConfirmSignUpInput } from 'aws-amplify/auth';
import { signIn as amplifySignIn } from 'aws-amplify/auth';
import { resendSignUpCode } from 'aws-amplify/auth';
import { fetchUserAttributes } from 'aws-amplify/auth';
import { deleteUser as amplifyDeleteUser} from 'aws-amplify/auth';
import { resetPassword, confirmResetPassword, updatePassword } from 'aws-amplify/auth';


type SignUpParameters = {
  username: string;
  password: string;
  preferred_username: string
};

interface AuthContextType {
  isUserSignedIn: boolean;
  userDetails: any;
  signIn: (signInInput: SignInInput) => Promise<void>;
  signUp: (signUpParameters: SignUpParameters) => Promise<void>;
  confirmSignUp: (confirmSignUpInput: ConfirmSignUpInput) => Promise<void>;
  confirmEmail: ({ username, confirmationCode }: ConfirmSignUpInput) => Promise<void>;
  signOut: () => Promise<void>;
  checkAuthStatus: () => Promise<void>;
  resendVerificationCode: (username: string) => Promise<void>;
  deleteUser: () => Promise<void>;
  resetUserPassword: (username: string) => Promise<void>;
  confirmUserPasswordReset: (username: string, code: string, newPassword: string) => Promise<void>;
  updateUserPassword: (oldPassword: string, newPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isUserSignedIn, setIsUserSignedIn] = useState(false);
  const [userDetails, setUserDetails] = useState<any>(null);

  const checkAuthStatus = useCallback(async () => {
    try {
      const currentUser = await getCurrentUser();
      setIsUserSignedIn(true);
      const userInfo = { 
        userId: currentUser.username, 
        email: currentUser.signInDetails?.loginId
      };
      setUserDetails(userInfo);
      await fetchAndSetUserAttributes();
    } catch {
      setIsUserSignedIn(false);
      setUserDetails(null);
    }
  }, []);
  
  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  const signIn = async ({ username, password }: SignInInput) => {
    try {
      const user = await amplifySignIn({ username, password });
      console.log('Sign-in successful', user);
      const fetchedAttributes = await fetchUserAttributes();
      const isEmailVerified = fetchedAttributes.email_verified === 'true';
  
      if (!isEmailVerified) {
        throw new Error('Please verify your email to continue.');
      }
  
      setIsUserSignedIn(true);
      setUserDetails(fetchedAttributes);
      checkAuthStatus()
    } catch (error) {
      console.error('Error during sign in or fetching user attributes:', error);
      throw error; 
    }
  };
  
  const signUp = async ({
    username,
    password,
    preferred_username,
  }: SignUpParameters) => {
    try {
      await amplifySignUp({
        username,
        password,
        options: {
          userAttributes: {
            preferred_username
          },
          autoSignIn: { enabled: true }
        }
      });
    } catch (error) {
      console.error('Error signing up:', error);
      throw error;
    }
  };

  const confirmSignUp = async ({
    username,
    confirmationCode
  }: ConfirmSignUpInput) => {
    try {
      await amplifyConfirmSignUp({
        username,
        confirmationCode
      });
    } catch (error) {
      console.error('Error confirming sign up:', error);
      throw error;
    }
  };

  const confirmEmail = async ({ username, confirmationCode }: ConfirmSignUpInput) => {
    try {
      await confirmSignUp({
        username,
        confirmationCode,
      });
      console.log("Email verification successful");
    } catch (error) {
      console.error("Error confirming sign up:", error);
      throw error; 
    }
  };
  
  const signOut = async () => {
    try {
      await amplifySignOut();
      setIsUserSignedIn(false);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const fetchAndSetUserAttributes = async () => {
    try {
      const fetchedAttributes = await fetchUserAttributes();
      setUserDetails((prevDetails: any) => ({
        ...prevDetails,
        ...fetchedAttributes,
      }));
    } catch (error) {
      console.error('Error fetching user attributes:', error);
    }
  };

  const resendVerificationCode = async (username: string) => {
    try {
      await resendSignUpCode({ username });
      console.log('Resend verification code successful');
    } catch (error) {
      console.error('Error resending verification code:', error);
      throw error;
    }
  };

  async function deleteUser() {
    try {
      await amplifyDeleteUser();
      await signOut();
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error; 
    }
  }

  const resetUserPassword = async (username: string) => {
    try {
      const output = await resetPassword({ username });
      // Handle the next steps based on the output if needed
      console.log(output);
    } catch (error) {
      console.error('Error resetting password:', error);
    }
  };

  const confirmUserPasswordReset = async (username: string, code: string, newPassword: string) => {
    try {
      await confirmResetPassword({ username, confirmationCode: code, newPassword });
      console.log('Password reset successfully.');
    } catch (error) {
      console.error('Error confirming password reset:', error);
    }
  };

  const updateUserPassword = async (oldPassword: string, newPassword: string) => {
    try {
      await updatePassword({ oldPassword, newPassword });
      console.log('Password updated successfully.');
    } catch (error) {
      console.error('Error updating password:', error);
    }
  };
  
  return (
    <AuthContext.Provider value={{ isUserSignedIn, signIn, userDetails, signUp, confirmSignUp, confirmEmail, signOut, checkAuthStatus, resendVerificationCode, deleteUser, resetUserPassword, confirmUserPasswordReset, updateUserPassword }}>
      {children}
    </AuthContext.Provider>
  );
};
