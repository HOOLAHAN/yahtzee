export const cleanVerificationCode = (value: string) => value.replace(/\D/g, '').slice(0, 6);
export const maskEmail = (value: string) => { const [name, domain] = value.trim().split('@'); return name && domain ? `${name[0]}${'•'.repeat(Math.min(4, Math.max(1, name.length - 1)))}@${domain}` : value; };
export const friendlyAuthError = (caught: unknown) => {
  if (!(caught instanceof Error)) return 'Something went wrong. Please try again.';
  if (caught.name === 'UsernameExistsException') return 'An account with this email already exists. Try signing in or resetting your password.';
  if (caught.name === 'CodeMismatchException') return 'That code is incorrect. Check the email and try again.';
  if (caught.name === 'ExpiredCodeException') return 'That code has expired. Request a new one below.';
  if (caught.name === 'LimitExceededException') return 'Too many attempts. Please wait a little while and try again.';
  if (caught.name === 'InvalidPasswordException') return 'Use a password with at least 8 characters.';
  if (caught.name === 'NotAuthorizedException') return 'The email or password is incorrect.';
  return caught.message || 'Something went wrong. Please try again.';
};
