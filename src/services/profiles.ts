import { client } from '../lib/amplifyClient';
import { fetchAuthSession } from 'aws-amplify/auth';

export interface UserProfile {
  userId: string;
  username: string;
  firstName: string;
  lastName: string;
}

function profileErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error) return error.message;
  if (typeof error === 'object' && error !== null) {
    const response = error as { errors?: Array<{ message?: string }>; message?: string };
    const message = response.errors?.map((item) => item.message).filter(Boolean).join('\n') || response.message;
    if (message?.toLowerCase().includes('username is already taken')) return 'That username is already taken.';
    if (message) return message;
  }
  return fallback;
}

const USERNAME_AVAILABLE = /* GraphQL */ `
  query UsernameAvailable($username: String!) {
    usernameAvailable(username: $username)
  }
`;

const UPDATE_MY_PROFILE = /* GraphQL */ `
  mutation UpdateMyProfile($username: String!, $firstName: String!, $lastName: String!) {
    updateMyProfile(username: $username, firstName: $firstName, lastName: $lastName) {
      userId
      username
      firstName
      lastName
    }
  }
`;

const DELETE_MY_PROFILE = /* GraphQL */ `
  mutation DeleteMyProfile {
    deleteMyProfile
  }
`;

export async function isUsernameAvailable(username: string): Promise<boolean> {
  const result = await (client as any).graphql({
    query: USERNAME_AVAILABLE,
    variables: { username },
    authMode: 'apiKey',
  });
  return Boolean(result.data?.usernameAvailable);
}

export async function updateMyProfile(
  username: string,
  firstName: string,
  lastName: string,
): Promise<UserProfile> {
  try {
    // Match the mobile client: explicitly pass the current ID token, while
    // avoiding a second forced refresh after a successful profile mutation.
    const session = await fetchAuthSession();
    const authToken = session.tokens?.idToken?.toString();
    if (!authToken) throw new Error('Sign in required.');
    const result = await (client as any).graphql({
      query: UPDATE_MY_PROFILE,
      variables: { username: username.trim(), firstName: firstName.trim(), lastName: lastName.trim() },
      authMode: 'userPool',
      authToken,
    });
    if (!result.data?.updateMyProfile) {
      throw result.errors?.length ? result : new Error('Profile update failed.');
    }
    return result.data.updateMyProfile;
  } catch (error) {
    throw new Error(profileErrorMessage(error, 'Could not update profile. Please try again.'));
  }
}

export async function deleteMyProfile(): Promise<void> {
  await (client as any).graphql({ query: DELETE_MY_PROFILE, authMode: 'userPool' });
}
