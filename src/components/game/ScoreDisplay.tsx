// ScoreDisplay.tsx

interface ScoreDisplayProps {
  currentScore: number;
  totalScore: number;
}

const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ currentScore, totalScore }) => (
  <div className="text-center mb-4">
    <h2 className="text-xl sm:text-2xl font-semibold text-neonCyan drop-shadow-md mb-1">
      Current Score: <span className="text-neonYellow">{currentScore}</span>
    </h2>
    <h2 className="text-xl sm:text-2xl font-semibold text-neonCyan drop-shadow-md">
      Total Score: <span className="text-neonYellow">{totalScore}</span>
    </h2>
  </div>
);

export default ScoreDisplay;
