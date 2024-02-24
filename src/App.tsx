// App.tsx

import React, { useState } from 'react';
import './tailwind.css';
import Navbar from './components/Navbar';
import DiceDisplay from './components/DiceDisplay';
import ScoreCard from './components/ScoreCard';
import ScoreFlash from './components/ScoreFlash';
import GameControlButtons from './components/GameControlButtons';
import { 
  calculateChance, isStraight, calculateFullHouse, calculateScore,
  calculateScoreFunction, calculateNumberScore, calculateCurrentCategoryScore,
  calculateMaximumScore 
} from './functions/scoreCalculator';
import { rollDice, toggleHoldDie } from './functions/diceLogic';
import { 
  resetGame, startNewRound, canLockInScore, lockInScore 
} from './functions/gameControl';
import { ScoreEntry } from './functions/types';
import { printDocument, getButtonClass, getDieSize } from './functions/utils';
import { useWindowSize } from './hooks/useWindowSize';

interface AppProps {
  initialDice?: number[];
}

const App: React.FC<AppProps> = ({ initialDice = [1, 1, 1, 1, 1] }) => {
  const [dice, setDice] = useState(initialDice);
  const [heldDice, setHeldDice] = useState(new Set<number>());
  const [currentScore, setCurrentScore] = useState(0);
  const [scoreHistory, setScoreHistory] = useState<ScoreEntry[]>([]);
  const [rollsLeft, setRollsLeft] = useState(3);
  const [totalScore, setTotalScore] = useState(0);
  const [hasRolled, setHasRolled] = useState(false);
  const [usedCategories, setUsedCategories] = useState(new Set<string>());
  const [shouldShake, setShouldShake] = useState(false);
  const [showScoreCard, setShowScoreCard] = useState(false);
  const [showFlash, setShowFlash] = useState(false);
  const [flashCategory, setFlashCategory] = useState('');
  
  const windowSize = useWindowSize();
  const dieSize = getDieSize(windowSize);
  
  React.useEffect(() => {
    if (scoreHistory.length > 0) {
      setShowScoreCard(true);
    } else {
      setShowScoreCard(false);
    }
  }, [scoreHistory]);

  return (
    <div className="App">
      <Navbar />
      <div className="bg-gray-200 min-h-screen flex flex-col items-center justify-start p-4 md:p-8">
        <h2 className="text-2xl mb-2">Dice:</h2>
        <DiceDisplay
          dice={dice}
          heldDice={heldDice}
          toggleHoldDie={(index: number) => toggleHoldDie(index, heldDice, setHeldDice)}
          rollsLeft={rollsLeft}
          hasRolled={hasRolled}
          shouldShake={shouldShake}
          dieSize={dieSize}
        />
        <h2 className="text-l mb-2">Toggle to hold dice</h2>
        <div className="flex space-x-2">
        <button
          className="w-full md:w-auto transition duration-300 ease-in-out transform hover:scale-105 py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 focus:ring focus:ring-blue-200 mb-2 mr-2"
          onClick={() => {
            if (rollsLeft > 0) {
              setShouldShake(true);
              setTimeout(() => {
                setShouldShake(false);
                rollDice(
                  rollsLeft,
                  dice,
                  heldDice,
                  setHasRolled,
                  setDice,
                  setRollsLeft,
                  setCurrentScore,
                );
              }, 800);
            }
          }}
          disabled={rollsLeft <= 0 || usedCategories.size === 13}
        >
          Roll Dice (Rolls left: {rollsLeft})
        </button>
        </div>
        <h2 className="text-2xl mb-2">Current Score: {calculateMaximumScore(dice, hasRolled, usedCategories)}</h2>
        <h2 className="text-2xl mb-2">Current Total: {totalScore}</h2>
        { hasRolled && <h2 className="text-2xl mb-2">Lock In Score:</h2> }
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
              onClick={() => {
                lockInScore(category, usedCategories, setUsedCategories, dice, setTotalScore, totalScore, setScoreHistory, scoreHistory, startNewRound, setCurrentScore, setHasRolled, setDice, setRollsLeft, setHeldDice, initialDice, currentScore, calculateScoreFunction);
                setFlashCategory(category);
                setShowFlash(true);
              }}
              disabled={!canLock || isUsed}
            >
              {category.replace(/([A-Z])/g, ' $1').trim()}
            </button>
          );
        })}
        </div>
        <ScoreFlash category={flashCategory} show={showFlash} onEnd={() => setShowFlash(false)} />
        <h2 className="text-2xl mb-2">Scores</h2>
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
        { showScoreCard && <h2 className="text-2xl mb-2">Score Card:</h2> }
        <div className="flex space-x-2">
        { showScoreCard && <ScoreCard scoreHistory={scoreHistory} totalScore={totalScore}/> }
        </div>
        { scoreHistory.length > 0 &&
        <GameControlButtons
        onResetGame={() => resetGame(setDice, setRollsLeft, setHeldDice, setCurrentScore, setScoreHistory, setHasRolled, setTotalScore, initialDice, setUsedCategories)}
        onPrintDocument={printDocument}
        isMobile={windowSize < 640}
      />
        }
      </div>
    </div>
  );
};

export default App;