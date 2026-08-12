import React from 'react';
import DiceFace from './DiceFace';
import { FontAwesomeSize } from '../../lib/types';

interface DiceDisplayProps {
  dice: number[];
  heldDice: Set<number>;
  toggleHoldDie: (index: number) => void;
  rollsLeft: number;
  hasRolled: boolean;
  shouldShake: boolean;
  dieSize: string;
}

const DiceDisplay: React.FC<DiceDisplayProps> = ({
  dice,
  heldDice,
  toggleHoldDie,
  rollsLeft,
  hasRolled,
  shouldShake,
  dieSize,
}) => {
  return (
    <div className="web-dice-row">
      {dice.map((die, index) => (
        <DiceFace
          key={index}
          value={die}
          canHold={rollsLeft > 0 && hasRolled}
          isHeld={heldDice.has(index)}
          onToggleHold={() => toggleHoldDie(index)}
          className="game-die"
          shake={shouldShake}
          rollIndex={index}
          size={dieSize as FontAwesomeSize}
        />
      ))}
    </div>
  );
};

export default DiceDisplay;
