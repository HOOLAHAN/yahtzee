import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import '../../styles/tailwind.css';
import ScoreCard from './ScoreCard';
import ScoreFlash from './ScoreFlash';
import GameControlButtons from './GameControlButtons';
import ScoreDisplay from './ScoreDisplay';
import CategoryButtons from './CategoryButtons';
import DiceControl from './DiceControl';
import ScoresSection from './ScoresSection';

import { calculateCurrentCategoryScore, calculateMaximumScore } from '../../lib/scoreCalculator';
import { toggleHoldDie } from '../../lib/diceLogic';
import { resetGame, startNewRound } from '../../lib/gameControl';
import { ScoreEntry } from '../../lib/types';
import { getDieSize, printDocument } from '../../lib/utils';
import { useWindowSize } from '../../hooks/useWindowSize';
import { handleRollDice } from '../../lib/handleRollDice';
import { useAuth } from '../../context/AuthContext';

interface GameProps {
  initialDice?: number[];
  isTwoPlayer: boolean;
  setIsTwoPlayer: (isTwoPlayer: boolean) => void;
  testOverrideDice?: number[];
}

const Game: React.FC<GameProps> = ({ initialDice = [1, 1, 1, 1, 1], isTwoPlayer, setIsTwoPlayer, testOverrideDice }) => {
  const [dice, setDice] = useState(initialDice);
  const [heldDice, setHeldDice] = useState(new Set<number>());
  const [currentScore, setCurrentScore] = useState(0);
  const [player1ScoreHistory, setPlayer1ScoreHistory] = useState<ScoreEntry[]>([]);
  const [player2ScoreHistory, setPlayer2ScoreHistory] = useState<ScoreEntry[]>([]);
  const [rollsLeft, setRollsLeft] = useState(3);
  const [totalScore, setTotalScore] = useState(0);
  const [hasRolled, setHasRolled] = useState(false);
  const [player1UsedCategories, setPlayer1UsedCategories] = useState(new Set<string>());
  const [player2UsedCategories, setPlayer2UsedCategories] = useState(new Set<string>());
  const [shouldShake, setShouldShake] = useState(false);
  const [showScoreCard, setShowScoreCard] = useState(false);
  const [showFlash, setShowFlash] = useState(false);
  const [flashCategory, setFlashCategory] = useState('');
  const { isUserSignedIn } = useAuth();

  const windowSize = useWindowSize();
  const dieSize = getDieSize(windowSize);

  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [player1TotalScore, setPlayer1TotalScore] = useState(0);
  const [player2TotalScore, setPlayer2TotalScore] = useState(0);
  const [currentMobileScoreCard, setCurrentMobileScoreCard] = useState(currentPlayer);

  useEffect(() => {
    if (player1ScoreHistory.length > 0 || player2ScoreHistory.length > 0) {
      setShowScoreCard(true);
    } else {
      setShowScoreCard(false);
    }
  }, [player1ScoreHistory, player2ScoreHistory]);

  useEffect(() => {
    setCurrentMobileScoreCard(currentPlayer);
  }, [currentPlayer]);

  const handleStartNewRound = () => {
    startNewRound(
      setDice,
      setRollsLeft,
      setHeldDice,
      setCurrentScore,
      setHasRolled,
      initialDice
    );
    if (isTwoPlayer) {
      setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
    }
  };

  const handleResetGame = () => {
    resetGame(
      setDice, setRollsLeft, setHeldDice, setCurrentScore, 
      setPlayer1ScoreHistory, setPlayer2ScoreHistory,
      setHasRolled, setTotalScore,
      setPlayer1TotalScore, setPlayer2TotalScore,
      initialDice, setPlayer1UsedCategories, setPlayer2UsedCategories
    );
  };

  useEffect(() => {
    if (isTwoPlayer) {
      setTotalScore(currentPlayer === 1 ? player1TotalScore : player2TotalScore);
    }
  }, [currentPlayer, isTwoPlayer, player1TotalScore, player2TotalScore]);

  useEffect(() => {
    if (testOverrideDice && hasRolled) {
      setDice(testOverrideDice);
    }
  }, [testOverrideDice, hasRolled]);

  const updateScores = (newTotalScore: number) => {
    if (isTwoPlayer) {
      if (currentPlayer === 1) {
        setPlayer1TotalScore(newTotalScore);
      } else {
        setPlayer2TotalScore(newTotalScore);
      }
    } else {
      setTotalScore(newTotalScore);
    }
  };

  const getUsedCategories = () => {
    return currentPlayer === 1 ? player1UsedCategories : player2UsedCategories;
  };

  const setUsedCategories = (categories: Set<string> | ((prevCategories: Set<string>) => Set<string>)) => {
    if (currentPlayer === 1) {
      setPlayer1UsedCategories(categories as Set<string>);
    } else {
      setPlayer2UsedCategories(categories as Set<string>);
    }
  };

  const getUsedCategoryScores = () => {
    const currentHistory = currentPlayer === 1 ? player1ScoreHistory : player2ScoreHistory;
    const result: { [category: string]: number } = {};
    currentHistory.forEach(entry => {
      result[entry.category] = entry.roundScore;
    });
    return result;
  };

  const handlePrintDocument = () => {
    printDocument(isTwoPlayer);
  };

  const handleScoreLockIn = (category: string) => {
    setFlashCategory(category);
    setShowFlash(true);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start p-4 md:p-8 bg-deepBlack text-mintGlow">
      <h1 className="text-3xl font-bold text-neonYellow mb-4 animate-pulse-glow">
        {isTwoPlayer ? `Player ${currentPlayer}'s Turn` : 'Single Player'}
      </h1>
      <DiceControl
        dice={dice}
        heldDice={heldDice}
        toggleHoldDie={(index: number) => toggleHoldDie(index, heldDice, setHeldDice)}
        rollsLeft={rollsLeft}
        hasRolled={hasRolled}
        shouldShake={shouldShake}
        dieSize={dieSize}
        usedCategoriesSize={getUsedCategories().size}
        onRollDice={() => handleRollDice(rollsLeft, dice, heldDice, setShouldShake, setHasRolled, setDice, setRollsLeft, setCurrentScore)}
      />
      <ScoreDisplay
        currentScore={calculateMaximumScore(dice, hasRolled, getUsedCategories())}
        totalScore={isTwoPlayer ? (currentPlayer === 1 ? player1TotalScore : player2TotalScore) : totalScore}
      />
      {hasRolled && <h2 className="text-2xl text-neonYellow mb-2">Lock In Score:</h2>}
      <CategoryButtons
        dice={dice}
        hasRolled={hasRolled}
        usedCategories={getUsedCategories()}
        setUsedCategories={setUsedCategories}
        setTotalScore={updateScores as React.Dispatch<React.SetStateAction<number>>}
        totalScore={totalScore}
        setScoreHistory={currentPlayer === 1 ? setPlayer1ScoreHistory : setPlayer2ScoreHistory}
        scoreHistory={currentPlayer === 1 ? player1ScoreHistory : player2ScoreHistory}
        startNewRound={handleStartNewRound}
        setCurrentScore={setCurrentScore}
        setHasRolled={setHasRolled}
        setDice={setDice}
        setRollsLeft={setRollsLeft}
        setHeldDice={setHeldDice}
        initialDice={initialDice}
        currentScore={currentScore}
        calculateScoreFunction={calculateCurrentCategoryScore}
        handleScoreLockIn={handleScoreLockIn}
        setShowFlash={setShowFlash}
        isTwoPlayer={isTwoPlayer}
        currentPlayer={currentPlayer}
        player1TotalScore={player1TotalScore}
        player2TotalScore={player2TotalScore}
        setPlayer1TotalScore={setPlayer1TotalScore}
        setPlayer2TotalScore={setPlayer2TotalScore}
      />
      <ScoreFlash category={flashCategory} show={showFlash} onEnd={() => setShowFlash(false)} />
      {hasRolled && (
        <ScoresSection 
          dice={dice} 
          hasRolled={hasRolled}
          usedCategories={getUsedCategoryScores()} 
        />
      )}
      {showScoreCard && <h2 className="text-2xl text-neonYellow mb-2 mt-4">Score Card:</h2>}
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-8">
        {showScoreCard && (
          windowSize < 1050 ? (
            <div className="relative p-4 w-full">
              <ScoreCard
                player1ScoreHistory={player1ScoreHistory}
                player2ScoreHistory={player2ScoreHistory}
                player1TotalScore={player1TotalScore}
                player2TotalScore={player2TotalScore}
                currentPlayer={currentMobileScoreCard}
                isTwoPlayer={isTwoPlayer}
              />
              {isTwoPlayer && (
                <center>
                  <button
                    onClick={() => setCurrentMobileScoreCard(currentMobileScoreCard === 1 ? 2 : 1)}
                    className="mt-4 mx-auto text-deepBlack bg-neonCyan hover:bg-electricPink font-bold py-2 px-4 rounded-full w-20 transition duration-300 ease-in-out transform hover:scale-105"
                  >
                    <FontAwesomeIcon icon={currentMobileScoreCard === 1 ? faArrowRight : faArrowLeft} />
                  </button>
                </center>
              )}
            </div>
          ) : (
            <div className="flex w-full space-x-8">
              <div className="flex-1">
                <ScoreCard
                  player1ScoreHistory={player1ScoreHistory}
                  player2ScoreHistory={player2ScoreHistory}
                  player1TotalScore={player1TotalScore}
                  player2TotalScore={player2TotalScore}
                  currentPlayer={1}
                  isTwoPlayer={isTwoPlayer}
                />
              </div>
              {isTwoPlayer && (
                <div className="flex-1">
                  <ScoreCard
                    player1ScoreHistory={player1ScoreHistory}
                    player2ScoreHistory={player2ScoreHistory}
                    player1TotalScore={player1TotalScore}
                    player2TotalScore={player2TotalScore}
                    currentPlayer={2}
                    isTwoPlayer={isTwoPlayer}
                  />
                </div>
              )}
            </div>
          )
        )}
      </div>
      {isTwoPlayer && (
        <div className="flex space-x-8 mt-4">
          <div>
            <center><h2 className="text-xl text-neonCyan">Player 1 : {player1TotalScore}</h2></center>
          </div>
          <div>
            <center><h2 className="text-xl text-electricPink">Player 2 : {player2TotalScore}</h2></center>
          </div>
        </div>
      )}
      {(player1ScoreHistory.length > 0 || player2ScoreHistory.length > 0) && (
        <GameControlButtons
          onResetGame={handleResetGame}
          onPrintDocument={handlePrintDocument} 
          isMobile={windowSize < 640}
          totalScore={totalScore}
          usedCategories={getUsedCategories().size}
          isUserSignedIn={isUserSignedIn}
          isTwoPlayer={isTwoPlayer}
        />
      )}
    </div>
  );
};

export default Game;
