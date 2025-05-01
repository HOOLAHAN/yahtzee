// types.tsx

export type Category = 'Ones' | 'Twos' | 'Threes' | 'Fours' | 'Fives' | 'Sixes' | 'ThreeOfAKind' | 'FourOfAKind' | 'Yahtzee' | 'FullHouse' | 'SmallStraight' | 'LargeStraight' | 'Chance';
export type DieFace = 1 | 2 | 3 | 4 | 5 | 6;

export interface ScoreEntry {
  dice: number[];
  category: Category;
  roundScore: number;
}
