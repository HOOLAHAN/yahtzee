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
  currentPlayer: number;
  player1Scores: { [key: string]: number };
  player2Scores: { [key: string]: number };
}

const ScoresSection: React.FC<ScoresSectionProps> = ({ dice, hasRolled, currentPlayer, player1Scores, player2Scores }) => {
  const scores = currentPlayer === 1 ? player1Scores : player2Scores;

  return (
    <div className="scores-section">
      <div className="w-full text-center">
        <h2 className="text-2xl mb-2 inline-block">Scores: </h2>
      </div>
      <div className="flex justify-between">
        <div className='mr-10'>
          <div className="mb-1">Ones: { hasRolled ? calculateNumberScore('Ones', dice) : scores['Ones'] || 0}</div>
          <div className="mb-1">Twos: { hasRolled ? calculateNumberScore('Twos', dice) : scores['Twos'] || 0}</div>
          <div className="mb-1">Threes: { hasRolled ? calculateNumberScore('Threes', dice) : scores['Threes'] || 0}</div>
          <div className="mb-1">Fours: { hasRolled ? calculateNumberScore('Fours', dice) : scores['Fours'] || 0}</div>
          <div className="mb-1">Fives: { hasRolled ? calculateNumberScore('Fives', dice) : scores['Fives'] || 0}</div>
          <div className="mb-1">Sixes: { hasRolled ? calculateNumberScore('Sixes', dice) : scores['Sixes'] || 0}</div>
        </div>
        <div>
          <div className="mb-1">Three of a Kind: { hasRolled ? calculateScore('ThreeOfAKind', dice) : scores['ThreeOfAKind'] || 0}</div>
          <div className="mb-1">Four of a Kind: { hasRolled ? calculateScore('FourOfAKind', dice) : scores['FourOfAKind'] || 0}</div>
          <div className="mb-1">Full House: { hasRolled ? calculateFullHouse(dice) : scores['FullHouse'] || 0}</div>
          <div className="mb-1">Small Straight: { hasRolled ? (isStraight(dice, 4) ? 30 : 0) : scores['SmallStraight'] || 0}</div>
          <div className="mb-1">Large Straight: { hasRolled ? (isStraight(dice, 5) ? 40 : 0) : scores['LargeStraight'] || 0}</div>
          <div className="mb-1">Chance: { hasRolled ? calculateChance(dice) : scores['Chance'] || 0}</div>
          <div className="mb-1">Yahtzee: { hasRolled ? calculateScore('Yahtzee', dice) : scores['Yahtzee'] || 0}</div>
        </div>
      </div>
    </div>
  );
};

export default ScoresSection;
