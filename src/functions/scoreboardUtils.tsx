// scoreboardUtils.tsx

import { generateClient } from 'aws-amplify/api';
import config from '../amplifyconfiguration.json';
import { listScores } from '../graphql/queries';
import { Amplify } from 'aws-amplify';

Amplify.configure(config);
const client = generateClient();

export interface ScoreItem {
  id: string;
  username: string;
  score: number;
}

export const fetchScores = async (): Promise<ScoreItem[]> => {
  try {
    const result = await client.graphql({
      query: listScores,
    });
    if ('data' in result && result.data && result.data.listScores && result.data.listScores.items) {
      const sortedScores: ScoreItem[] = result.data.listScores.items
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
