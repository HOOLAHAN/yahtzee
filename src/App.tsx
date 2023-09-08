import React, { useState } from 'react';
import './App.css';

type DieFace = 1 | 2 | 3 | 4 | 5 | 6;

const rollDie = (): DieFace => {
  return (Math.floor(Math.random() * 6) + 1) as DieFace;
};

const App: React.FC = () => {
  const [dice, setDice] = useState<DieFace[]>([1, 1, 1, 1, 1]);
  const [rollsLeft, setRollsLeft] = useState(3);

  const rollDice = () => {
    if (rollsLeft > 0) {
      setDice(dice.map(() => rollDie()));
      setRollsLeft(rollsLeft - 1);
    }
  };

  const calculateScore = (type: 'ThreeOfAKind' | 'FourOfAKind') => {
    const counts: { [key: number]: number } = {};
    for (const die of dice) {
      counts[die] = (counts[die] || 0) + 1;
    }
    for (const count of Object.values(counts)) {
      if (type === 'ThreeOfAKind' && count >= 3) {
        return dice.reduce((acc, curr) => acc + curr, 0);
      }
      if (type === 'FourOfAKind' && count >= 4) {
        return dice.reduce((acc, curr) => acc + curr, 0);
      }
    }
    return 0;
  };

  return (
    <div className="App">
      <h1>Yahtzee!</h1>
      <button onClick={rollDice} disabled={rollsLeft <= 0}>
        Roll Dice (Rolls left: {rollsLeft})
      </button>
      <div>
        {dice.map((die, index) => (
          <span key={index} className="die">
            {die}
          </span>
        ))}
      </div>
      <h2>Scores</h2>
      <div>
        Three of a Kind: {calculateScore('ThreeOfAKind')}
      </div>
      <div>
        Four of a Kind: {calculateScore('FourOfAKind')}
      </div>
    </div>
  );
};

export default App;
