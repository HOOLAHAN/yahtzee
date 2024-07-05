// RollDiceButton.tsx

interface RollDiceButtonProps {
  rollsLeft: number;
  usedCategoriesSize: number;
  onRollDice: () => void;
}

const RollDiceButton: React.FC<RollDiceButtonProps> = ({ rollsLeft, usedCategoriesSize, onRollDice }) => (
  <button
    className={`w-full md:w-auto py-2 px-4 text-white rounded mb-2 mr-2 focus:ring focus:ring-blue-200 ${rollsLeft > 0 && usedCategoriesSize < 13 ? 'transition duration-300 ease-in-out transform hover:scale-105 bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'}`}
    onClick={onRollDice}
    disabled={rollsLeft <= 0 || usedCategoriesSize === 13}
  >
    Roll Dice (Rolls left: {rollsLeft})
  </button>
);

export default RollDiceButton;
