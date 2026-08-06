// Leaderboard.tsx

import React, { useEffect, useState } from 'react';
import { fetchScores, ScoreItem, fetchUserScores } from '../../lib/scoreboardUtils';
import { useAuth } from '../../context/AuthContext'; 
import { useLeaderboardRefresh } from '../../context/LeaderboardRefreshContext';
import { fetchAllDailyResults, fetchDailyResults, fetchSoloResults, fetchWeeklyResults, GameResult } from '../../services/gameResults';
import { localDateKey } from '../../lib/dailyChallenge';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEarthEurope, faSun, faUser, faUserCircle } from '@fortawesome/free-solid-svg-icons';

interface LeaderboardProps {
  showUserScores: boolean;
  hideHeading?: boolean;
  onShowUserScoresChange?: (showUserScores: boolean) => void;
  canShowUserScores?: boolean;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ showUserScores, hideHeading = false, onShowUserScoresChange, canShowUserScores = true }) => {
  type Competition = 'solo' | 'daily';
  type LeaderboardEntry = ScoreItem & Partial<GameResult> & { aggregate?: boolean };
  const [scores, setScores] = useState<LeaderboardEntry[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [period, setPeriod] = useState<'today' | 'week' | 'all'>('all');
  const [competition, setCompetition] = useState<Competition>('solo');
  const [selected, setSelected] = useState<LeaderboardEntry | null>(null);
  const { userDetails } = useAuth();
  const { refreshLeaderboard } = useLeaderboardRefresh();

  useEffect(() => {
    const loadScores = async () => {
      try {
        setErrorMessage('');
        let fetchedScores: LeaderboardEntry[] = [];
        if (competition === 'solo') {
          const [legacy, details] = await Promise.all([showUserScores && userDetails ? fetchUserScores(userDetails.userId) : fetchScores(), fetchSoloResults()]);
          const detailById = new Map(details.map((result) => [result.id, result]));
          fetchedScores = legacy.map((score) => ({ ...score, ...detailById.get(score.id) }));
        } else {
          fetchedScores = period === 'today' ? await fetchDailyResults(localDateKey()) : period === 'week' ? (await fetchWeeklyResults()).map((score) => ({ ...score, aggregate: true })) : await fetchAllDailyResults();
          if (showUserScores && userDetails) fetchedScores = fetchedScores.filter((score) => score.userId === userDetails.userId);
        }
        setScores(fetchedScores.slice(0, 100));
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
  }, [competition, period, showUserScores, userDetails, refreshLeaderboard]);

  const heading = showUserScores ? 'My Scores' : 'High Scores';
  
  return (
    <div className={hideHeading ? '' : 'max-w-xl mx-auto p-6 bg-deepBlack rounded-2xl shadow-xl border-4 border-neonCyan'}>
      {!hideHeading && <h3 className="text-3xl font-bold text-center mb-6 text-neonYellow animate-pulse-glow drop-shadow-[0_0_10px_#faff00]">
        {heading}
      </h3>}
      <p className="mb-4 text-sm text-gray-400">Solo scores and Daily Challenge results are ranked separately.</p>
      <section className="leaderboard-controls" aria-label="Leaderboard filters">
        <div className="leaderboard-competition"><button onClick={() => { setCompetition('solo'); setPeriod('all'); }} className={competition === 'solo' ? 'active' : ''}><span><FontAwesomeIcon icon={faUser} /></span><span><strong>Solo</strong><small>Classic games</small></span></button><button onClick={() => setCompetition('daily')} className={competition === 'daily' ? 'active' : ''}><span><FontAwesomeIcon icon={faSun} /></span><span><strong>Daily</strong><small>Same rolls</small></span></button></div>
        <div className="leaderboard-divider" />
        {competition === 'daily' && <div className="leaderboard-periods">{(['today', 'week', 'all'] as const).map((value) => <button key={value} onClick={() => setPeriod(value)} className={period === value ? 'active' : ''}>{value === 'today' ? 'Today' : value === 'week' ? 'Week' : 'All time'}</button>)}</div>}
        {onShowUserScoresChange && <div className="leaderboard-audience"><span>SHOWING</span><div><button onClick={() => onShowUserScoresChange(false)} className={!showUserScores ? 'active' : ''}><FontAwesomeIcon icon={faEarthEurope} /> Global</button><button disabled={!canShowUserScores} onClick={() => onShowUserScoresChange(true)} className={showUserScores ? 'active' : ''}><FontAwesomeIcon icon={faUserCircle} /> Mine</button></div></div>}
      </section>
      {scores.length ? (
        <ul className="space-y-4">
          {scores.map((score, index) => (
            <li
              key={score.id}
              onClick={() => setSelected(score)}
              className="flex cursor-pointer items-center justify-between rounded-xl border border-[#2d3c40] bg-[#11191b] px-4 py-4 shadow-md transition hover:border-neonCyan hover:bg-[#162225]"
            >
              <div><div className="text-lg font-semibold text-neonCyan">{index + 1}. {score.username}</div><div className="mt-1 text-[10px] font-bold uppercase tracking-wide text-gray-500">{competition === 'daily' ? score.aggregate ? 'Weekly total' : 'Daily Challenge' : 'Solo'}{score.completedAt ? ` · ${new Date(score.completedAt).toLocaleDateString()}` : ''}</div></div>
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
      {selected && <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/75 backdrop-blur-sm" onClick={() => setSelected(null)}><section role="dialog" aria-modal="true" aria-labelledby="score-detail-title" className="w-full max-w-xl rounded-t-3xl border border-neonCyan bg-[#11191b] p-6 shadow-2xl" onClick={(event) => event.stopPropagation()}><div className="flex items-start justify-between"><div><p className="eyebrow">{selected.aggregate ? 'Weekly Daily Challenge' : selected.mode === 'DAILY' ? 'Daily Challenge' : 'Solo game'}</p><h3 id="score-detail-title" className="text-2xl font-black text-white">{selected.username}</h3></div><button onClick={() => setSelected(null)} aria-label="Close score details" className="text-3xl text-neonCyan">&times;</button></div><div className="mt-3 text-6xl font-black text-neonYellow">{selected.score}</div>{selected.aggregate ? <p className="mt-4 text-sm text-mintGlow">Weekly score: the total of this player’s best five Daily Challenge results.</p> : selected.completedAt ? <><p className="mt-1 text-xs text-gray-500">{new Date(selected.completedAt).toLocaleString()}</p><div className="mt-5 grid grid-cols-3 gap-2"><div className="rounded-xl bg-deepBlack p-3 text-center"><strong className="block text-2xl text-neonCyan">{selected.yahtzeeCount ?? 0}</strong><small className="text-gray-500">Yahtzees</small></div><div className="rounded-xl bg-deepBlack p-3 text-center"><strong className="block text-2xl text-neonCyan">{selected.earnedUpperBonus ? '✓' : '—'}</strong><small className="text-gray-500">Upper bonus</small></div><div className="rounded-xl bg-deepBlack p-3 text-center"><strong className="block text-2xl text-neonCyan">{selected.noZeroScores ? '✓' : '—'}</strong><small className="text-gray-500">No zeroes</small></div></div><div className="mt-3 rounded-xl bg-deepBlack px-4 text-sm text-mintGlow"><p className="border-b border-gray-800 py-3">Small straight <span className="float-right">{selected.completedSmallStraight ? '✓' : '—'}</span></p><p className="border-b border-gray-800 py-3">Large straight <span className="float-right">{selected.completedLargeStraight ? '✓' : '—'}</span></p><p className="py-3">Yahtzee on final roll <span className="float-right">{selected.yahtzeeOnFinalRoll ? '✓' : '—'}</span></p></div></> : <p className="mt-4 text-sm leading-6 text-mintGlow">This is a historical leaderboard score. Detailed game statistics were not recorded for older entries.</p>}</section></div>}
    </div>
  );
};

export default Leaderboard;
