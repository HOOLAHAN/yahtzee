// ScoreDisplay.tsx

interface ScoreDisplayProps {
  currentScore: number;
  totalScore: number;
}

const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ currentScore, totalScore }) => (
  <div className="web-score-stats">
    <div><span>Best now</span><strong>{currentScore}</strong></div>
    <div><span>Total</span><strong>{totalScore}</strong></div>
  </div>
);

export default ScoreDisplay;
