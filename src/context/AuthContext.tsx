import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { getCurrentUser, signOut as amplifySignOut, signUp as amplifySignUp, confirmSignUp as amplifyConfirmSignUp, SignInInput, ConfirmSignUpInput } from 'aws-amplify/auth';
import { signIn as amplifySignIn } from 'aws-amplify/auth';
import { resendSignUpCode } from 'aws-amplify/auth';
import { fetchUserAttributes } from 'aws-amplify/auth';
import { deleteUser as amplifyDeleteUser} from 'aws-amplify/auth';

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
  const [isUserSignedIn, setIsUserSignedIn] = useState(true);
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
      setUserDetails(null); // Ensure userDetails is cleared if not signed in
    }
  }, []);
  
  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  const signIn = async ({ username, password }: SignInInput) => {
    try {
      const user = await amplifySignIn({ username, password });
      console.log('Sign-in successful', user);
      setIsUserSignedIn(true); // Mark user as signed in
      const userInfo = await getCurrentUser();
      setUserDetails(userInfo);
      await fetchAndSetUserAttributes();
    } catch (error) {
      console.error('Error signing in:', error);
      throw error; // Ensure this error is thrown for LoginForm to catch
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
  
  return (
    <AuthContext.Provider value={{ isUserSignedIn, signIn, userDetails, signUp, confirmSignUp, confirmEmail, signOut, checkAuthStatus, resendVerificationCode, deleteUser }}>
      {children}
    </AuthContext.Provider>
  );
};
