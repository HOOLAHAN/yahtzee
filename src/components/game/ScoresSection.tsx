// ScoresSection.tsx

import {
  calculateNumberScore,
  calculateScore,
  calculateFullHouse,
  isStraight,
  calculateChance,
} from '../../lib/scoreCalculator';

interface ScoresSectionProps {
  dice: number[];
  hasRolled: boolean;
}

const ScoresSection: React.FC<ScoresSectionProps> = ({ dice, hasRolled }) => {
  if (!hasRolled) return null;

  return (
    <div className="w-full max-w-5xl mx-auto mt-6 text-neonCyan bg-deepBlack p-4 rounded-lg shadow-lg border border-neonCyan">
      <div className="text-center mb-4">
        <h2 className="text-2xl font-bold animate-pulse-glow">Available Scores</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 text-base sm:text-lg">
        <div className="bg-deepBlack rounded-md px-4 text-center">
          <div data-testid="score-ones">Ones: <span className="text-electricPink">{calculateNumberScore('Ones', dice)}</span></div>
          <div data-testid="score-twos">Twos: <span className="text-electricPink">{calculateNumberScore('Twos', dice)}</span></div>
          <div data-testid="score-threes">Threes: <span className="text-electricPink">{calculateNumberScore('Threes', dice)}</span></div>
          <div data-testid="score-fours">Fours: <span className="text-electricPink">{calculateNumberScore('Fours', dice)}</span></div>
          <div data-testid="score-fives">Fives: <span className="text-electricPink">{calculateNumberScore('Fives', dice)}</span></div>
          <div data-testid="score-sixes">Sixes: <span className="text-electricPink">{calculateNumberScore('Sixes', dice)}</span></div>
        </div>

        <div className="bg-deepBlack rounded-md px-4 text-center">
          <div data-testid="score-three-of-a-kind">Three of a Kind: <span className="text-electricPink">{calculateScore('ThreeOfAKind', dice)}</span></div>
          <div data-testid="score-four-of-a-kind">Four of a Kind: <span className="text-electricPink">{calculateScore('FourOfAKind', dice)}</span></div>
          <div data-testid="score-full-house">Full House: <span className="text-electricPink">{calculateFullHouse(dice)}</span></div>
        </div>

        <div className="bg-deepBlack rounded-md px-4 text-center">
          <div data-testid="score-small-straight">Small Straight: <span className="text-electricPink">{isStraight(dice, 4) ? 30 : 0}</span></div>
          <div data-testid="score-large-straight">Large Straight: <span className="text-electricPink">{isStraight(dice, 5) ? 40 : 0}</span></div>
          <div data-testid="score-chance">Chance: <span className="text-electricPink">{calculateChance(dice)}</span></div>
          <div data-testid="score-yahtzee">Yahtzee: <span className="text-electricPink">{calculateScore('Yahtzee', dice)}</span></div>
        </div>
      </div>
    </div>
  );
};

export default ScoresSection;
