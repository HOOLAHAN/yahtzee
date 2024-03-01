// validationUtils.tsx

export interface SignUpFormInputs {
  username: string;
  preferred_username: string;
  password: string;
}

export interface SignUpFormErrors {
  email?: string;
  preferred_username?: string;
  password?: string;
}

export const validateSignUpForm = (inputs: SignUpFormInputs): SignUpFormErrors => {
  let errors: SignUpFormErrors = {};

  if (!inputs.username) {
    errors.email = "Email is required.";
  } else if (!/\S+@\S+\.\S+/.test(inputs.username)) {
    errors.email = "Email is invalid.";
  }

  if (inputs.preferred_username.length > 15) {
    errors.preferred_username = "Username must be 15 characters or less.";
  }

  if (inputs.preferred_username.length < 3) {
    errors.preferred_username = 'Username must be at least 3 characters';
  }

  if (!inputs.password) {
    errors.password = "Password is required.";
  } else if (inputs.password.length < 8) {
    errors.password = "Password must be at least 8 characters.";
  }

  return errors;
};
