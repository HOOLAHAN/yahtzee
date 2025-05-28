import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faDiceOne,
  faDiceTwo,
  faDiceThree,
  faDiceFour,
  faDiceFive,
  faDiceSix,
} from '@fortawesome/free-solid-svg-icons';

import { FontAwesomeSize } from '../../lib/types';

interface DieProps {
  value: number;
  canHold: boolean;
  onToggleHold: () => void;
  isHeld: boolean;
  className?: string;
  size?: FontAwesomeSize;
  shake: boolean;
}

const Die: React.FC<DieProps> = ({
  value,
  canHold,
  onToggleHold,
  isHeld,
  shake,
  size,
  className,
}) => {
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

  const shakeClass = shake && !isHeld ? 'animate-spin-wiggle' : '';

  return (
    <div
      className={`flex items-center justify-center ${className || 'h-16 w-16'} ${
        canHold ? 'cursor-pointer transition duration-300 ease-in-out transform hover:scale-105' : ''
      }`}
      onClick={canHold ? onToggleHold : undefined}
      role="button"
      aria-label={`${value}`}
    >
    <FontAwesomeIcon
      icon={diceIcon()}
      size={size || '3x'}
      className={`${shakeClass} align-middle`}
      style={{
        color: isHeld ? '#faff00' : '#00f7ff',
        backgroundColor: '#0d0d0d',
        borderRadius: '0.5rem',
        padding: '0.25rem',
        display: 'block', 
      }}
    />
    </div>
  );
};

export default Die;
