// types.tsx

export type Category = 'Ones' | 'Twos' | 'Threes' | 'Fours' | 'Fives' | 'Sixes' | 'ThreeOfAKind' | 'FourOfAKind' | 'Yahtzee' | 'FullHouse' | 'SmallStraight' | 'LargeStraight' | 'Chance';
export type DieFace = 1 | 2 | 3 | 4 | 5 | 6;

export interface ScoreEntry {
  dice: number[];
  category: Category;
  roundScore: number;
}

export type FontAwesomeSize =
  | 'xs' | 'lg' | 'sm'
  | '1x' | '2x' | '3x' | '4x' | '5x'
  | '6x' | '7x' | '8x' | '9x' | '10x';
