import React from 'react';
import DiceFace from './DiceFace';
import { FontAwesomeSize } from '../../lib/types';
import { DiceAnimation } from '../../lib/diceAnimation';

interface DiceDisplayProps {
  dice: number[];
  heldDice: Set<number>;
  toggleHoldDie: (index: number) => void;
  rollsLeft: number;
  hasRolled: boolean;
  shouldShake: boolean;
  dieSize: string;
  animation?: DiceAnimation;
}

const DiceDisplay: React.FC<DiceDisplayProps> = ({
  dice,
  heldDice,
  toggleHoldDie,
  rollsLeft,
  hasRolled,
  shouldShake,
  dieSize,
  animation,
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
          animation={animation}
          size={dieSize as FontAwesomeSize}
        />
      ))}
    </div>
  );
};

export default DiceDisplay;
