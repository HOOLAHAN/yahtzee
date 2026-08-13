import { useEffect, useMemo, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faDice, faFire, faLock, faMedal, faShareNodes, faStar, faTrophy, faXmark } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../context/AuthContext';
import { fetchAllDailyResults, fetchMyGameResults, GameResult } from '../../services/gameResults';
import { currentDailyStreak, localDateKey } from '../../lib/dailyChallenge';
import { hasSharedApp } from '../../lib/achievements';

const badges = [
  { name: 'First Roll', copy: 'Complete a solo game', icon: faDice, earned: (r: GameResult[], s: number) => r.some((x) => x.mode === 'SOLO') },
  { name: 'Getting Started', copy: 'Complete 5 solo games', icon: faMedal, earned: (r: GameResult[], s: number) => r.filter((x) => x.mode === 'SOLO').length >= 5 },
  { name: 'Regular Roller', copy: 'Complete 25 solo games', icon: faMedal, earned: (r: GameResult[], s: number) => r.filter((x) => x.mode === 'SOLO').length >= 25 },
  { name: 'Century Club', copy: 'Complete 100 solo games', icon: faTrophy, earned: (r: GameResult[], s: number) => r.filter((x) => x.mode === 'SOLO').length >= 100 },
  { name: 'Yahtzee!', copy: 'Score your first Yahtzee', icon: faStar, earned: (r: GameResult[], s: number) => r.some((x) => x.yahtzeeCount >= 1) },
  { name: 'Seeing Double', copy: 'Score 2 Yahtzees in one game', icon: faStar, earned: (r: GameResult[], s: number) => r.some((x) => x.yahtzeeCount >= 2) },
  { name: 'Two Hundred Club', copy: 'Score at least 200', icon: faMedal, earned: (r: GameResult[], s: number) => r.some((x) => x.score >= 200) },
  { name: 'High Roller', copy: 'Score at least 250', icon: faMedal, earned: (r: GameResult[], s: number) => r.some((x) => x.score >= 250) },
  { name: 'Elite Roller', copy: 'Score at least 300', icon: faTrophy, earned: (r: GameResult[], s: number) => r.some((x) => x.score >= 300) },
  { name: 'Bonus Hunter', copy: 'Earn the upper bonus', icon: faStar, earned: (r: GameResult[], s: number) => r.some((x) => x.earnedUpperBonus) },
  { name: 'Straight Shooter', copy: 'Score both straights in one game', icon: faCheckCircle, earned: (r: GameResult[], s: number) => r.some((x) => x.completedSmallStraight && x.completedLargeStraight) },
  { name: 'Clean Card', copy: 'Finish without a zero', icon: faCheckCircle, earned: (r: GameResult[], s: number) => r.some((x) => x.noZeroScores) },
  { name: 'Daily Debut', copy: 'Complete a Daily Challenge', icon: faFire, earned: (r: GameResult[], s: number) => r.some((x) => x.mode === 'DAILY') },
  { name: 'Spread the Word', copy: 'Share Yahtzee Hub with someone', icon: faShareNodes, earned: (_r: GameResult[], _s: number) => hasSharedApp() },
  { name: 'On a Roll', copy: 'Reach a 3-day streak', icon: faFire, earned: (r: GameResult[], s: number) => s >= 3 },
  { name: 'Full Week', copy: 'Reach a 7-day streak', icon: faFire, earned: (r: GameResult[], s: number) => s >= 7 },
  { name: 'Daily Devotion', copy: 'Reach a 30-day streak', icon: faTrophy, earned: (r: GameResult[], s: number) => s >= 30 },
];

interface DailyHistoryDay {
  key: string;
  weekday: string;
  date: string;
  result?: GameResult;
  rank?: number;
  playerCount?: number;
  today: boolean;
}

const recentDailyHistory = (
  playerResults: GameResult[],
  allDailyResults: GameResult[],
  todayKey: string,
  count = 14,
): DailyHistoryDay[] => {
  const playerByDate = new Map<string, GameResult>();
  playerResults
    .filter((result) => result.mode === 'DAILY' && result.challengeDate)
    .forEach((result) => playerByDate.set(result.challengeDate!, result));

  const leaderboardByDate = new Map<string, GameResult[]>();
  allDailyResults.forEach((result) => {
    if (!result.challengeDate) return;
    const board = leaderboardByDate.get(result.challengeDate) ?? [];
    board.push(result);
    leaderboardByDate.set(result.challengeDate, board);
  });

  const today = new Date(`${todayKey}T12:00:00`);
  return Array.from({ length: count }, (_, index) => {
    const value = new Date(today);
    value.setDate(today.getDate() - index);
    const key = localDateKey(value);
    const result = playerByDate.get(key);
    const board = [...(leaderboardByDate.get(key) ?? [])].sort(
      (a, b) => b.score - a.score || a.completedAt.localeCompare(b.completedAt),
    );
    const rank = result
      ? board.findIndex((entry) => entry.id === result.id || entry.userId === result.userId) + 1
      : 0;

    return {
      key,
      weekday: index === 0 ? 'Today' : value.toLocaleDateString(undefined, { weekday: 'short' }),
      date: value.toLocaleDateString(undefined, { day: 'numeric', month: 'short' }),
      result,
      rank: rank || undefined,
      playerCount: board.length || undefined,
      today: index === 0,
    };
  });
};

export default function Progress({ onClose, onCreateAccount, embedded = false }: { onClose?: () => void; onCreateAccount?: () => void; embedded?: boolean }) {
  const { isUserSignedIn, userDetails } = useAuth(); const [results, setResults] = useState<GameResult[]>([]); const [allDailyResults, setAllDailyResults] = useState<GameResult[]>([]); const [error, setError] = useState('');
  useEffect(() => {
    if (!userDetails?.userId) return;
    setError('');
    void Promise.all([fetchMyGameResults(userDetails.userId), fetchAllDailyResults(1000)])
      .then(([playerResults, dailyResults]) => { setResults(playerResults); setAllDailyResults(dailyResults); })
      .catch((caught) => setError(caught instanceof Error ? caught.message : 'Unable to load progress.'));
  }, [userDetails?.userId]);
  const todayKey = localDateKey();
  const streak = currentDailyStreak(results.filter((result) => result.challengeDate).map((result) => result.challengeDate!), todayKey);
  const dailyHistory = useMemo(() => recentDailyHistory(results, allDailyResults, todayKey), [results, allDailyResults, todayKey]);
  const unlocked = useMemo(() => badges.filter((badge) => badge.earned(results, streak)).length, [results, streak]);
  const best = results.reduce((score, result) => Math.max(score, result.score), 0); const average = results.length ? Math.round(results.reduce((sum, result) => sum + result.score, 0) / results.length) : 0;
  const solo = results.filter((result) => result.mode === 'SOLO'); const daily = results.filter((result) => result.mode === 'DAILY'); const totalYahtzees = results.reduce((sum, result) => sum + result.yahtzeeCount, 0);
  const recent = [...results].sort((a, b) => b.completedAt.localeCompare(a.completedAt)).slice(0, 10).reverse();
  const scorecards = results.map((result) => { try { return result.scorecard ? JSON.parse(result.scorecard) as Record<string, number> : null; } catch { return null; } }).filter(Boolean) as Record<string, number>[];
  const categoryStats = scorecards.length ? Object.keys(scorecards[0]).map((category) => { const scores = scorecards.map((card) => card[category] ?? 0); return { category, average: Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length), success: Math.round(scores.filter((score) => score > 0).length / scores.length * 100) }; }) : [];
  return <div className={embedded ? "site-page-content max-w-5xl" : "fixed inset-0 z-40 bg-black/75 backdrop-blur-sm"} onClick={embedded ? undefined : onClose}><aside className={embedded ? "" : "absolute right-0 top-0 h-full w-full max-w-xl overflow-y-auto border-l border-neonCyan bg-deepBlack p-5 sm:p-7"} onClick={(event) => event.stopPropagation()}><div className="flex items-start justify-between"><div><p className="eyebrow">Player journey</p><h2 className="section-heading">Progress</h2></div>{onClose && <button onClick={onClose} aria-label="Close progress" className="text-3xl text-neonCyan"><FontAwesomeIcon icon={faXmark} /></button>}</div>
    {!isUserSignedIn && <button type="button" onClick={onCreateAccount} className="mt-6 w-full rounded-xl bg-neonCyan px-5 py-3 font-black text-deepBlack transition hover:bg-neonYellow">Create player profile</button>}
    {!isUserSignedIn ? <div className="web-panel mt-6 p-6 text-center text-mintGlow">Sign in to sync streaks, statistics and achievements across devices.</div> : <><section className="daily-history"><div className="daily-history-summary"><div className="daily-history-icon"><FontAwesomeIcon icon={faFire} /></div><div><small>Current Daily streak</small><strong>{streak} <span>{streak === 1 ? 'day' : 'days'}</span></strong></div><p>Recent Daily Challenge activity</p></div><div className="daily-history-scroll"><div className="daily-history-days">{dailyHistory.map((day) => <article key={day.key} className={`daily-history-day ${day.today ? 'daily-history-today' : ''} ${day.result ? 'daily-history-complete' : ''}`}><div className="daily-history-date"><small>{day.weekday}</small><span>{day.date}</span>{day.result && <FontAwesomeIcon icon={faCheckCircle} />}</div>{day.result ? <><strong>{day.result.score}</strong><p>{day.rank && day.playerCount ? `#${day.rank} of ${day.playerCount}` : 'Completed'}</p></> : <><strong className="daily-history-missed">{day.today ? 'Not played' : 'Missed'}</strong><p>—</p></>}</article>)}</div></div><small className="daily-history-note">Today’s position may change as more players finish.</small></section><div className="progress-stats"><div><strong>{results.length}</strong><small>Games</small></div><div><strong>{best}</strong><small>Best</small></div><div><strong>{average}</strong><small>Average</small></div></div><div className="progress-heading"><h3>Your stats</h3><span>All games</span></div><div className="grid grid-cols-2 gap-2"><div className="web-panel p-3"><strong className="block text-2xl text-neonCyan">{totalYahtzees}</strong><small className="text-gray-500">Total Yahtzees</small></div><div className="web-panel p-3"><strong className="block text-2xl text-neonCyan">{results.filter((result) => result.earnedUpperBonus).length}</strong><small className="text-gray-500">Upper bonuses</small></div><div className="web-panel p-3"><strong className="block text-xl text-neonYellow">{solo.length ? Math.round(solo.reduce((sum, result) => sum + result.score, 0) / solo.length) : 0} avg</strong><small className="text-gray-500">Solo · {solo.length} games</small></div><div className="web-panel p-3"><strong className="block text-xl text-neonYellow">{daily.length ? Math.round(daily.reduce((sum, result) => sum + result.score, 0) / daily.length) : 0} avg</strong><small className="text-gray-500">Daily · {daily.length} games</small></div></div>{recent.length > 1 && <><div className="progress-heading"><h3>Recent scores</h3><span>Last {recent.length}</span></div><div className="flex h-28 items-end gap-1 rounded-xl bg-[#11191b] p-3">{recent.map((result) => <div key={result.id} title={String(result.score)} className="flex-1 rounded-t bg-neonCyan" style={{ height: `${Math.max(8, result.score / Math.max(best, 1) * 100)}%` }} />)}</div></>}<div className="progress-heading"><h3>Categories</h3><span>{scorecards.length} detailed</span></div>{categoryStats.length ? <div className="rounded-xl bg-[#11191b] px-3">{categoryStats.map((item) => <div key={item.category} className="flex items-center border-b border-slate-800 py-2 text-xs"><strong className="flex-1 text-mintGlow">{item.category}</strong><span className="mr-3 text-gray-500">{item.success}% scored</span><b className="text-neonCyan">{item.average} avg</b></div>)}</div> : <p className="web-panel p-4 text-xs leading-5 text-gray-500">Category analytics will appear after you complete a game with the new detailed scorecard.</p>}<div className="progress-heading"><h3>Achievements</h3><span>{unlocked}/{badges.length}</span></div>{error && <p className="text-red-400">{error}</p>}<div className="progress-badges">{badges.map((badge) => { const earned = badge.earned(results, streak); return <div key={badge.name} className={`progress-badge ${earned ? 'progress-badge-earned' : ''}`}><i><FontAwesomeIcon icon={earned ? badge.icon : faLock} /></i><div><strong>{badge.name}</strong><small>{badge.copy}</small></div>{earned && <FontAwesomeIcon icon={faCheckCircle} />}</div>; })}</div></>}
  </aside></div>;
}
