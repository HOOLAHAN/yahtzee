// App.tsx

import React, { useState } from 'react';
import './tailwind.css';
import Navbar from './components/Navbar';
import Die from './components/Die';
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

  const getButtonClass = (score: number) => score === 0
  ? "transition duration-300 ease-in-out transform py-2 px-4 rounded mb-2 mr-2 bg-green-200 text-white hover:bg-green-300 focus:ring focus:ring-green-100"
  : "transition duration-300 ease-in-out transform py-2 px-4 rounded mb-2 mr-2 bg-green-600 text-white hover:bg-green-700 focus:ring focus:ring-green-200";

  return (
    <div className="App">
      <Navbar />
      <div className="bg-gray-200 min-h-screen flex flex-col items-center justify-center p-4 md:p-8">
        <h2 className="text-2xl mb-2">Total Score: {totalScore}</h2>  
        <h2 className="text-2xl mb-4">Score History:</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {scoreHistory.map((entry, index) => (
            <div
              key={index}
              className="bg-white p-4 rounded-lg shadow-lg flex flex-col justify-between space-y-2"
            >
              <div className="flex justify-between items-center">
                <span className="font-bold text-gray-600">Round</span>
                <span className="text-gray-800">{index + 1}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-bold text-blue-600">Dice</span>
                <span className="text-blue-800">{entry.dice.join(", ")}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-bold text-green-600">Category</span>
                <span className="text-green-800">{entry.category}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-bold text-red-600">Round Score</span>
                <span className="text-red-800">{entry.roundScore}</span>
              </div>
            </div>
          ))}
        </div>
        <h2 className="text-2xl mb-2">Dice:</h2>
        <div className="flex flex-wrap justify-center mb-4">
          {dice.map((die, index) => (
            <Die
              key={index}
              value={die}
              canHold={rollsLeft > 0 && hasRolled}
              isHeld={heldDice.has(index)}
              onToggleHold={() => toggleHoldDie(index, heldDice, setHeldDice)}
              className="m-4"
              shake={shouldShake}
            />
          ))}
        </div>
        <h2 className="text-l mb-2">Toggle to hold dice</h2>
        <div className="flex space-x-2">
          <button
            className="w-full md:w-auto transition duration-300 ease-in-out transform hover:scale-105 py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 focus:ring focus:ring-blue-200 mb-2 mr-2"
            onClick={() => {
              if (rollsLeft > 0) {
                setShouldShake(true);
                rollDice(
                  rollsLeft,
                  dice,
                  heldDice,
                  setHasRolled,
                  setDice,
                  setRollsLeft,
                  setCurrentScore,
                );
                setTimeout(() => setShouldShake(false), 1000);
              }
            }}
            disabled={rollsLeft <= 0}
          >
            Roll Dice (Rolls left: {rollsLeft})
          </button>
        </div>  
        <h2 className="text-2xl mb-2">Current Score: {calculateMaximumScore(dice, hasRolled, usedCategories)}</h2>
        <h2 className="text-2xl mb-2">Lock In Score:</h2>
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
            <div className="mb-1">Ones: {calculateNumberScore('Ones', dice)}</div>
            <div className="mb-1">Twos: {calculateNumberScore('Twos', dice)}</div>
            <div className="mb-1">Threes: {calculateNumberScore('Threes', dice)}</div>
            <div className="mb-1">Fours: {calculateNumberScore('Fours', dice)}</div>
            <div className="mb-1">Fives: {calculateNumberScore('Fives', dice)}</div>
            <div className="mb-1">Sixes: {calculateNumberScore('Sixes', dice)}</div>
          </div>
          <div>
            <div className="mb-1">Three of a Kind: {calculateScore('ThreeOfAKind', dice)}</div>
            <div className="mb-1">Four of a Kind: {calculateScore('FourOfAKind', dice)}</div>
            <div className="mb-1">Full House: {calculateFullHouse(dice)}</div>
            <div className="mb-1">Small Straight: {isStraight(dice, 4) ? 30 : 0}</div>
            <div className="mb-1">Large Straight: {isStraight(dice, 5) ? 40 : 0}</div>
            <div className="mb-1">Chance: {calculateChance(dice)}</div>
            <div className="mb-1">Yahtzee: {calculateScore('Yahtzee', dice)}</div>
          </div>
        </div>
          <div className="flex space-x-2">
            <button 
              className="transition duration-300 ease-in-out transform hover:scale-105 py-2 px-4 w-full md:w-auto bg-red-600 text-white rounded hover:bg-red-700 focus:ring focus:ring-red-200 mb-2"
              onClick={() => resetGame(setDice, setRollsLeft, setHeldDice, setCurrentScore, setScoreHistory, setHasRolled, setTotalScore, initialDice, setUsedCategories)}
              >
                Reset Game
            </button>
          </div>
      </div>
    </div>
  );
};

export default App;