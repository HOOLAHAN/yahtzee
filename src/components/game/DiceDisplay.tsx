import React from 'react';
import Die from './Die';

interface DiceDisplayProps {
  dice: number[];
  heldDice: Set<number>;
  toggleHoldDie: (index: number) => void;
  rollsLeft: number;
  hasRolled: boolean;
  shouldShake: boolean;
  dieSize: string;
}

const DiceDisplay: React.FC<DiceDisplayProps> = ({ dice, heldDice, toggleHoldDie, rollsLeft, hasRolled, shouldShake, dieSize }) => {
  return (
    <div className="flex flex-wrap justify-center mb-4">
      {dice.map((die, index) => (
        <Die
          key={index}
          value={die}
          canHold={rollsLeft > 0 && hasRolled}
          isHeld={heldDice.has(index)}
          onToggleHold={() => toggleHoldDie(index)}
          className="m-2 md:m-4 lg:m-6"
          shake={shouldShake}
          size={dieSize as "xs" | "sm" | "lg" | "1x" | "2x" | "3x" | "4x" | "5x" | "6x" | "7x" | "8x" | "9x" | "10x"}
        />
      ))}
    </div>
  );
};

export default DiceDisplay;
