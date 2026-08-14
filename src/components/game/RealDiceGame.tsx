import { useEffect, useMemo, useRef, useState } from 'react';
import { Category, ScoreEntry } from '../../lib/types';
import { useAuth } from '../../context/AuthContext';
import { createGameResult, resultMetrics } from '../../services/gameResults';

const categories: Category[] = ['Ones', 'Twos', 'Threes', 'Fours', 'Fives', 'Sixes', 'ThreeOfAKind', 'FourOfAKind', 'FullHouse', 'SmallStraight', 'LargeStraight', 'Yahtzee', 'Chance'];
const labels: Record<Category, string> = { Ones: 'Ones', Twos: 'Twos', Threes: 'Threes', Fours: 'Fours', Fives: 'Fives', Sixes: 'Sixes', ThreeOfAKind: '3 of a Kind', FourOfAKind: '4 of a Kind', FullHouse: 'Full House', SmallStraight: 'Small Straight', LargeStraight: 'Large Straight', Yahtzee: 'Yahtzee', Chance: 'Chance' };
const accents = ['#08d9df', '#4df27d', '#ff2ac3', '#ffb020', '#a78bfa', '#ff6577', '#5ee7ff', '#f97316', '#84cc16', '#f472b6'];
const namesKey = 'yahtzee.real-dice.names';
const upper = new Set<Category>(['Ones', 'Twos', 'Threes', 'Fours', 'Fives', 'Sixes']);
const bonus = (entries: ScoreEntry[]) => entries.filter((entry) => upper.has(entry.category)).reduce((sum, entry) => sum + entry.roundScore, 0) >= 63 ? 35 : 0;
const total = (entries: ScoreEntry[]) => entries.reduce((sum, entry) => sum + entry.roundScore, 0) + bonus(entries);

interface PlayerState { name: string; scores: ScoreEntry[] }

export default function RealDiceGame() {
  const { isUserSignedIn } = useAuth();
  const sessionId = useRef(`real:${Date.now()}`);
  const recorded = useRef(false);
  const savedNames = useMemo(() => {
    try { return JSON.parse(localStorage.getItem(namesKey) || '[]') as string[]; } catch { return []; }
  }, []);
  const [setup, setSetup] = useState(true);
  const [playerCount, setPlayerCount] = useState(Math.min(10, Math.max(2, savedNames.length || 2)));
  const [names, setNames] = useState<string[]>(Array.from({ length: 10 }, (_, index) => savedNames[index] || `Player ${index + 1}`));
  const [players, setPlayers] = useState<PlayerState[]>([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<Category | null>(null);
  const [score, setScore] = useState('');

  useEffect(() => { localStorage.setItem(namesKey, JSON.stringify(names.slice(0, playerCount))); }, [names, playerCount]);
  const complete = players.length > 0 && players.every((player) => player.scores.length === categories.length);
  useEffect(() => {
    if (!complete || !isUserSignedIn || recorded.current) return;
    recorded.current = true;
    const metrics = resultMetrics(players[0].scores);
    void createGameResult({ id: sessionId.current, mode: 'REAL', modeDate: 'REAL#ALL', completedAt: new Date().toISOString(), ...metrics, yahtzeeOnFinalRoll: false,
      session: JSON.stringify({ players: players.map((player) => ({ name: player.name, score: total(player.scores), scorecard: Object.fromEntries(player.scores.map((entry) => [entry.category, entry.roundScore])) })) }),
    }).catch((error) => { recorded.current = false; console.error('[realDice.history]', error); });
  }, [complete, isUserSignedIn, players]);
  const start = () => { sessionId.current = `real:${Date.now()}`; recorded.current = false; setPlayers(names.slice(0, playerCount).map((name, index) => ({ name: name.trim() || `Player ${index + 1}`, scores: [] }))); setCurrent(0); setSelected(null); setScore(''); setSetup(false); };
  const lock = () => {
    if (!selected || score === '') return;
    const points = Math.max(0, Math.min(100, Number(score) || 0));
    setPlayers((existing) => existing.map((player, index) => index === current ? { ...player, scores: [...player.scores, { category: selected, roundScore: points, dice: [] }] } : player));
    setSelected(null); setScore(''); setCurrent((value) => (value + 1) % players.length);
  };
  if (setup) return <section className="web-panel real-dice-setup mx-auto max-w-3xl p-5 md:p-8"><p className="eyebrow">Real dice scorekeeper</p><h2 className="section-heading">Who is playing?</h2><p className="section-copy">Use physical dice and let the website manage every turn and scorecard. Names are remembered on this device.</p><label className="field-label">Number of players</label><div className="grid grid-cols-5 gap-2 mb-6">{[2,3,4,5,6,7,8,9,10].map((count) => <button key={count} onClick={() => setPlayerCount(count)} className={`mode-chip ${playerCount === count ? 'mode-chip-active' : ''}`}>{count}</button>)}</div><div className="grid sm:grid-cols-2 gap-3">{names.slice(0, playerCount).map((name, index) => <label key={index} className="field-label"><span style={{ color: accents[index] }}>Player {index + 1}</span><input value={name} onChange={(event) => setNames((values) => values.map((value, nameIndex) => nameIndex === index ? event.target.value : value))} className="web-input mt-2" /></label>)}</div><button onClick={start} className="primary-action mt-6 w-full">Start scorekeeper</button></section>;

  const active = players[current];
  const used = new Set(active.scores.map((entry) => entry.category));
  return <section className="mx-auto max-w-6xl px-4 py-6"><div className="flex flex-wrap items-end justify-between gap-4 mb-6"><div><p className="eyebrow">Turn {active.scores.length + 1} of 13</p><h2 className="section-heading" style={{ color: accents[current] }}>{active.name}'s turn</h2><p className="section-copy">Choose a category, enter the score shown by your real dice, then lock it in.</p></div><button className="quiet-action" onClick={() => setSetup(true)}>New table</button></div><div className="overflow-x-auto web-panel"><table className="score-table"><thead><tr><th>Category</th>{players.map((player, index) => <th key={player.name} style={{ color: accents[index] }}>{player.name}<small>{total(player.scores)}</small></th>)}</tr></thead><tbody>{categories.map((category) => <tr key={category}><td>{labels[category]}</td>{players.map((player, index) => <td key={index}>{player.scores.find((entry) => entry.category === category)?.roundScore ?? '—'}</td>)}</tr>)}<tr><td>Upper bonus</td>{players.map((player, index) => <td key={index}>{bonus(player.scores) || '—'}</td>)}</tr></tbody></table></div><div className="web-panel mt-5 p-5"><h3 className="text-neonYellow font-black text-xl mb-4">Enter {active.name}'s score</h3><div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">{categories.filter((category) => !used.has(category)).map((category) => <button key={category} onClick={() => setSelected(category)} className={`category-choice ${selected === category ? 'category-choice-selected' : ''}`}>{labels[category]}</button>)}</div>{selected && <div className="flex flex-col sm:flex-row gap-3 mt-5"><label className="field-label flex-1">Score for {labels[selected]}<input autoFocus inputMode="numeric" value={score} onChange={(event) => setScore(event.target.value.replace(/\D/g, ''))} onKeyDown={(event) => event.key === 'Enter' && lock()} className="web-input mt-2" /></label><button disabled={score === ''} onClick={lock} className="primary-action sm:self-end disabled:opacity-40">Lock in score</button></div>}</div></section>;
}
