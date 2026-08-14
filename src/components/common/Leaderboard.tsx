// Leaderboard.tsx

import React, { useCallback, useEffect, useState } from 'react';
import { fetchScores, ScoreItem, fetchUserScores } from '../../lib/scoreboardUtils';
import { useAuth } from '../../context/AuthContext'; 
import { useLeaderboardRefresh } from '../../context/LeaderboardRefreshContext';
import { fetchAllDailyResults, fetchDailyResults, fetchMyGameResults, fetchSoloResults, filterResultsByPeriod, GameResult, ResultMode, ResultPeriod } from '../../services/gameResults';
import { localDateKey } from '../../lib/dailyChallenge';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowsRotate, faEarthEurope, faUserCircle } from '@fortawesome/free-solid-svg-icons';

interface LeaderboardProps {
  showUserScores: boolean;
  hideHeading?: boolean;
  onShowUserScoresChange?: (showUserScores: boolean) => void;
  canShowUserScores?: boolean;
}
const scoreLabels: Record<string, string> = { Ones: 'Ones', Twos: 'Twos', Threes: 'Threes', Fours: 'Fours', Fives: 'Fives', Sixes: 'Sixes', ThreeOfAKind: '3 of a Kind', FourOfAKind: '4 of a Kind', FullHouse: 'Full House', SmallStraight: 'Small Straight', LargeStraight: 'Large Straight', Yahtzee: 'Yahtzee', Chance: 'Chance' };
const ScorecardBreakdown = ({ value }: { value?: string }) => { if (!value) return null; let card: Record<string, number>; try { card = JSON.parse(value); } catch { return null; } const upper = ['Ones', 'Twos', 'Threes', 'Fours', 'Fives', 'Sixes'].reduce((sum, key) => sum + (card[key] ?? 0), 0); return <div className="mt-3 rounded-xl bg-deepBlack p-4"><div className="mb-2 flex justify-between"><strong className="text-neonYellow">Full scorecard</strong><small className="text-gray-500">Upper {upper} · Bonus {upper >= 63 ? 35 : 0}</small></div><div className="max-h-64 overflow-y-auto">{Object.entries(card).map(([category, score]) => <div key={category} className="flex justify-between border-b border-gray-800 py-2 text-sm"><span className="text-mintGlow">{scoreLabels[category] ?? category}</span><strong className={score === 0 ? 'text-electricPink' : 'text-neonCyan'}>{score}</strong></div>)}</div></div>; };

const Leaderboard: React.FC<LeaderboardProps> = ({ showUserScores, hideHeading = false, onShowUserScoresChange, canShowUserScores = true }) => {
  type Competition = 'solo' | 'daily';
  type LeaderboardEntry = ScoreItem & Partial<GameResult> & { aggregate?: boolean };
  const [scores, setScores] = useState<LeaderboardEntry[]>([]);
  const [historyScores, setHistoryScores] = useState<LeaderboardEntry[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [period, setPeriod] = useState<ResultPeriod>('all');
  const [competition, setCompetition] = useState<Competition>('solo');
  const [historyMode, setHistoryMode] = useState<'ALL' | ResultMode>('ALL');
  const [historyDate, setHistoryDate] = useState<'all' | 'week' | 'month'>('all');
  const [selected, setSelected] = useState<LeaderboardEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const { userDetails } = useAuth();
  const { refreshLeaderboard } = useLeaderboardRefresh();

  const loadScores = useCallback(async () => {
      setLoading(true);
      try {
        setErrorMessage('');
        let fetchedScores: LeaderboardEntry[] = [];
        if (showUserScores && userDetails) {
          const [details, legacy] = await Promise.all([fetchMyGameResults(userDetails.userId), fetchUserScores(userDetails.userId)]);
          const indexedIds = new Set(details.map((result) => result.id));
          const history = [...details.map((result) => ({ ...result, timestamp: result.completedAt } as LeaderboardEntry)), ...legacy.filter((score) => !indexedIds.has(score.id)).map((score) => ({ ...score, mode: 'SOLO' as const } as LeaderboardEntry))];
          const datedHistory = filterResultsByPeriod(history, historyDate);
          setHistoryScores(datedHistory);
          fetchedScores = datedHistory.filter((result) => historyMode === 'ALL' || result.mode === historyMode).sort((a, b) => new Date(b.completedAt ?? b.timestamp).getTime() - new Date(a.completedAt ?? a.timestamp).getTime());
        } else if (competition === 'solo') {
          const [legacy, details] = await Promise.all([
            fetchScores(), fetchSoloResults(1000),
          ]);
          const indexed = details
            .filter((result) => result.mode === 'SOLO')
            .map((result) => ({ ...result, timestamp: result.completedAt } as LeaderboardEntry));
          const indexedIds = new Set(indexed.map((result) => result.id));
          fetchedScores = filterResultsByPeriod([...indexed, ...legacy.filter((score) => !indexedIds.has(score.id))], period)
            .sort((a, b) => b.score - a.score);
        } else {
          const daily = period === 'today' ? await fetchDailyResults(localDateKey()) : filterResultsByPeriod(await fetchAllDailyResults(1000), period);
          fetchedScores = [...daily].sort((a, b) => b.score - a.score);
        }
        setScores(fetchedScores.slice(0, 100));
        setLastUpdated(new Date());
      } catch (error) {
        console.error('Error fetching scores:', error);
        setScores([]);
        setErrorMessage(error instanceof Error ? error.message : 'Failed to load leaderboard.');
      } finally {
        setLoading(false);
      }
    }, [competition, historyDate, historyMode, period, showUserScores, userDetails]);

  useEffect(() => {
    if (showUserScores && !userDetails) {
      console.error('User details not available for fetching user scores');
      return;
    }

    void loadScores();
  }, [loadScores, refreshLeaderboard, showUserScores, userDetails]);

  useEffect(() => {
    const refreshWhenVisible = () => { if (document.visibilityState === 'visible') void loadScores(); };
    document.addEventListener('visibilitychange', refreshWhenVisible);
    return () => document.removeEventListener('visibilitychange', refreshWhenVisible);
  }, [loadScores]);

  const heading = showUserScores ? 'My Scores' : 'High Scores';
  
  return (
    <div className={hideHeading ? '' : 'max-w-xl mx-auto p-6 bg-deepBlack rounded-2xl shadow-xl border-4 border-neonCyan'}>
      {!hideHeading && <h3 className="text-3xl font-bold text-center mb-6 text-neonYellow animate-pulse-glow drop-shadow-[0_0_10px_#faff00]">
        {heading}
      </h3>}
      <p className="mb-4 text-sm text-gray-400">{showUserScores ? 'Every recorded game, with filters and per-mode performance.' : 'Competitive Solo and Daily Challenge rankings.'}</p>
      <section className="leaderboard-controls" aria-label="Leaderboard filters">
        <div className="leaderboard-selects">
          <label><span>GAME TYPE</span>{showUserScores ? <select value={historyMode} onChange={(event) => setHistoryMode(event.target.value as 'ALL' | ResultMode)}><option value="ALL">All games</option><option value="SOLO">Solo</option><option value="DAILY">Daily Challenge</option><option value="COMPUTER">Vs Computer</option><option value="PASS">Pass &amp; Play</option><option value="REAL">Real Dice</option></select> : <select value={competition} onChange={(event) => { const next = event.target.value as Competition; setCompetition(next); setPeriod(next === 'daily' ? 'today' : period === 'today' ? 'week' : period); }}><option value="solo">Solo</option><option value="daily">Daily Challenge</option></select>}</label>
          <label><span>TIME PERIOD</span>{showUserScores ? <select value={historyDate} onChange={(event) => setHistoryDate(event.target.value as 'all' | 'week' | 'month')}><option value="all">Any date</option><option value="week">This week</option><option value="month">This month</option></select> : <select value={period} onChange={(event) => setPeriod(event.target.value as ResultPeriod)}>{competition === 'daily' && <option value="today">Today</option>}<option value="week">This week</option><option value="month">This month</option><option value="all">All time</option></select>}</label>
        </div>
        {onShowUserScoresChange && <div className="leaderboard-audience"><span>SHOWING</span><div><button onClick={() => onShowUserScoresChange(false)} className={!showUserScores ? 'active' : ''}><FontAwesomeIcon icon={faEarthEurope} /> Global</button><button disabled={!canShowUserScores} onClick={() => onShowUserScoresChange(true)} className={showUserScores ? 'active' : ''}><FontAwesomeIcon icon={faUserCircle} /> Mine</button></div></div>}
      </section>
      {showUserScores && historyScores.length > 0 && <div className="mb-4 grid grid-cols-2 gap-3">{(['SOLO', 'DAILY', 'COMPUTER', 'PASS', 'REAL'] as ResultMode[]).map((mode) => { const games = historyScores.filter((score) => score.mode === mode); const owned = !['PASS', 'REAL'].includes(mode); const average = games.length ? Math.round(games.reduce((sum, game) => sum + game.score, 0) / games.length) : 0; return <div key={mode} className="rounded-xl bg-[#11191b] p-3"><small className="font-black text-gray-500">{mode === 'COMPUTER' ? 'VS COMPUTER' : mode === 'PASS' ? 'PASS & PLAY' : mode === 'REAL' ? 'REAL DICE' : mode}</small><strong className="mt-1 block text-neonCyan">{games.length} {games.length === 1 ? 'game' : 'games'}</strong><span className="text-xs text-mintGlow">{owned && games.length ? `Best ${Math.max(...games.map((game) => game.score))} · Avg ${average}` : games.length ? 'Shared session' : 'No records'}</span></div>; })}</div>}
      <div className="mb-4 flex items-center justify-end gap-3 text-xs text-gray-500">
        <span>{loading ? 'Updating…' : lastUpdated ? `Updated ${lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : 'Not updated yet'}</span>
        <button type="button" disabled={loading} onClick={() => void loadScores()} className="text-neonCyan disabled:opacity-40"><FontAwesomeIcon icon={faArrowsRotate} /> Refresh</button>
      </div>
      {scores.length ? (
        <ul className="space-y-4">
          {scores.map((score, index) => (
            <li
              key={score.id}
              onClick={() => setSelected(score)}
              className="flex cursor-pointer items-center justify-between rounded-xl border border-[#2d3c40] bg-[#11191b] px-4 py-4 shadow-md transition hover:border-neonCyan hover:bg-[#162225]"
            >
              <div><div className="text-lg font-semibold text-neonCyan">{showUserScores ? '' : `${index + 1}. `}{score.username}</div><div className="mt-1 text-[10px] font-bold uppercase tracking-wide text-gray-500">{score.mode === 'DAILY' ? 'Daily Challenge' : score.mode === 'COMPUTER' ? 'Vs Computer' : score.mode === 'PASS' ? 'Pass & Play' : score.mode === 'REAL' ? 'Real Dice' : 'Solo'}{(score.completedAt ?? score.timestamp) ? ` · ${new Date(score.completedAt ?? score.timestamp).toLocaleDateString()}` : ''}</div></div>
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
      {selected && <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/75 backdrop-blur-sm" onClick={() => setSelected(null)}><section role="dialog" aria-modal="true" aria-labelledby="score-detail-title" className="w-full max-w-xl rounded-t-3xl border border-neonCyan bg-[#11191b] p-6 shadow-2xl" onClick={(event) => event.stopPropagation()}><div className="flex items-start justify-between"><div><p className="eyebrow">{selected.aggregate ? 'Weekly Daily Challenge' : selected.mode === 'DAILY' ? 'Daily Challenge' : 'Solo game'}</p><h3 id="score-detail-title" className="text-2xl font-black text-white">{selected.username}</h3></div><button onClick={() => setSelected(null)} aria-label="Close score details" className="text-3xl text-neonCyan">&times;</button></div><div className="mt-3 text-6xl font-black text-neonYellow">{selected.score}</div>{selected.aggregate ? <p className="mt-4 text-sm text-mintGlow">Weekly score: the total of this player’s best five Daily Challenge results.</p> : selected.completedAt ? <><p className="mt-1 text-xs text-gray-500">{new Date(selected.completedAt).toLocaleString()}</p><div className="mt-5 grid grid-cols-3 gap-2"><div className="rounded-xl bg-deepBlack p-3 text-center"><strong className="block text-2xl text-neonCyan">{selected.yahtzeeCount ?? 0}</strong><small className="text-gray-500">Yahtzees</small></div><div className="rounded-xl bg-deepBlack p-3 text-center"><strong className="block text-2xl text-neonCyan">{selected.earnedUpperBonus ? '✓' : '—'}</strong><small className="text-gray-500">Upper bonus</small></div><div className="rounded-xl bg-deepBlack p-3 text-center"><strong className="block text-2xl text-neonCyan">{selected.noZeroScores ? '✓' : '—'}</strong><small className="text-gray-500">No zeroes</small></div></div><div className="mt-3 rounded-xl bg-deepBlack px-4 text-sm text-mintGlow"><p className="border-b border-gray-800 py-3">Small straight <span className="float-right">{selected.completedSmallStraight ? '✓' : '—'}</span></p><p className="border-b border-gray-800 py-3">Large straight <span className="float-right">{selected.completedLargeStraight ? '✓' : '—'}</span></p><p className="py-3">Both straights <span className="float-right">{selected.completedSmallStraight && selected.completedLargeStraight ? '✓' : '—'}</span></p></div><ScorecardBreakdown value={selected.scorecard} /></> : <p className="mt-4 text-sm leading-6 text-mintGlow">This is a historical leaderboard score. Detailed game statistics were not recorded for older entries.</p>}</section></div>}
    </div>
  );
};

export default Leaderboard;
