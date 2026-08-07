// validationUtils.tsx

export interface SignUpFormInputs {
  username: string;
  preferred_username: string;
  given_name: string;
  family_name: string;
  password: string;
  confirmPassword?: string;
}

export interface SignUpFormErrors {
  email?: string;
  preferred_username?: string;
  given_name?: string;
  family_name?: string;
  password?: string;
  confirmPassword?: string;
}

export const validateSignUpForm = (inputs: SignUpFormInputs): SignUpFormErrors => {
  let errors: SignUpFormErrors = {};

  if (!inputs.username) {
    errors.email = "Email is required.";
  } else if (!/\S+@\S+\.\S+/.test(inputs.username)) {
    errors.email = "Email is invalid.";
  }

  if (!/^[A-Za-z0-9_]{3,20}$/.test(inputs.preferred_username)) {
    errors.preferred_username = 'Use 3–20 letters, numbers, or underscores.';
  }

  if (!inputs.given_name.trim()) errors.given_name = 'First name is required.';
  if (!inputs.family_name.trim()) errors.family_name = 'Surname is required.';

  if (!inputs.password) {
    errors.password = "Password is required.";
  } else if (inputs.password.length < 8) {
    errors.password = "Password must be at least 8 characters.";
  }
  if (inputs.confirmPassword !== undefined && inputs.password !== inputs.confirmPassword) errors.confirmPassword = 'Passwords do not match.';

  return errors;
};
