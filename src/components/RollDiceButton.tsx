// RollDiceButton.tsx

interface RollDiceButtonProps {
  rollsLeft: number;
  usedCategoriesSize: number;
  onRollDice: () => void;
}

const RollDiceButton: React.FC<RollDiceButtonProps> = ({ rollsLeft, usedCategoriesSize, onRollDice }) => (
  <button
    className="w-full md:w-auto transition duration-300 ease-in-out transform hover:scale-105 py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 focus:ring focus:ring-blue-200 mb-2 mr-2"
    onClick={onRollDice}
    disabled={rollsLeft <= 0 || usedCategoriesSize === 13}
  >
    Roll Dice (Rolls left: {rollsLeft})
  </button>
);

export default RollDiceButton;