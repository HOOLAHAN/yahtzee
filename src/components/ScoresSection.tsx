// ScoresSection.tsx

import {
  calculateNumberScore,
  calculateScore,
  calculateFullHouse,
  isStraight,
  calculateChance,
} from '../functions/scoreCalculator';

interface ScoresSectionProps {
  dice: number[];
  hasRolled: boolean;
}

const ScoresSection: React.FC<ScoresSectionProps> = ({ dice, hasRolled }) => {
  return (
    <div className="scores-section">
      <div className="w-full text-center">
        <h2 className="text-2xl mb-2 inline-block">Scores: </h2>
      </div>
      <div className="flex justify-between">
        <div className='mr-10'>
          <div className="mb-1">Ones: { hasRolled ? calculateNumberScore('Ones', dice) : 0}</div>
          <div className="mb-1">Twos: { hasRolled ? calculateNumberScore('Twos', dice) : 0}</div>
          <div className="mb-1">Threes: { hasRolled ? calculateNumberScore('Threes', dice) : 0}</div>
          <div className="mb-1">Fours: { hasRolled ? calculateNumberScore('Fours', dice) : 0}</div>
          <div className="mb-1">Fives: { hasRolled ? calculateNumberScore('Fives', dice) : 0}</div>
          <div className="mb-1">Sixes: { hasRolled ? calculateNumberScore('Sixes', dice) : 0}</div>
        </div>
        <div>
          <div className="mb-1">Three of a Kind: { hasRolled ? calculateScore('ThreeOfAKind', dice) : 0}</div>
          <div className="mb-1">Four of a Kind: { hasRolled ? calculateScore('FourOfAKind', dice) : 0}</div>
          <div className="mb-1">Full House: { hasRolled ? calculateFullHouse(dice) : 0}</div>
          <div className="mb-1">Small Straight: { hasRolled ? (isStraight(dice, 4) ? 30 : 0) : 0}</div>
          <div className="mb-1">Large Straight: { hasRolled ? (isStraight(dice, 5) ? 40 : 0) : 0}</div>
          <div className="mb-1">Chance: { hasRolled ? calculateChance(dice) : 0}</div>
          <div className="mb-1">Yahtzee: { hasRolled ? calculateScore('Yahtzee', dice) : 0}</div>
        </div>
      </div>
    </div>
  );
};

export default ScoresSection;
