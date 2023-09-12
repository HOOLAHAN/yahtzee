import React, { useState } from 'react';
import './tailwind.css';
import Navbar from './components/Navbar';
import Die from './components/Die';
import { 
  calculateChance, 
  isStraight, 
  calculateFullHouse, 
  calculateScore, 
  rollDice,
  resetGame,
  startNewRound,
  toggleHoldDie,
  canLockInScore,
  lockInScore
 } from './functions/utils';

interface AppProps {
  initialDice?: number[];
}

const App: React.FC<AppProps> = ({ initialDice = [1, 1, 1, 1, 1] }) => {
  const [dice, setDice] = useState(initialDice);
  const [heldDice, setHeldDice] = useState(new Set<number>());
  const [currentScore, setCurrentScore] = useState(0);
  const [scoreHistory, setScoreHistory] = useState<number[]>([]);
  const [rollsLeft, setRollsLeft] = useState(3);
  const [totalScore, setTotalScore] = useState(0);
  const [hasRolled, setHasRolled] = useState(false);
  const [usedCategories, setUsedCategories] = useState(new Set<string>());

  return (
    <div className="App">
      <Navbar />
      <div className="bg-gray-200 min-h-screen flex flex-col items-center justify-center p-4 md:p-8">
        <div className="flex space-x-2">
          <button 
          className="w-full md:w-auto transition duration-300 ease-in-out transform hover:scale-105 py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 focus:ring focus:ring-blue-200 mb-2 mr-2"
          onClick={() => rollDice(rollsLeft, dice, heldDice, hasRolled, setHasRolled, setDice, setRollsLeft, setHeldDice, setCurrentScore, setScoreHistory, scoreHistory, setTotalScore, totalScore, currentScore)}
          disabled={rollsLeft <= 0}
          >
            Roll Dice (Rolls left: {rollsLeft})
          </button>
          <button 
          className="transition duration-300 ease-in-out transform hover:scale-105 py-2 px-4 w-full md:w-auto bg-red-600 text-white rounded hover:bg-red-700 focus:ring focus:ring-red-200 mb-2"
          onClick={() => resetGame(setDice, setRollsLeft, setHeldDice, setCurrentScore, setScoreHistory, setHasRolled, setTotalScore, initialDice)}
          >
            Reset Game
          </button>
        </div>
      <h2 className="text-2xl mb-2">Current Score: {currentScore}</h2>
      <h2 className="text-2xl mb-2">Total Score: {totalScore}</h2>
      <h2 className="text-2xl mb-2">Score History</h2>
      <ul className="list-decimal list-inside mb-6 text-blue-600">
        {scoreHistory.map((score, index) => (
          <li key={index}>{score}</li>
        ))}
      </ul>
      <div className="flex flex-wrap justify-center space-x-4 space-y-4 mb-6">
        {dice.map((die, index) => (
          <Die
            key={index}
            value={die}
            canHold={rollsLeft > 0 && hasRolled}
            isHeld={heldDice.has(index)}
            onToggleHold={() => toggleHoldDie(index, heldDice, setHeldDice)}
          />
        ))}
      </div>
      <div className="flex space-x-2">
        <button
          className={`transition duration-300 ease-in-out transform py-2 px-4 w-full md:w-auto ${canLockInScore('ThreeOfAKind', hasRolled, usedCategories, dice) ? 'bg-green-600 text-white' : 'bg-gray-400 text-white cursor-not-allowed'} rounded hover:bg-green-700 focus:ring focus:ring-green-200 mb-2 mr-2`}
          onClick={() => lockInScore('ThreeOfAKind', usedCategories, setUsedCategories, dice, setTotalScore, totalScore, setScoreHistory, scoreHistory, startNewRound, setCurrentScore, setHasRolled, setDice, setRollsLeft, setHeldDice, initialDice, currentScore)}
          disabled={!canLockInScore('ThreeOfAKind', hasRolled, usedCategories, dice)}
        >
          Lock in Three of a Kind
        </button>
        <button
          className={`transition duration-300 ease-in-out transform py-2 px-4 w-full md:w-auto ${canLockInScore('FourOfAKind', hasRolled, usedCategories, dice) ? 'bg-green-600 text-white' : 'bg-gray-400 text-white cursor-not-allowed'} rounded hover:bg-green-700 focus:ring focus:ring-green-200 mb-2 mr-2`}
          onClick={() => lockInScore('FourOfAKind', usedCategories, setUsedCategories, dice, setTotalScore, totalScore, setScoreHistory, scoreHistory, startNewRound, setCurrentScore, setHasRolled, setDice, setRollsLeft, setHeldDice, initialDice, currentScore)}
          disabled={!canLockInScore('FourOfAKind', hasRolled, usedCategories, dice)}
        >
          Lock in Four of a Kind
        </button>
        <button
          className={`transition duration-300 ease-in-out transform py-2 px-4 w-full md:w-auto ${canLockInScore('FullHouse', hasRolled, usedCategories, dice) ? 'bg-green-600 text-white' : 'bg-gray-400 text-white cursor-not-allowed'} rounded hover:bg-green-700 focus:ring focus:ring-green-200 mb-2`}
          onClick={() => lockInScore('FullHouse', usedCategories, setUsedCategories, dice, setTotalScore, totalScore, setScoreHistory, scoreHistory, startNewRound, setCurrentScore, setHasRolled, setDice, setRollsLeft, setHeldDice, initialDice, currentScore)}
          disabled={!canLockInScore('FullHouse', hasRolled, usedCategories, dice)}
        >
          Lock in Full House
        </button>
      </div>
      <h2 className="text-2xl mb-2">Scores</h2>
      <div className="mb-1">Three of a Kind: {calculateScore('ThreeOfAKind', dice)}</div>
      <div className="mb-1">Four of a Kind: {calculateScore('FourOfAKind', dice)}</div>
      <div className="mb-1">Full House: {calculateFullHouse(dice)}</div>
      <div className="mb-1">Small Straight: {isStraight(dice, 4) ? 30 : 0}</div>
      <div className="mb-1">Large Straight: {isStraight(dice, 5) ? 40 : 0}</div>
      <div className="mb-1">Yahtzee: {calculateScore('Yahtzee', dice)}</div>
      <div className="mb-1">Chance: {calculateChance(dice)}</div>
     </div>
    </div>
  );
};

export default App;
