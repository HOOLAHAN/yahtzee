import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDiceOne, faDiceTwo, faDiceThree, faDiceFour, faDiceFive, faDiceSix } from '@fortawesome/free-solid-svg-icons';

interface DieProps {
  value: number;
  canHold: boolean;
  onToggleHold: () => void;
  isHeld: boolean;
  className?: string;
}

const Die: React.FC<DieProps> = ({ value, canHold, onToggleHold, isHeld }) => {
  // Function to return the corresponding dice icon based on the die value
  const diceIcon = () => {
    switch (value) {
      case 1:
        return faDiceOne;
      case 2:
        return faDiceTwo;
      case 3:
        return faDiceThree;
      case 4:
        return faDiceFour;
      case 5:
        return faDiceFive;
      case 6:
        return faDiceSix;
      default:
        return faDiceOne;
    }
  };

  return (
    <div
      className={`transition-colors duration-300 ease-in-out flex items-center justify-center h-16 w-16 ${canHold ? 'cursor-pointer' : ''}`}
      onClick={canHold ? onToggleHold : undefined}
      role="button"
      aria-label={`${value}`}
    >
      <FontAwesomeIcon icon={diceIcon()} size="3x" style={{ color: isHeld ? "#22c65f" : "#888888" }} />
    </div>
  );
};

export default Die;
