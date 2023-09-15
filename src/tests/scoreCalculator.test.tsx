import {
  calculateFullHouse,
  calculateScore,
  calculateSumOfDice,
  calculateChance,
  isStraight,
  calculateNumberScore,
  calculateScoreFunction,
  calculateCurrentCategoryScore,
  calculateMaximumScore,
} from '../functions/scoreCalculator';

describe('scoreCalculator', () => {
  describe('calculateFullHouse', () => {
    it('should return 25 for a full house', () => {
      expect(calculateFullHouse([1, 1, 2, 2, 2])).toBe(25);
    });
    it('should return 0 for non-full houses', () => {
      expect(calculateFullHouse([1, 1, 2, 2, 3])).toBe(0);
    });
  });

  describe('calculateScore', () => {
    it('should calculate ThreeOfAKind correctly', () => {
      expect(calculateScore('ThreeOfAKind', [1, 1, 1, 4, 5])).toBe(12);
    });

    it('should calculate FourOfAKind correctly', () => {
      expect(calculateScore('FourOfAKind', [1, 1, 1, 1, 5])).toBe(9);
    });

    it('should calculate Yahtzee correctly', () => {
      expect(calculateScore('Yahtzee', [1, 1, 1, 1, 1])).toBe(50);
    });
  });

  describe('calculateSumOfDice', () => {
    it('should sum dice of a given target number', () => {
      expect(calculateSumOfDice([1, 2, 2, 3, 4], 2)).toBe(4);
    });
  });

  describe('calculateChance', () => {
    it('should sum up all dice', () => {
      expect(calculateChance([1, 2, 3, 4, 5])).toBe(15);
    });
  });

  describe('isStraight', () => {
    it('should detect a small straight', () => {
      expect(isStraight([1, 2, 3, 4, 6], 4)).toBe(true);
    });

    it('should detect a large straight', () => {
      expect(isStraight([1, 2, 3, 4, 5], 5)).toBe(true);
    });
  });

  describe('calculateNumberScore', () => {
    it('should calculate Ones correctly', () => {
      expect(calculateNumberScore('Ones', [1, 1, 2, 3, 4])).toBe(2);
    });
  });

  describe('calculateScoreFunction', () => {
    it('should delegate correctly', () => {
      expect(calculateScoreFunction('ThreeOfAKind', [1, 1, 1, 4, 5])).toBe(12);
      expect(calculateScoreFunction('Ones', [1, 1, 2, 3, 4])).toBe(2);
    });
  });

  describe('calculateCurrentCategoryScore', () => {
    it('should calculate current category score correctly', () => {
      expect(calculateCurrentCategoryScore('ThreeOfAKind', [1, 1, 1, 4, 5])).toBe(12);
    });
  });

  describe('calculateMaximumScore', () => {
    it('should calculate maximum possible score', () => {
      const usedCategories = new Set(['Ones']);
      expect(calculateMaximumScore([1, 1, 1, 4, 5], true, usedCategories)).toBe(12);
    });

    it('should return 0 if dice have not been rolled', () => {
      expect(calculateMaximumScore([1, 1, 1, 4, 5], false, new Set())).toBe(0);
    });
  });
});
