import { fetchAuthSession } from 'aws-amplify/auth';
import { submitScore } from '../graphql/mutations';
import { client } from '../lib/amplifyClient';

interface SavedScore {
  id: string;
  userId: string;
  score: number;
}

const getScore = /* GraphQL */ `
  query GetSubmittedScore($id: ID!) {
    getScore(id: $id) { id userId score }
  }
`;

const errorMessage = (error: unknown) => {
  if (error instanceof Error) return error.message;
  if (typeof error === 'object' && error !== null) {
    const candidate = error as { errors?: Array<{ message?: string }>; message?: string };
    return candidate.errors?.map((item) => item.message).filter(Boolean).join(', ') || candidate.message || JSON.stringify(error);
  }
  return String(error);
};

/**
 * Save one leaderboard entry per completed game. The game ID is stable, so a
 * retry can never create a second entry for the same scorecard.
 */
export async function saveLeaderboardScore(id: string, score: number, userId: string) {
  try {
    const session = await fetchAuthSession({ forceRefresh: true });
    if (!session.tokens?.idToken) throw new Error('Your sign-in session has expired.');
    const result = await client.graphql({
      query: submitScore,
      authMode: 'userPool',
      authToken: session.tokens.idToken.toString(),
      variables: { id, score },
    });
    if ('errors' in result && result.errors?.length) throw new Error(result.errors.map((item) => item.message).join(', '));
    if (!('data' in result) || !result.data.submitScore) throw new Error('The score API returned no saved score.');
    return result.data.submitScore as SavedScore;
  } catch (error) {
    // The write may have succeeded even if its response was interrupted. Read
    // the deterministic ID before retrying or presenting an error.
    try {
      const verification = await client.graphql({ query: getScore, authMode: 'apiKey', variables: { id } });
      const saved = 'data' in verification ? verification.data.getScore as SavedScore | null : null;
      if (saved?.userId === userId && saved.score === score) return saved;
    } catch (verificationError) {
      console.error('[scores.verify]', verificationError);
    }
    throw new Error(errorMessage(error) || 'Unable to save this score.');
  }
}
