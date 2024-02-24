// CategoryButtons.tsx
import React from 'react';
import { lockInScore, canLockInScore } from '../functions/gameControl';
import { calculateCurrentCategoryScore } from '../functions/scoreCalculator';
import { getButtonClass } from '../functions/utils';

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
  calculateScoreFunction: typeof calculateCurrentCategoryScore;
  startNewRound: () => void;
  currentScore: number;
  setFlashCategory: React.Dispatch<React.SetStateAction<string>>;
  setShowFlash: React.Dispatch<React.SetStateAction<boolean>>;
}

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
}) => {
  return (
    <div className="flex flex-wrap space-x-2 max-w-3xl mx-auto justify-center">
      {['Ones', 'Twos', 'Threes', 'Fours', 'Fives', 'Sixes', 'ThreeOfAKind', 'FourOfAKind', 'FullHouse', 'SmallStraight', 'LargeStraight', 'Yahtzee', 'Chance'].map((category) => {
        const canLock = canLockInScore(category, hasRolled, usedCategories);
        const isUsed = usedCategories.has(category);
        if (!canLock || isUsed) return null;
        const currentCategoryScore = calculateCurrentCategoryScore(category, dice);
        const buttonClass = getButtonClass(currentCategoryScore);
        return (
          <button
            key={category}
            className={buttonClass}
            onClick={() => lockInScore(
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
              calculateScoreFunction
            )}
            disabled={!canLock || isUsed}
          >
            {category.replace(/([A-Z])/g, ' $1').trim()}
          </button>
        );
      })}
    </div>
  );
};

export default CategoryButtons;
