// DiceControl.tsx

import React from 'react';
import DiceDisplay from './DiceDisplay';
import RollDiceButton from './RollDiceButton';

interface DiceControlProps {
  dice: number[];
  heldDice: Set<number>;
  toggleHoldDie: (index: number) => void;
  rollsLeft: number;
  hasRolled: boolean;
  shouldShake: boolean;
  dieSize: string;
  usedCategoriesSize: number;
  onRollDice: () => void;
}

const DiceControl: React.FC<DiceControlProps> = ({
  dice,
  heldDice,
  toggleHoldDie,
  rollsLeft,
  hasRolled,
  shouldShake,
  dieSize,
  usedCategoriesSize,
  onRollDice,
}) => {
  return (
    <div className="web-dice-control">
      <DiceDisplay
        dice={dice}
        heldDice={heldDice}
        toggleHoldDie={toggleHoldDie}
        rollsLeft={rollsLeft}
        hasRolled={hasRolled}
        shouldShake={shouldShake}
        dieSize={dieSize}
      />
      <h2
        className={`web-roll-helper my-3 font-black text-xs uppercase tracking-widest transition-opacity duration-200 ${
          rollsLeft > 0 ? 'visible opacity-100' : 'invisible opacity-0'
        }`}
      >
        {usedCategoriesSize === 13
          ? "Game complete"
          : rollsLeft === 3
            ? usedCategoriesSize === 0
              ? "ROLL DICE TO BEGIN"
              : `Round ${usedCategoriesSize + 1} — ROLL DICE TO BEGIN`
            : "Toggle to Hold Dice"}
      </h2>
      <div>
        <RollDiceButton
          rollsLeft={rollsLeft}
          usedCategoriesSize={usedCategoriesSize}
          onRollDice={onRollDice}
        />
      </div>
    </div>
  );
};

export default DiceControl;
