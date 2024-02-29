// Leaderboard.tsx

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
          query: listScores,
        });
        if ('data' in result && result.data && result.data.listScores && result.data.listScores.items) {
          const sortedScores: ScoreItem[] = result.data.listScores.items
            .sort((a: ScoreItem, b: ScoreItem) => b.score - a.score)
            .slice(0, 10);
          setScores(sortedScores);
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
    <div className="max-w-xl mx-auto">
      <h3 className="text-2xl font-bold text-center m-4">High Scores</h3>
      {scores.length ? (
        <ul className="bg-white shadow overflow-hidden rounded-md">
          {scores.map((score, index) => (
            <li key={score.id} className={`px-4 py-4 sm:px-6 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium text-indigo-600 truncate">
                  {index + 1}. {score.username}
                </div>
                <div className="ml-2 flex-shrink-0 flex">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Score: {score.score}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-gray-500">No scores available.</p>
      )}
    </div>
  );
};

export default Leaderboard;

