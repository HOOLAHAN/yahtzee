import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDiceOne, faDiceTwo, faDiceThree, faDiceFour, faDiceFive, faDiceSix } from '@fortawesome/free-solid-svg-icons';

interface DieProps {
  value: number;
  canHold: boolean;
  onToggleHold: () => void;
  isHeld: boolean;
  className?: string;
  size?: 'xs' | 'lg' | 'sm' | '1x' | '2x' | '3x' | '4x' | '5x' | '6x' | '7x' | '8x' | '9x' | '10x';
  shake: boolean;
}

const Die: React.FC<DieProps> = ({ value, canHold, onToggleHold, isHeld, shake, size, className }) => {
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

  const shouldShake = shake && !isHeld;

  return (
    <div
      className={`flex items-center justify-center ${className || 'h-16 w-16'} ${canHold ? 'cursor-pointer transition duration-300 ease-in-out transform hover:scale-105' : ''}`}
      onClick={canHold ? onToggleHold : undefined}
      role="button"
      aria-label={`${value}`}
    >
      <FontAwesomeIcon icon={diceIcon()} size={size || '3x'} style={{ color: isHeld ? "#22c65f" : "#888888" }} spinPulse={shouldShake} />
    </div>
  );
};

export default Die;
