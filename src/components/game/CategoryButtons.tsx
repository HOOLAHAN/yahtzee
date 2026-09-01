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
  const upperCategories = categories.slice(0, 6);
  const upperSubtotal = scoreHistory.filter((entry) => upperCategories.includes(entry.category)).reduce((sum, entry) => sum + entry.roundScore, 0);

  const categoryButton = (category: Category) => {
    const canLock = canLockInScore(category, hasRolled, usedCategories);
    const isUsed = usedCategories.has(category);
    if (!showAll && (!canLock || isUsed)) return null;
    const currentCategoryScore = calculateCurrentCategoryScore(category, dice);
    const buttonClass = getButtonClass(currentCategoryScore);
    const savedScore = scoreHistory.find((entry) => entry.category === category)?.roundScore;
    return <button key={category} data-testid={categoryTestIds[category]} className={showAll ? `web-category-card ${selectedCategory === category ? 'web-category-selected' : ''} ${isUsed ? 'web-category-used' : ''} ${!hasRolled ? 'web-category-locked' : ''}` : `${buttonClass} ${isUsed ? 'cursor-not-allowed opacity-70' : ''} ${!canLock ? 'cursor-not-allowed opacity-40' : ''}`} onClick={() => {
      if (showAll && onSelectCategory) { if (canLock) onSelectCategory(category); return; }
      lockInScore(category, usedCategories, setUsedCategories, dice, setTotalScore, totalScore, setScoreHistory, scoreHistory, startNewRound, setCurrentScore, setHasRolled, setDice, setRollsLeft, setHeldDice, initialDice, currentScore, calculateScoreFunction, isTwoPlayer, currentPlayer, player1TotalScore, player2TotalScore, setPlayer1TotalScore, setPlayer2TotalScore);
      handleScoreLockIn(category);
    }} disabled={!canLock || isUsed}><span>{categoryLabels[category]}</span><strong>{isUsed ? savedScore : currentCategoryScore}</strong></button>;
  };

  if (showAll) return <div className="web-category-sections">
    <section className="web-category-section web-category-upper"><div className="web-category-section-heading"><div><b>↗</b><strong>Upper section</strong></div><small>{upperSubtotal >= 63 ? '+35 earned' : `${63 - upperSubtotal} needed`}</small></div><div className="web-bonus-progress" role="progressbar" aria-label="Upper bonus progress" aria-valuemin={0} aria-valuemax={63} aria-valuenow={Math.min(upperSubtotal, 63)}><i style={{ width: `${Math.min(100, upperSubtotal / 63 * 100)}%` }} /></div><div className="web-bonus-progress-label"><span>{upperSubtotal} / 63</span><span>Earn +35</span></div><div className="web-category-grid">{upperCategories.map(categoryButton)}</div></section>
    <section className="web-category-section web-category-lower"><div className="web-category-section-heading"><div><b>ϟ</b><strong>Lower section</strong></div><small>Combinations</small></div><div className="web-category-grid">{categories.slice(6).map(categoryButton)}</div></section>
  </div>;

  return (
    <div className="flex flex-wrap justify-center gap-3 mt-6 max-w-5xl mx-auto">
      {categories.map(categoryButton)}
    </div>
  );
};

export default CategoryButtons;
