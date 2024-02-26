import { createContext, useContext, useState, ReactNode } from 'react';
import { getCurrentUser, signOut as amplifySignOut, signUp as amplifySignUp, confirmSignUp as amplifyConfirmSignUp, SignInInput, ConfirmSignUpInput } from 'aws-amplify/auth';
import { signIn as amplifySignIn } from 'aws-amplify/auth';


type SignUpParameters = {
  username: string;
  password: string;
  preferred_username: string
};

interface AuthContextType {
  isUserSignedIn: boolean;
  signIn: (signInInput: SignInInput) => Promise<void>;
  signUp: (signUpParameters: SignUpParameters) => Promise<void>;
  confirmSignUp: (confirmSignUpInput: ConfirmSignUpInput) => Promise<void>;
  confirmEmail: ({ username, confirmationCode }: ConfirmSignUpInput) => Promise<void>;
  signOut: () => Promise<void>;
  checkAuthStatus: () => Promise<void>;
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

  const checkAuthStatus = async () => {
    try {
      await getCurrentUser();
      setIsUserSignedIn(true);
    } catch {
      setIsUserSignedIn(false);
    }
  };
  
  const signIn = async ({ username, password }: SignInInput) => {
    try {
      await amplifySignIn({ username, password });
      setIsUserSignedIn(true); // Successful sign-in
    } catch (error) {
      if (error === "UserAlreadyAuthenticatedException") {
        setIsUserSignedIn(true); // User is already signed in
      } else {
        console.error('Error signing in:', error);
      }
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

  return (
    <AuthContext.Provider value={{ isUserSignedIn, signIn, signUp, confirmSignUp, confirmEmail, signOut, checkAuthStatus }}>
      {children}
    </AuthContext.Provider>
  );
};
