import { canLockInScore, lockInScore, resetGame, startNewRound } from '../functions/gameControl';
import { ScoreEntry } from '../functions/types';

describe("canLockInScore function", () => {
  it("should return false if not rolled", () => {
    expect(canLockInScore('ThreeOfAKind', false, new Set())).toBe(false);
  });

  it("should return false if category already used", () => {
    expect(canLockInScore('ThreeOfAKind', true, new Set(['ThreeOfAKind']))).toBe(false);
  });

  it("should return true otherwise", () => {
    expect(canLockInScore('ThreeOfAKind', true, new Set(['FourOfAKind']))).toBe(true);
  });
});

describe("lockInScore function", () => {
  const setFunctions = Array.from({ length: 17 }, () => jest.fn());

  const [
    setUsedCategories,
    setTotalScore,
    setScoreHistory,
    startNewRoundFn,
    setCurrentScore,
    setHasRolled,
    setDice,
    setRollsLeft,
    setHeldDice,
    setPlayer1TotalScore,
    setPlayer2TotalScore,
  ] = setFunctions;

  const initialDice = [1, 2, 3, 4, 5];
  const currentScore = 0;
  const totalScore = 100;
  const scoreHistory: ScoreEntry[] = [];
  const usedCategories = new Set<string>();

  const dice = [2, 3, 3, 3, 6];

  const calculateScoreFunction = jest.fn().mockReturnValue(9);

  it("should lock in a new score", () => {
    lockInScore(
      'ThreeOfAKind', 
      usedCategories, 
      setUsedCategories,
      dice, 
      setTotalScore, 
      totalScore, 
      setScoreHistory,
      scoreHistory, 
      startNewRoundFn, 
      setCurrentScore, 
      setHasRolled,
      setDice, 
      setRollsLeft, 
      setHeldDice, 
      initialDice, 
      currentScore, 
      calculateScoreFunction,
      false,   // isTwoPlayer
      1,       // currentPlayer
      0,       // player1TotalScore
      0,       // player2TotalScore
      setPlayer1TotalScore, 
      setPlayer2TotalScore
    );

    expect(setUsedCategories).toHaveBeenCalledWith(new Set(['ThreeOfAKind']));
    expect(setTotalScore).toHaveBeenCalledWith(totalScore + calculateScoreFunction());
    expect(setScoreHistory).toHaveBeenCalled();
    expect(startNewRoundFn).toHaveBeenCalled();
  });
});

describe("resetGame function", () => {
  const setFunctions = Array.from({ length: 13 }, () => jest.fn());
  const [
    setDice, 
    setRollsLeft, 
    setHeldDice, 
    setCurrentScore, 
    setPlayer1ScoreHistory, 
    setPlayer2ScoreHistory, 
    setHasRolled, 
    setTotalScore, 
    setPlayer1TotalScore, 
    setPlayer2TotalScore, 
    setPlayer1UsedCategories, 
    setPlayer2UsedCategories
  ] = setFunctions;
  const initialDice = [1, 2, 3, 4, 5];

  it("should reset game states", () => {
    resetGame(
      setDice, 
      setRollsLeft, 
      setHeldDice, 
      setCurrentScore, 
      setPlayer1ScoreHistory, 
      setPlayer2ScoreHistory, 
      setHasRolled, 
      setTotalScore, 
      setPlayer1TotalScore, 
      setPlayer2TotalScore, 
      initialDice, 
      setPlayer1UsedCategories, 
      setPlayer2UsedCategories
    );

    expect(setDice).toHaveBeenCalledWith(initialDice);
    expect(setRollsLeft).toHaveBeenCalledWith(3);
    expect(setHeldDice).toHaveBeenCalledWith(new Set());
    expect(setCurrentScore).toHaveBeenCalledWith(0);
    expect(setPlayer1ScoreHistory).toHaveBeenCalledWith([]);
    expect(setPlayer2ScoreHistory).toHaveBeenCalledWith([]);
    expect(setHasRolled).toHaveBeenCalledWith(false);
    expect(setTotalScore).toHaveBeenCalledWith(0);
    expect(setPlayer1TotalScore).toHaveBeenCalledWith(0);
    expect(setPlayer2TotalScore).toHaveBeenCalledWith(0);
    expect(setPlayer1UsedCategories).toHaveBeenCalledWith(new Set<string>());
    expect(setPlayer2UsedCategories).toHaveBeenCalledWith(new Set<string>());
  });
});

describe("startNewRound function", () => {
  const setFunctions = Array.from({ length: 6 }, () => jest.fn());
  const [setDice, setRollsLeft, setHeldDice, setCurrentScore, setHasRolled] = setFunctions;
  const initialDice = [1, 2, 3, 4, 5];

  it("should reset round states", () => {
    startNewRound(setDice, setRollsLeft, setHeldDice, setCurrentScore, setHasRolled, initialDice);

    expect(setDice).toHaveBeenCalledWith(initialDice);
    expect(setRollsLeft).toHaveBeenCalledWith(3);
    expect(setHeldDice).toHaveBeenCalledWith(new Set());
    expect(setCurrentScore).toHaveBeenCalledWith(0);
    expect(setHasRolled).toHaveBeenCalledWith(false);
  });
});
