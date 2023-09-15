import { rollDie, rollDice, toggleHoldDie } from "../functions/diceLogic";

describe("rollDie function", () => {
  it("should return a number between 1 and 6", () => {
    const die = rollDie();
    expect(die).toBeGreaterThanOrEqual(1);
    expect(die).toBeLessThanOrEqual(6);
  });
});

describe("rollDice function", () => {
  let setHasRolled = jest.fn();
  let setDice = jest.fn();
  let setRollsLeft = jest.fn();
  let setCurrentScore = jest.fn();

  it("should not roll dice if no rolls left", () => {
    rollDice(0, [1, 1, 1, 1, 1], new Set(), setHasRolled, setDice, setRollsLeft, setCurrentScore);
    expect(setDice).not.toHaveBeenCalled();
  });

  it("should roll dice and update states if rolls left", () => {
    rollDice(1, [1, 1, 1, 1, 1], new Set(), setHasRolled, setDice, setRollsLeft, setCurrentScore);
    
    expect(setHasRolled).toHaveBeenCalledWith(true);
    expect(setRollsLeft).toHaveBeenCalledWith(0);
    expect(setDice).toHaveBeenCalled();
    expect(setCurrentScore).toHaveBeenCalled();
  });
});

describe("toggleHoldDie function", () => {
  let setHeldDice = jest.fn();

  it("should add die to hold if not already held", () => {
    const heldDice = new Set([1, 2]);
    toggleHoldDie(3, heldDice, setHeldDice);
    expect(setHeldDice).toHaveBeenCalledWith(new Set([1, 2, 3]));
  });

  it("should remove die from hold if already held", () => {
    const heldDice = new Set([1, 2, 3]);
    toggleHoldDie(3, heldDice, setHeldDice);
    expect(setHeldDice).toHaveBeenCalledWith(new Set([1, 2]));
  });
});
