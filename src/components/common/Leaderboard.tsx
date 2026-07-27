// Leaderboard.tsx

import React, { useEffect, useState } from 'react';
import { fetchScores, ScoreItem, fetchUserScores } from '../../lib/scoreboardUtils';
import { useAuth } from '../../context/AuthContext'; 
import { useLeaderboardRefresh } from '../../context/LeaderboardRefreshContext';

interface LeaderboardProps {
  showUserScores: boolean;
  hideHeading?: boolean;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ showUserScores, hideHeading = false }) => {
  const [scores, setScores] = useState<ScoreItem[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const { userDetails } = useAuth();
  const { refreshLeaderboard } = useLeaderboardRefresh();

  useEffect(() => {
    const loadScores = async () => {
      try {
        setErrorMessage('');
        let fetchedScores = [];
        if (showUserScores && userDetails) {
          fetchedScores = await fetchUserScores(userDetails.userId);
        } else {
          fetchedScores = await fetchScores();
        }
        setScores(fetchedScores);
      } catch (error) {
        console.error('Error fetching scores:', error);
        setScores([]);
        setErrorMessage(error instanceof Error ? error.message : 'Failed to load leaderboard.');
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
    <div className={hideHeading ? '' : 'max-w-xl mx-auto p-6 bg-deepBlack rounded-2xl shadow-xl border-4 border-neonCyan'}>
      {!hideHeading && <h3 className="text-3xl font-bold text-center mb-6 text-neonYellow animate-pulse-glow drop-shadow-[0_0_10px_#faff00]">
        {heading}
      </h3>}
      {scores.length ? (
        <ul className="space-y-4">
          {scores.map((score, index) => (
            <li
              key={score.id}
              className="flex items-center justify-between rounded-xl border border-[#2d3c40] bg-[#11191b] px-4 py-4 shadow-md transition hover:border-neonCyan hover:bg-[#162225]"
            >
              <div className="text-neonCyan font-semibold text-lg">
                {index + 1}. {score.username}
              </div>
              <div>
                <span className="bg-neonYellow text-deepBlack font-bold px-3 py-1 rounded-full text-sm shadow">
                  {score.score}
                </span>
              </div>
            </li>
          ))}
        </ul>
      ) : errorMessage ? (
        <p className="text-center text-red-400 mt-6">{errorMessage}</p>
      ) : (
        <p className="text-center text-gray-400 mt-6">No scores available.</p>
      )}
    </div>
  );
};

export default Leaderboard;
