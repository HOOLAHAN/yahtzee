// Leaderboard.tsx

import React, { useEffect, useState } from 'react';
import { fetchScores, ScoreItem, fetchUserScores } from '../functions/scoreboardUtils';
import { useAuth } from '../context/AuthContext'; 
import { useLeaderboardRefresh } from '../context/LeaderboardRefreshContext';

interface LeaderboardProps {
  showUserScores: boolean;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ showUserScores }) => {
  const [scores, setScores] = useState<ScoreItem[]>([]);
  const { userDetails } = useAuth();
  const { refreshLeaderboard } = useLeaderboardRefresh();

  useEffect(() => {
    const loadScores = async () => {
      try {
        let fetchedScores = [];
        if (showUserScores && userDetails) {
          fetchedScores = await fetchUserScores(userDetails.userId);
        } else {
          fetchedScores = await fetchScores();
        }
        setScores(fetchedScores);
      } catch (error) {
        console.error('Error fetching scores:', error);
      }
    };

    if (showUserScores && !userDetails) {
      console.error('User details not available for fetching user scores');
      return;
    }

    loadScores();
  }, [showUserScores, userDetails, refreshLeaderboard]);

  const heading = showUserScores ? 'My Scores' : 'High Scores';
  
  return (
    <div className="max-w-xl mx-auto">
      <h3 className="text-2xl font-bold text-center m-4">{heading}</h3>
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

