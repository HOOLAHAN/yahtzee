import { FontAwesomeSize } from '../../lib/types';

interface DiceFaceProps {
  value: number;
  canHold: boolean;
  onToggleHold: () => void;
  isHeld: boolean;
  className?: string;
  size?: FontAwesomeSize;
  shake: boolean;
  rollIndex?: number;
}

const pips: Record<number, number[]> = {
  1: [4],
  2: [0, 8],
  3: [0, 4, 8],
  4: [0, 2, 6, 8],
  5: [0, 2, 4, 6, 8],
  6: [0, 2, 3, 5, 6, 8],
};

const DiceFace: React.FC<DiceFaceProps> = ({
  value,
  canHold,
  onToggleHold,
  isHeld,
  shake,
  className,
  rollIndex = 0,
}) => {
  const isGameDie = className?.includes('game-die');

  return (
    <button
      type="button"
      disabled={!canHold}
      onClick={onToggleHold}
      aria-label={`${value}`}
      aria-pressed={isHeld}
      className={`${isGameDie ? 'web-die-wrap' : 'web-mini-die-wrap'} ${canHold ? 'cursor-pointer' : ''} ${shake && !isHeld ? 'dice-rolling' : ''}`}
      style={{ '--roll-index': rollIndex, '--throw-x': `${(rollIndex - 2) * 7}px` } as React.CSSProperties}
    >
      <span className={`${isGameDie ? 'web-die' : 'web-mini-die'} ${isHeld ? 'web-die-held' : ''}`}>
        {Array.from({ length: 9 }, (_, index) => (
          <span key={index} className="web-pip-cell">
            {pips[value]?.includes(index) && <i />}
          </span>
        ))}
      </span>
      {isHeld && isGameDie && <small className="web-held-badge">HELD</small>}
    </button>
  );
};

export default DiceFace;
