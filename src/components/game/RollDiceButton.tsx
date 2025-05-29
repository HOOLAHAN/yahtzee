// RollDiceButton.tsx

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
      className={`w-full md:w-auto py-2 px-4 rounded-xl font-bold shadow-md transition duration-300 ease-in-out transform ${
        canRoll
          ? `bg-neonCyan text-deepBlack hover:bg-electricPink hover:text-white hover:scale-105 focus:ring focus:ring-electricPink ${
              rollsLeft === 3 ? 'animate-glow-border' : ''
            }`
          : 'bg-gray-700 text-gray-400 cursor-not-allowed'
      }`}
      onClick={onRollDice}
      disabled={!canRoll}
    >
      🎲 Roll Dice ({rollsLeft} left)
    </button>
  );
};

export default RollDiceButton;
