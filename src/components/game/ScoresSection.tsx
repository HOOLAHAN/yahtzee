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
  usedCategories: { [category: string]: number };
}

const ScoresSection: React.FC<ScoresSectionProps> = ({ dice, hasRolled, usedCategories }) => {
  if (!hasRolled) return null;

  const formatScore = (category: string, score: number) => {
    const isUsed = category in usedCategories;

    const scoreText = isUsed ? `(${score})` : score;
    const textClass = isUsed
      ? 'text-electricPink'
      : score > 0
      ? 'text-neonYellow'
      : 'text-electricPink';

    return <span className={textClass}>{scoreText}</span>;
  };

  return (
    <div className="w-full max-w-5xl mx-auto mt-6 text-neonCyan bg-deepBlack p-4 rounded-lg shadow-lg border border-neonCyan">
      <div className="text-center mb-4">
        <h2 className="text-2xl font-bold animate-pulse-glow">Dice Scores</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 text-base sm:text-lg">
        <div className="bg-deepBlack rounded-md px-4 text-center">
          {['Ones', 'Twos', 'Threes', 'Fours', 'Fives', 'Sixes'].map(label => {
            const score = calculateNumberScore(label as any, dice);
            return (
              <div key={label} data-testid={`score-${label.toLowerCase()}`}>
                {label}: {formatScore(label, score)}
              </div>
            );
          })}
        </div>

        <div className="bg-deepBlack rounded-md px-4 text-center">
          {[
            { label: 'Three of a Kind', key: 'ThreeOfAKind' },
            { label: 'Four of a Kind', key: 'FourOfAKind' },
            { label: 'Full House', key: 'FullHouse' },
          ].map(({ label, key }) => {
            const score = key === 'FullHouse'
              ? calculateFullHouse(dice)
              : calculateScore(key as any, dice);
            return (
              <div key={key} data-testid={`score-${key.toLowerCase()}`}>
                {label}: {formatScore(key, score)}
              </div>
            );
          })}
        </div>

        <div className="bg-deepBlack rounded-md px-4 text-center">
          {[
            { label: 'Small Straight', key: 'SmallStraight', score: isStraight(dice, 4) ? 30 : 0 },
            { label: 'Large Straight', key: 'LargeStraight', score: isStraight(dice, 5) ? 40 : 0 },
            { label: 'Chance', key: 'Chance', score: calculateChance(dice) },
            { label: 'Yahtzee', key: 'Yahtzee', score: calculateScore('Yahtzee', dice) },
          ].map(({ label, key, score }) => (
            <div key={key} data-testid={`score-${key.toLowerCase()}`}>
              {label}: {formatScore(key, score)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ScoresSection;
