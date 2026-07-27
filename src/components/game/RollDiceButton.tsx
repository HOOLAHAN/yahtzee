// RollDiceButton.tsx

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDice } from '@fortawesome/free-solid-svg-icons';

interface RollDiceButtonProps {
  rollsLeft: number;
  usedCategoriesSize: number;
  onRollDice: () => void;
}

const RollDiceButton: React.FC<RollDiceButtonProps> = ({
  rollsLeft,
  usedCategoriesSize,
  onRollDice,
}) => {
  const canRoll = rollsLeft > 0 && usedCategoriesSize < 13;

  return (
    <button
      data-testid="roll-dice-button"
      className={`web-roll-button ${
        canRoll
          ? `web-roll-button-active ${
              rollsLeft === 3 ? 'animate-glow-border' : ''
            }`
          : 'bg-gray-700 text-gray-400 cursor-not-allowed'
      }`}
      onClick={onRollDice}
      disabled={!canRoll}
    >
      <FontAwesomeIcon icon={faDice} /> {rollsLeft === 3 ? 'Roll Dice' : 'Roll Again'} <span>({rollsLeft} left)</span>
    </button>
  );
};

export default RollDiceButton;
