// Game.tsx

import { useState, useEffect } from 'react';
import '../tailwind.css';
import ScoreCard from './ScoreCard';
import ScoreFlash from './ScoreFlash';
import GameControlButtons from './GameControlButtons';
import ScoreDisplay from './ScoreDisplay';
import CategoryButtons from './CategoryButtons';
import DiceControl from './DiceControl';
import ScoresSection from './ScoresSection';
import CreateScoreButton from './CreateScoreButton';

import { calculateCurrentCategoryScore, calculateMaximumScore } from '../functions/scoreCalculator';
import { toggleHoldDie } from '../functions/diceLogic';
import { resetGame, startNewRound } from '../functions/gameControl';
import { ScoreEntry } from '../functions/types';
import { getDieSize, printDocument } from '../functions/utils';
import { useWindowSize } from '../hooks/useWindowSize';
import { handleRollDice } from '../functions/handleRollDice';

const Game = ({ initialDice = [1, 1, 1, 1, 1] }) => {
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

  useEffect(() => {
    if (scoreHistory.length > 0) {
      setShowScoreCard(true);
    } else {
      setShowScoreCard(false);
    }
  }, [scoreHistory]);

  const handleStartNewRound = () => {
    startNewRound(
      setDice, 
      setRollsLeft, 
      setHeldDice, 
      setCurrentScore, 
      setHasRolled, 
      setTotalScore, 
      initialDice, 
      totalScore, 
      currentScore
    );
  };

  return (
    <div className="bg-gray-200 min-h-screen flex flex-col items-center justify-start p-4 md:p-8">
      <DiceControl
        dice={dice}
        heldDice={heldDice}
        toggleHoldDie={(index: number) => toggleHoldDie(index, heldDice, setHeldDice)}
        rollsLeft={rollsLeft}
        hasRolled={hasRolled}
        shouldShake={shouldShake}
        dieSize={dieSize}
        usedCategoriesSize={usedCategories.size}
        onRollDice={() => handleRollDice(rollsLeft, dice, heldDice, setShouldShake, setHasRolled, setDice, setRollsLeft, setCurrentScore)}
      />
      <ScoreDisplay
        currentScore={calculateMaximumScore(dice, hasRolled, usedCategories)}
        totalScore={totalScore}
      />
      { hasRolled && <h2 className="text-2xl mb-2">Lock In Score:</h2> }
      <CategoryButtons
        dice={dice}
        hasRolled={hasRolled}
        usedCategories={usedCategories}
        setUsedCategories={setUsedCategories}
        setTotalScore={setTotalScore}
        totalScore={totalScore}
        setScoreHistory={setScoreHistory}
        scoreHistory={scoreHistory}
        startNewRound={handleStartNewRound}
        setCurrentScore={setCurrentScore}
        setHasRolled={setHasRolled}
        setDice={setDice}
        setRollsLeft={setRollsLeft}
        setHeldDice={setHeldDice}
        initialDice={initialDice}
        currentScore={currentScore}
        calculateScoreFunction={calculateCurrentCategoryScore}
        setFlashCategory={setFlashCategory}
        setShowFlash={setShowFlash}
      />
      <ScoreFlash category={flashCategory} show={showFlash} onEnd={() => setShowFlash(false)} />
      <ScoresSection dice={dice} hasRolled={hasRolled} />
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
    <CreateScoreButton score={totalScore} />
    </div>
  )
}

export default Game;
