import { validateSignUpForm, SignUpFormInputs } from '../lib/validationUtils';

describe('validateSignUpForm', () => {
  it('should return an error for an empty email', () => {
    const inputs: SignUpFormInputs = {
      username: '',
      preferred_username: 'testUser',
      password: 'password123',
      given_name: 'Test', family_name: 'User',
    };
    const expectedErrors = {
      email: 'Email is required.',
    };
    expect(validateSignUpForm(inputs)).toEqual(expectedErrors);
  });

  it('should return an error for an invalid email format', () => {
    const inputs: SignUpFormInputs = {
      username: 'invalidemail',
      preferred_username: 'testUser',
      password: 'password123',
      given_name: 'Test', family_name: 'User',
    };
    const expectedErrors = {
      email: 'Email is invalid.',
    };
    expect(validateSignUpForm(inputs)).toEqual(expectedErrors);
  });

  it('should return an error for a preferred_username longer than 20 characters', () => {
    const inputs: SignUpFormInputs = {
      username: 'test@test.com',
      preferred_username: 'verylongusernamebeyondlimit',
      password: 'password123',
      given_name: 'Test', family_name: 'User',
    };
    const expectedErrors = {
      preferred_username: 'Use 3–20 letters, numbers, or underscores.',
    };
    expect(validateSignUpForm(inputs)).toEqual(expectedErrors);
  });

  it('should return an error for a preferred_username shorter than 3 characters', () => {
    const inputs: SignUpFormInputs = {
      username: 'test@test.com',
      preferred_username: 'ab',
      password: 'password123',
      given_name: 'Test', family_name: 'User',
    };
    const expectedErrors = {
      preferred_username: 'Use 3–20 letters, numbers, or underscores.',
    };
    expect(validateSignUpForm(inputs)).toEqual(expectedErrors);
  });

  it('should return an error for an empty password', () => {
    const inputs: SignUpFormInputs = {
      username: 'test@test.com',
      preferred_username: 'testUser',
      password: '',
      given_name: 'Test', family_name: 'User',
    };
    const expectedErrors = {
      password: 'Password is required.',
    };
    expect(validateSignUpForm(inputs)).toEqual(expectedErrors);
  });

  it('should return an error for a password shorter than 8 characters', () => {
    const inputs: SignUpFormInputs = {
      username: 'test@test.com',
      preferred_username: 'testUser',
      password: 'short',
      given_name: 'Test', family_name: 'User',
    };
    const expectedErrors = {
      password: 'Password must be at least 8 characters.',
    };
    expect(validateSignUpForm(inputs)).toEqual(expectedErrors);
  });

  it('should not return any errors for valid input', () => {
    const inputs: SignUpFormInputs = {
      username: 'test@test.com',
      preferred_username: 'testUser',
      password: 'password123',
      given_name: 'Test', family_name: 'User',
    };
    expect(validateSignUpForm(inputs)).toEqual({});
  });
});
