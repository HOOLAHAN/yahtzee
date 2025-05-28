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
    <div className="bg-deepBlack text-mintGlow p-4 rounded-lg shadow-md">
      <DiceDisplay
        dice={dice}
        heldDice={heldDice}
        toggleHoldDie={toggleHoldDie}
        rollsLeft={rollsLeft}
        hasRolled={hasRolled}
        shouldShake={shouldShake}
        dieSize={dieSize}
      />
      <h2 className="text-electricPink text-center mb-2 font-semibold text-sm uppercase">Tap to Hold Dice</h2>
      <div className="flex justify-center space-x-2">
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

