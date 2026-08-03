import { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDice, faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import DiceFace from './DiceFace';

const MIN_DICE = 1;
const MAX_DICE = 10;

export default function VirtualDice() {
  const [diceCount, setDiceCount] = useState(1);
  const [dice, setDice] = useState<number[]>([1]);
  const [rolling, setRolling] = useState(false);
  const [rollSequence, setRollSequence] = useState(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  const changeCount = (change: number) => {
    const nextCount = Math.max(MIN_DICE, Math.min(MAX_DICE, diceCount + change));
    setDiceCount(nextCount);
    setDice((values) => Array.from({ length: nextCount }, (_, index) => values[index] ?? 1));
  };

  const roll = () => {
    if (timer.current) clearTimeout(timer.current);
    setDice(Array.from({ length: diceCount }, () => Math.floor(Math.random() * 6) + 1));
    setRollSequence((value) => value + 1);
    setRolling(true);
    timer.current = setTimeout(() => setRolling(false), 700);
  };

  return (
    <section className="virtual-dice-panel web-panel mx-auto max-w-4xl p-5 md:p-8">
      <p className="eyebrow">Virtual dice</p>
      <h2 className="section-heading">Roll anywhere</h2>
      <p className="section-copy">Choose how many dice you need, then tap roll. Use them for Yahtzee or any tabletop game.</p>
      <div className="virtual-dice-counter" aria-label="Number of dice">
        <button type="button" onClick={() => changeCount(-1)} disabled={diceCount === MIN_DICE} aria-label="Remove a die"><FontAwesomeIcon icon={faMinus} /></button>
        <div><strong>{diceCount}</strong><span>{diceCount === 1 ? 'die' : 'dice'}</span></div>
        <button type="button" onClick={() => changeCount(1)} disabled={diceCount === MAX_DICE} aria-label="Add a die"><FontAwesomeIcon icon={faPlus} /></button>
      </div>
      <div className="virtual-dice-tray" aria-live="polite">
        {dice.map((value, index) => <DiceFace key={`${rollSequence}-${index}`} value={value} canHold={false} onToggleHold={() => undefined} isHeld={false} shake={rolling} className="game-die" />)}
      </div>
      <button type="button" className="primary-action virtual-roll-action" onClick={roll}><FontAwesomeIcon icon={faDice} /> Roll {diceCount === 1 ? 'die' : `${diceCount} dice`}</button>
    </section>
  );
}
