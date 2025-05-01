// ScoreDisplay.tsx
interface ScoreDisplayProps {
  currentScore: number;
  totalScore: number;
}

const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ currentScore, totalScore }) => (
  <div>
    <h2 className="text-2xl mb-2">Current Score: {currentScore}</h2>
    <h2 className="text-2xl mb-2">Current Total: {totalScore}</h2>
  </div>
);

export default ScoreDisplay