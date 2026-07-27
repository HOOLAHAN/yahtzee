import { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faArrowLeft, faList, faLock, faRotate } from '@fortawesome/free-solid-svg-icons';
import '../../styles/tailwind.css';
import ScoreCard from './ScoreCard';
import ScoreFlash from './ScoreFlash';
import GameControlButtons from './GameControlButtons';
import ScoreDisplay from './ScoreDisplay';
import CategoryButtons from './CategoryButtons';
import DiceControl from './DiceControl';

import { calculateCurrentCategoryScore, calculateMaximumScore } from '../../lib/scoreCalculator';
import { toggleHoldDie } from '../../lib/diceLogic';
import { lockInScore, resetGame, startNewRound } from '../../lib/gameControl';
import { Category, ScoreEntry } from '../../lib/types';
import { getDieSize } from '../../lib/utils';
import { useWindowSize } from '../../hooks/useWindowSize';
import { handleRollDice } from '../../lib/handleRollDice';
import { useAuth } from '../../context/AuthContext';

interface GameProps {
  initialDice?: number[];
  isTwoPlayer: boolean;
  setIsTwoPlayer: (isTwoPlayer: boolean) => void;
  testOverrideDice?: number[];
  isComputerOpponent?: boolean;
}

const defaultDice = [1, 1, 1, 1, 1];

const chooseComputerHolds = (computerDice: number[]) => {
  const counts = computerDice.reduce<Record<number, number>>((result, die) => ({ ...result, [die]: (result[die] || 0) + 1 }), {});
  const bestFace = Number(Object.keys(counts).sort((a, b) => counts[Number(b)] - counts[Number(a)] || Number(b) - Number(a))[0]);
  if (counts[bestFace] >= 2) return new Set(computerDice.map((die, index) => die === bestFace ? index : -1).filter((index) => index >= 0));
  const lowRun = [1,2,3,4,5]; const highRun = [2,3,4,5,6];
  const straightRun = lowRun.filter((face) => computerDice.includes(face)).length >= highRun.filter((face) => computerDice.includes(face)).length ? lowRun : highRun;
  const unique = new Set<number>();
  return new Set(computerDice.map((die, index) => straightRun.includes(die) && !unique.has(die) ? (unique.add(die), index) : -1).filter((index) => index >= 0));
};

const Game: React.FC<GameProps> = ({ initialDice = defaultDice, isTwoPlayer, setIsTwoPlayer, testOverrideDice, isComputerOpponent = false }) => {
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
  const [computerThinking, setComputerThinking] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const computerRunning = useRef(false);

  useEffect(() => {
    if (!isComputerOpponent || currentPlayer !== 2 || computerRunning.current || player2UsedCategories.size >= 13) return;
    let cancelled = false;
    const play = async () => {
      computerRunning.current = true; setComputerThinking(true);
      let computerDice = initialDice;
      let computerHeld = new Set<number>();
      for (let roll = 0; roll < 3; roll += 1) {
        // Keep each roll and decision visible so the opponent feels like it
        // is taking a turn rather than instantly calculating a result.
        await new Promise((resolve) => setTimeout(resolve, roll === 0 ? 700 : 900));
        if (!cancelled) setShouldShake(true);
        await new Promise((resolve) => setTimeout(resolve, 850));
        const nextDice = [...computerDice];
        for (let index = 0; index < nextDice.length; index += 1) {
          if (!computerHeld.has(index)) nextDice[index] = Math.floor(Math.random() * 6) + 1;
        }
        computerDice = nextDice;
        if (!cancelled) { setShouldShake(false); setDice(computerDice); setHeldDice(computerHeld); setHasRolled(true); setRollsLeft(2 - roll); }
        if (roll < 2) {
          computerHeld = chooseComputerHolds(computerDice);
          if (!cancelled) setHeldDice(computerHeld);
        }
      }
      if (cancelled) return;
      await new Promise((resolve) => setTimeout(resolve, 1100));
      if (cancelled) return;
      const available = (['Ones','Twos','Threes','Fours','Fives','Sixes','ThreeOfAKind','FourOfAKind','FullHouse','SmallStraight','LargeStraight','Yahtzee','Chance'] as const).filter((category) => !player2UsedCategories.has(category));
      const category = available.reduce((best, candidate) => calculateCurrentCategoryScore(candidate, computerDice) > calculateCurrentCategoryScore(best, computerDice) ? candidate : best);
      const points = calculateCurrentCategoryScore(category, computerDice);
      setPlayer2UsedCategories((used) => new Set(used).add(category));
      setPlayer2ScoreHistory((history) => [...history, { category, dice: computerDice, roundScore: points }]);
      setPlayer2TotalScore((value) => value + points);
      setFlashCategory(category); setShowFlash(true);
      startNewRound(setDice, setRollsLeft, setHeldDice, setCurrentScore, setHasRolled, initialDice);
      setCurrentPlayer(1); computerRunning.current = false; setComputerThinking(false);
    };
    void play();
    return () => { cancelled = true; setShouldShake(false); };
  }, [currentPlayer, initialDice, isComputerOpponent, player2UsedCategories]);

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
    setSelectedCategory(null); setShowScoreCard(false);
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

  const handleScoreLockIn = (category: string) => {
    setFlashCategory(category);
    setShowFlash(true);
  };

  const handleConfirmScore = () => {
    if (!selectedCategory) return;
    lockInScore(selectedCategory, getUsedCategories(), setUsedCategories, dice, updateScores as React.Dispatch<React.SetStateAction<number>>, totalScore, currentPlayer === 1 ? setPlayer1ScoreHistory : setPlayer2ScoreHistory, currentPlayer === 1 ? player1ScoreHistory : player2ScoreHistory, handleStartNewRound, setCurrentScore, setHasRolled, setDice, setRollsLeft, setHeldDice, initialDice, currentScore, calculateCurrentCategoryScore, isTwoPlayer, currentPlayer, player1TotalScore, player2TotalScore, setPlayer1TotalScore, setPlayer2TotalScore);
    handleScoreLockIn(selectedCategory); setSelectedCategory(null);
  };

  const currentTotal = isTwoPlayer ? (currentPlayer === 1 ? player1TotalScore : player2TotalScore) : totalScore;
  const round = Math.min(getUsedCategories().size + 1, 13);

  return (
    <div className="mx-auto min-h-screen w-full max-w-6xl bg-deepBlack px-4 py-5 text-mintGlow md:px-8">
      <div className="web-game-heading"><div><h1
        className={`text-3xl font-black animate-pulse-glow ${
          isTwoPlayer
            ? currentPlayer === 1
              ? 'text-neonCyan'
              : 'text-electricPink'
            : 'text-neonYellow'
        }`}
      >
        {isComputerOpponent ? (currentPlayer === 1 ? 'Your Turn' : 'Computer’s Turn') : isTwoPlayer ? `Player ${currentPlayer}'s Turn` : 'Single Player'}
      </h1><p>Round {round} of 13{computerThinking ? ' · Computer is thinking' : ''}</p></div><button onClick={() => setShowScoreCard(true)} className="scorecard-trigger"><FontAwesomeIcon icon={faList} /> Scorecard</button></div>
      <section className="web-play-panel">
      <DiceControl
        dice={dice}
        heldDice={heldDice}
        toggleHoldDie={(index: number) => !computerThinking && toggleHoldDie(index, heldDice, setHeldDice)}
        rollsLeft={rollsLeft}
        hasRolled={hasRolled}
        shouldShake={shouldShake}
        dieSize={dieSize}
        usedCategoriesSize={getUsedCategories().size}
        onRollDice={() => !computerThinking && handleRollDice(rollsLeft, dice, heldDice, setShouldShake, setHasRolled, setDice, setRollsLeft, setCurrentScore)}
      />
      <ScoreDisplay
        currentScore={calculateMaximumScore(dice, hasRolled, getUsedCategories())}
        totalScore={currentTotal}
      />
      </section>
      <div className="category-heading"><div><h2>Choose a category</h2><p>{hasRolled ? 'Tap once to preview, then lock it in.' : 'Categories unlock after your first roll.'}</p></div><span>13 categories</span></div>
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
        showAll
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />
      <ScoreFlash category={flashCategory} show={showFlash} onEnd={() => setShowFlash(false)} />
      {selectedCategory && <div className="web-lock-bar"><div><small>{selectedCategory.replace(/([A-Z])/g, ' $1').trim()}</small><strong>{calculateCurrentCategoryScore(selectedCategory, dice)} points</strong></div><button onClick={handleConfirmScore}><FontAwesomeIcon icon={faLock} /> Lock In</button></div>}
      {showScoreCard && <div className="fixed inset-0 z-50 bg-black/80 p-3 backdrop-blur-sm sm:p-6" onClick={() => setShowScoreCard(false)}><section className="scorecard-modal" onClick={(event) => event.stopPropagation()}><div className="scorecard-modal-header"><div><p className="eyebrow">Round {round} of 13</p><h2>Scorecard</h2></div><button onClick={() => setShowScoreCard(false)} aria-label="Close scorecard">&times;</button></div><div className="overflow-y-auto px-4 pb-6 sm:px-6">
        {(
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
      </div></section></div>}
      {isTwoPlayer && (
        <div className="web-player-totals">
          <span>You <strong>{player1TotalScore}</strong></span><span>{isComputerOpponent ? 'Computer' : 'Player 2'} <strong>{player2TotalScore}</strong></span>
        </div>
      )}
      {(player1ScoreHistory.length > 0 || player2ScoreHistory.length > 0) && (
        <GameControlButtons
          isMobile={windowSize < 640}
          totalScore={totalScore}
          usedCategories={getUsedCategories().size}
          isUserSignedIn={isUserSignedIn}
          isTwoPlayer={isTwoPlayer}
          allowScoreSubmission={!isTwoPlayer || isComputerOpponent}
          gameComplete={player1UsedCategories.size === 13 && (!isTwoPlayer || player2UsedCategories.size === 13)}
        />
      )}
      {(player1ScoreHistory.length > 0 || player2ScoreHistory.length > 0) && <button onClick={handleResetGame} className="web-reset"><FontAwesomeIcon icon={faRotate} /> Reset game</button>}
    </div>
  );
};

export default Game;
