// scoreboardUtils.tsx

import { listScores, listUserScores } from '../graphql/queries';
import { client } from './amplifyClient';

export interface ScoreItem {
  id: string;
  userId?: string;
  username: string;
  score: number;
  timestamp?: string;
  createdAt?: string;
  updatedAt?: string;
}

export const fetchScores = async (): Promise<ScoreItem[]> => {
  try {
    const result = await client.graphql({
      query: listScores,
      authMode: 'apiKey',
      variables: {
        limit: 100,
      },
    });
    if ('data' in result && result.data && result.data.listScores && result.data.listScores.items) {
      if ('errors' in result && result.errors?.length) {
        console.warn('Some leaderboard entries could not be loaded:', result.errors);
      }
      const sortedScores: ScoreItem[] = result.data.listScores.items
        .filter((item: ScoreItem | null) => Boolean(item))
        .sort((a: ScoreItem, b: ScoreItem) => b.score - a.score)
        .slice(0, 10);
      return sortedScores;
    } else {
      throw new Error('Failed to fetch scores.');
    }
  } catch (error) {
    console.error('Error fetching scores:', error);
    throw new Error('Error fetching scores');
  }
};

export const fetchUserScores = async (userId: string, limit: number = 10): Promise<ScoreItem[]> => {
  try {
    const result = await client.graphql({
      query: listUserScores,
      authMode: 'apiKey',
      variables: {
        userId: userId,
        limit: limit,
      },
    });
    if ('data' in result && result.data && result.data.listScores && result.data.listScores.items) {
      if ('errors' in result && result.errors?.length) {
        console.warn('Some user score entries could not be loaded:', result.errors);
      }
      const userScores: ScoreItem[] = result.data.listScores.items
        .filter((item: ScoreItem | null) => Boolean(item))
        .sort((a: ScoreItem, b: ScoreItem) => b.score - a.score);
      return userScores;
    } else {
      throw new Error('Failed to fetch user scores.');
    }
  } catch (error) {
    console.error('Error fetching user scores:', error);
    throw new Error('Error fetching user scores');
  }
};
