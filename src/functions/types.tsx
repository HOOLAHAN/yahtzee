// types.tsx

export type Category = 'Placeholder' | 'One' | 'Two' | 'Three' | 'Four' | 'Five' | 'Six' | 'ThreeOfAKind' | 'FourOfAKind' | 'Yahtzee' | 'FullHouse' | 'SmallStraight' | 'LargeStraight' | 'Chance';
export type DieFace = 1 | 2 | 3 | 4 | 5 | 6;

export interface ScoreEntry {
  dice: number[];
  category: Category;
  roundScore: number;
}
