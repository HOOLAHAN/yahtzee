// Die.tsx

interface DieProps {
  value: number;
  canHold: boolean;
  onToggleHold: () => void;
  isHeld: boolean;
  className?: string;
}

const Die: React.FC<DieProps> = ({ value, canHold, onToggleHold, isHeld, className }) => {
  const baseStyle = 'transition-colors duration-300 ease-in-out text-2xl p-4 rounded-full flex items-center justify-center h-16 w-16';
  const heldStyle = 'bg-green-500 text-white shadow-lg';
  const notHeldStyle = 'bg-white text-black shadow hover:bg-gray-100';

  return (
    <div
      className={`${baseStyle} ${isHeld ? heldStyle : notHeldStyle} ${canHold ? 'cursor-pointer' : ''} ${className}`}
      onClick={canHold ? onToggleHold : undefined}
      role="button"
      aria-label={`${value}`}
    >
      {value}
    </div>
  );
};

export default Die;