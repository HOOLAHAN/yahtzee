import { client } from '../lib/amplifyClient';
import { fetchAuthSession } from 'aws-amplify/auth';

export interface UserProfile {
  userId: string;
  username: string;
  firstName: string;
  lastName: string;
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
  // Immediately after sign-in, Amplify's API client can briefly resolve auth
  // before its implicit token provider has caught up. Supplying the freshly
  // fetched ID token removes that race on the first authenticated request.
  const session = await fetchAuthSession({ forceRefresh: true });
  const authToken = session.tokens?.idToken?.toString();
  if (!authToken) throw new Error('Sign in required.');
  const result = await (client as any).graphql({
    query: UPDATE_MY_PROFILE,
    variables: { username, firstName, lastName },
    authMode: 'userPool',
    authToken,
  });
  if (!result.data?.updateMyProfile) throw new Error('Profile update failed.');
  // The profile service also updates Cognito attributes. Refresh the ID token so
  // authenticated score submissions immediately carry the new username.
  await fetchAuthSession({ forceRefresh: true });
  return result.data.updateMyProfile;
}

export async function deleteMyProfile(): Promise<void> {
  await (client as any).graphql({ query: DELETE_MY_PROFILE, authMode: 'userPool' });
}
