// App.tsx

import React, { useState, useEffect } from 'react';
import './tailwind.css';
import Navbar from './components/Navbar';
import Die from './components/Die';
import ScoreCard from './components/ScoreCard';
import { 
  calculateChance, 
  isStraight, 
  calculateFullHouse, 
  calculateScore,
  calculateScoreFunction,
  calculateNumberScore,
  calculateCurrentCategoryScore,
  calculateMaximumScore
 } from './functions/scoreCalculator';
import { ScoreEntry } from './functions/types';
import { rollDice, toggleHoldDie } from './functions/diceLogic';
  import { resetGame,  
    startNewRound,
    canLockInScore,
    lockInScore
  } from './functions/gameControl';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf } from '@fortawesome/free-solid-svg-icons';
import { printDocument } from './functions/utils'

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

  const getButtonClass = (score: number) => score === 0
  ? "transition duration-300 ease-in-out transform py-2 px-4 rounded mb-2 mr-2 bg-green-200 text-white hover:bg-green-300 focus:ring focus:ring-green-100"
  : "transition duration-300 ease-in-out transform py-2 px-4 rounded mb-2 mr-2 bg-green-600 text-white hover:bg-green-700 focus:ring focus:ring-green-200";

  React.useEffect(() => {
    if (scoreHistory.length > 0) {
      setShowScoreCard(true);
    } else {
      setShowScoreCard(false);
    }
  }, [scoreHistory]);

  const useWindowSize = () => {
    const [windowSize, setWindowSize] = useState(window.innerWidth);
  
    useEffect(() => {
      const handleResize = () => {
        setWindowSize(window.innerWidth);
      };
      window.addEventListener('resize', handleResize);
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }, []);
  
    return windowSize;
  };

  const windowSize = useWindowSize();
  let dieSize: 'xs' | 'lg' | 'sm' | '1x' | '2x' | '3x' | '4x' | '5x' | '6x' | '7x' | '8x' | '9x' | '10x';

  if (windowSize < 640) {
    dieSize = '3x';
  } else if (windowSize >= 640 && windowSize < 1024) {
    dieSize = '4x';
  } else {
    dieSize = '5x';
  }

  return (
    <div className="App">
      <Navbar />
      <div className="bg-gray-200 min-h-screen flex flex-col items-center justify-start p-4 md:p-8">
        <h2 className="text-2xl mb-2">Dice:</h2>
        <div className="flex flex-wrap justify-center mb-4">
          {dice.map((die, index) => (
            <Die
              key={index}
              value={die}
              canHold={rollsLeft > 0 && hasRolled}
              isHeld={heldDice.has(index)}
              onToggleHold={() => toggleHoldDie(index, heldDice, setHeldDice)}
              className="m-2 md:m-4 lg:m-6"
              shake={shouldShake}
              size={dieSize}
            />
          ))}
        </div>
        <h2 className="text-l mb-2">Toggle to hold dice</h2>
        <div className="flex space-x-2">
        <button
          className="w-full md:w-auto transition duration-300 ease-in-out transform hover:scale-105 py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 focus:ring focus:ring-blue-200 mb-2 mr-2"
          onClick={() => {
            if (rollsLeft > 0) {
              // Start shaking the dice
              setShouldShake(true);
              // Wait until the shaking animation is complete
              setTimeout(() => {
                // Stop shaking the dice
                setShouldShake(false);
                // Change the value of the dice
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
              }}
              disabled={!canLock || isUsed}
            >
              {category.replace(/([A-Z])/g, ' $1').trim()}
            </button>
          );
        })}
        </div>
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
        <div className="flex space-x-2 mt-4">
          <button 
            className="transition duration-300 ease-in-out transform hover:scale-105 py-2 px-4 w-full md:w-auto bg-red-600 text-white rounded hover:bg-red-700 focus:ring focus:ring-red-200 mb-2"
            onClick={() => resetGame(setDice, setRollsLeft, setHeldDice, setCurrentScore, setScoreHistory, setHasRolled, setTotalScore, initialDice, setUsedCategories)}
            >
              { windowSize < 640 ? "Reset" : "Reset Game" }
          </button>
          <button 
            className="w-full md:w-auto transition duration-300 ease-in-out transform hover:scale-105 py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 focus:ring focus:ring-blue-200 mb-2 mr-2"
            onClick={printDocument}
          >
            <FontAwesomeIcon icon={faFilePdf} className="mr-2" />
            { windowSize < 640 ? "" : "Score Card" }
          </button> 
        </div>
        }
      </div>
    </div>
  );
};

export default App;