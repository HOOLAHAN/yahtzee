// ScoreDisplay.tsx

interface ScoreDisplayProps {
  currentScore: number;
  totalScore: number;
  showSuggestion?: boolean;
}

const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ currentScore, totalScore, showSuggestion = true }) => (
  <div className="web-score-stats">
    {showSuggestion && <div><span>Best now</span><strong>{currentScore}</strong></div>}
    <div><span>Total</span><strong>{totalScore}</strong></div>
  </div>
);

export default ScoreDisplay;
