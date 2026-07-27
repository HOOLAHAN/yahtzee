import React from 'react';
import { lockInScore, canLockInScore } from '../../lib/gameControl';
import { calculateCurrentCategoryScore } from '../../lib/scoreCalculator';
import { getButtonClass } from '../../lib/utils';
import { Category } from '../../lib/types';

interface CategoryButtonsProps {
  dice: number[];
  hasRolled: boolean;
  usedCategories: Set<string>;
  setUsedCategories: React.Dispatch<React.SetStateAction<Set<string>>>;
  setTotalScore: React.Dispatch<React.SetStateAction<number>>;
  totalScore: number;
  setScoreHistory: React.Dispatch<React.SetStateAction<any[]>>;
  scoreHistory: any[];
  setCurrentScore: React.Dispatch<React.SetStateAction<number>>;
  setHasRolled: React.Dispatch<React.SetStateAction<boolean>>;
  setDice: React.Dispatch<React.SetStateAction<number[]>>;
  setRollsLeft: React.Dispatch<React.SetStateAction<number>>;
  setHeldDice: React.Dispatch<React.SetStateAction<Set<number>>>;
  initialDice: number[];
  calculateScoreFunction: (category: Category, dice: number[]) => number;
  startNewRound: () => void;
  currentScore: number;
  handleScoreLockIn: (category: string) => void;
  setShowFlash: React.Dispatch<React.SetStateAction<boolean>>;
  isTwoPlayer: boolean;
  currentPlayer: number;
  player1TotalScore: number;
  player2TotalScore: number;
  setPlayer1TotalScore: React.Dispatch<React.SetStateAction<number>>;
  setPlayer2TotalScore: React.Dispatch<React.SetStateAction<number>>;
  showAll?: boolean;
  selectedCategory?: Category | null;
  onSelectCategory?: (category: Category) => void;
}

const categoryLabels: Record<Category, string> = {
  Ones: 'Ones',
  Twos: 'Twos',
  Threes: 'Threes',
  Fours: 'Fours',
  Fives: 'Fives',
  Sixes: 'Sixes',
  ThreeOfAKind: '3 of a Kind',
  FourOfAKind: '4 of a Kind',
  FullHouse: 'Full House',
  SmallStraight: 'Sm. Straight',
  LargeStraight: 'Lg. Straight',
  Yahtzee: 'Yahtzee',
  Chance: 'Chance',
};

const categoryTestIds: Record<Category, string> = {
  Ones: 'score-ones',
  Twos: 'score-twos',
  Threes: 'score-threes',
  Fours: 'score-fours',
  Fives: 'score-fives',
  Sixes: 'score-sixes',
  ThreeOfAKind: 'score-three-of-a-kind',
  FourOfAKind: 'score-four-of-a-kind',
  FullHouse: 'score-full-house',
  SmallStraight: 'score-small-straight',
  LargeStraight: 'score-large-straight',
  Yahtzee: 'score-yahtzee',
  Chance: 'score-chance',
};

const CategoryButtons: React.FC<CategoryButtonsProps> = ({
  dice,
  hasRolled,
  usedCategories,
  setUsedCategories,
  setTotalScore,
  totalScore,
  setScoreHistory,
  scoreHistory,
  setCurrentScore,
  setHasRolled,
  setDice,
  setRollsLeft,
  setHeldDice,
  initialDice,
  calculateScoreFunction,
  currentScore,
  startNewRound,
  handleScoreLockIn,
  setShowFlash,
  isTwoPlayer,
  currentPlayer,
  player1TotalScore,
  player2TotalScore,
  setPlayer1TotalScore,
  setPlayer2TotalScore,
  showAll = false,
  selectedCategory,
  onSelectCategory,
}) => {
  const categories: Category[] = [
    'Ones', 'Twos', 'Threes', 'Fours', 'Fives', 'Sixes',
    'ThreeOfAKind', 'FourOfAKind', 'FullHouse',
    'SmallStraight', 'LargeStraight', 'Yahtzee', 'Chance'
  ];

  return (
    <div className={showAll ? 'web-category-grid' : 'flex flex-wrap justify-center gap-3 mt-6 max-w-5xl mx-auto'}>
      {categories.map((category) => {
        const canLock = canLockInScore(category, hasRolled, usedCategories);
        const isUsed = usedCategories.has(category);
        if (!showAll && (!canLock || isUsed)) return null;

        const currentCategoryScore = calculateCurrentCategoryScore(category, dice);
        const buttonClass = getButtonClass(currentCategoryScore);
        const savedScore = scoreHistory.find((entry) => entry.category === category)?.roundScore;
        const testId = categoryTestIds[category];

        return (
          <button
            key={category}
            data-testid={testId}
            className={showAll ? `web-category-card ${selectedCategory === category ? 'web-category-selected' : ''} ${isUsed ? 'web-category-used' : ''} ${!hasRolled ? 'web-category-locked' : ''}` : `${buttonClass} ${isUsed ? 'cursor-not-allowed opacity-70' : ''} ${!canLock ? 'cursor-not-allowed opacity-40' : ''}`}
            onClick={() => {
              if (showAll && onSelectCategory) { if (canLock) onSelectCategory(category); return; }
              lockInScore(
                category,
                usedCategories,
                setUsedCategories,
                dice,
                setTotalScore,
                totalScore,
                setScoreHistory,
                scoreHistory,
                startNewRound,
                setCurrentScore,
                setHasRolled,
                setDice,
                setRollsLeft,
                setHeldDice,
                initialDice,
                currentScore,
                calculateScoreFunction,
                isTwoPlayer,
                currentPlayer,
                player1TotalScore,
                player2TotalScore,
                setPlayer1TotalScore,
                setPlayer2TotalScore
              );
              handleScoreLockIn(category);
            }}
            disabled={!canLock || isUsed}
          >
            <span>{categoryLabels[category]}</span><strong>{isUsed ? savedScore : currentCategoryScore}</strong>
          </button>
        );
      })}
    </div>
  );
};

export default CategoryButtons;
