// ScoresList.tsx

import React, { useEffect, useState } from 'react';
import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/api';
import config from '../amplifyconfiguration.json';
import { listScores } from '../graphql/queries';

Amplify.configure(config);
const client = generateClient();

interface ScoreItem {
  id: string;
  username: string;
  score: number;
}

const Leaderboard: React.FC = () => {
  const [scores, setScores] = useState<ScoreItem[]>([]);

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const result = await client.graphql({
          query: listScores
        });
        if ('data' in result && result.data && result.data.listScores && result.data.listScores.items) {
          const scoresList: ScoreItem[] = result.data.listScores.items;
          setScores(scoresList);
        } else {
          throw new Error('Failed to fetch scores.');
        }
      } catch (error) {
        console.error('Error fetching scores:', error);
      }
    };
    

    fetchScores();
  }, []);

  return (
    <div>
      <h3>High Scores</h3>
      {scores.length ? (
        <ul>
          {scores.map((score) => (
            <li key={score.id}>
              User: {score.username} - Score: {score.score}
            </li>
          ))}
        </ul>
      ) : (
        <p>No scores available.</p>
      )}
    </div>
  );
};

export default Leaderboard;
