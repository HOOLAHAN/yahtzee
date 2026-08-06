import { useEffect, useMemo, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faDice, faFire, faLock, faMedal, faStar, faTrophy, faXmark } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../context/AuthContext';
import { fetchMyGameResults, GameResult } from '../../services/gameResults';
import { currentDailyStreak, localDateKey } from '../../lib/dailyChallenge';

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
  { name: 'On a Roll', copy: 'Reach a 3-day streak', icon: faFire, earned: (r: GameResult[], s: number) => s >= 3 },
  { name: 'Full Week', copy: 'Reach a 7-day streak', icon: faFire, earned: (r: GameResult[], s: number) => s >= 7 },
  { name: 'Daily Devotion', copy: 'Reach a 30-day streak', icon: faTrophy, earned: (r: GameResult[], s: number) => s >= 30 },
];

export default function Progress({ onClose }: { onClose: () => void }) {
  const { isUserSignedIn, userDetails } = useAuth(); const [results, setResults] = useState<GameResult[]>([]); const [error, setError] = useState('');
  useEffect(() => { if (!userDetails?.userId) return; void fetchMyGameResults(userDetails.userId).then(setResults).catch((caught) => setError(caught instanceof Error ? caught.message : 'Unable to load progress.')); }, [userDetails?.userId]);
  const streak = currentDailyStreak(results.filter((result) => result.challengeDate).map((result) => result.challengeDate!), localDateKey());
  const unlocked = useMemo(() => badges.filter((badge) => badge.earned(results, streak)).length, [results, streak]);
  const best = results.reduce((score, result) => Math.max(score, result.score), 0); const average = results.length ? Math.round(results.reduce((sum, result) => sum + result.score, 0) / results.length) : 0;
  return <div className="fixed inset-0 z-40 bg-black/75 backdrop-blur-sm" onClick={onClose}><aside className="absolute right-0 top-0 h-full w-full max-w-xl overflow-y-auto border-l border-neonCyan bg-deepBlack p-5 sm:p-7" onClick={(event) => event.stopPropagation()}><div className="flex items-start justify-between"><div><p className="eyebrow">Player journey</p><h2 className="section-heading">Progress</h2></div><button onClick={onClose} aria-label="Close progress" className="text-3xl text-neonCyan"><FontAwesomeIcon icon={faXmark} /></button></div>
    {!isUserSignedIn ? <div className="web-panel mt-6 p-6 text-center text-mintGlow">Sign in to sync streaks, statistics and achievements across devices.</div> : <><div className="progress-hero"><div><small>Current Daily streak</small><strong>{streak} <span>{streak === 1 ? 'day' : 'days'}</span></strong></div><FontAwesomeIcon icon={faFire} /></div><div className="progress-stats"><div><strong>{results.length}</strong><small>Games</small></div><div><strong>{best}</strong><small>Best</small></div><div><strong>{average}</strong><small>Average</small></div></div><div className="progress-heading"><h3>Achievements</h3><span>{unlocked}/{badges.length}</span></div>{error && <p className="text-red-400">{error}</p>}<div className="progress-badges">{badges.map((badge) => { const earned = badge.earned(results, streak); return <div key={badge.name} className={`progress-badge ${earned ? 'progress-badge-earned' : ''}`}><i><FontAwesomeIcon icon={earned ? badge.icon : faLock} /></i><div><strong>{badge.name}</strong><small>{badge.copy}</small></div>{earned && <FontAwesomeIcon icon={faCheckCircle} />}</div>; })}</div></>}
  </aside></div>;
}
