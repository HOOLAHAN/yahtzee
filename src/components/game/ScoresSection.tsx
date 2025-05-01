// ScoresSection.tsx

import {
  calculateNumberScore,
  calculateScore,
  calculateFullHouse,
  isStraight,
  calculateChance,
} from '../../functions/scoreCalculator';

interface ScoresSectionProps {
  dice: number[];
  hasRolled: boolean;
}

const ScoresSection: React.FC<ScoresSectionProps> = ({ dice, hasRolled }) => {
  if (!hasRolled) return null;

  return (
    <div className="scores-section">
      <div className="w-full text-center">
        <h2 className="text-2xl mb-2 inline-block">Scores: </h2>
      </div>
      <div className="flex justify-between">
        <div className='mr-10'>
          <div className="mb-1">Ones: { calculateNumberScore('Ones', dice) }</div>
          <div className="mb-1">Twos: { calculateNumberScore('Twos', dice) }</div>
          <div className="mb-1">Threes: { calculateNumberScore('Threes', dice) }</div>
          <div className="mb-1">Fours: { calculateNumberScore('Fours', dice) }</div>
          <div className="mb-1">Fives: { calculateNumberScore('Fives', dice) }</div>
          <div className="mb-1">Sixes: { calculateNumberScore('Sixes', dice) }</div>
        </div>
        <div>
          <div className="mb-1">Three of a Kind: { calculateScore('ThreeOfAKind', dice) }</div>
          <div className="mb-1">Four of a Kind: { calculateScore('FourOfAKind', dice) }</div>
          <div className="mb-1">Full House: { calculateFullHouse(dice) }</div>
          <div className="mb-1">Small Straight: { isStraight(dice, 4) ? 30 : 0 }</div>
          <div className="mb-1">Large Straight: { isStraight(dice, 5) ? 40 : 0 }</div>
          <div className="mb-1">Chance: { calculateChance(dice) }</div>
          <div className="mb-1">Yahtzee: { calculateScore('Yahtzee', dice) }</div>
        </div>
      </div>
    </div>
  );
};

export default ScoresSection;
