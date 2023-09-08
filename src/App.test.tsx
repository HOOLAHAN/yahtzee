import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

test('renders Yahtzee title', () => {
  render(<App />);
  const titleElement = screen.getByText(/Yahtzee!/i);
  expect(titleElement).toBeInTheDocument();
});

test('initial roll count is 3', () => {
  render(<App />);
  const rollButton = screen.getByText(/Roll Dice/i);
  expect(rollButton).toHaveTextContent('Roll Dice (Rolls left: 3)');
});

test('score for Three of a Kind starts at 0', () => {
  render(<App initialDice={[1, 1, 2, 3, 4]} />);
  const threeOfAKindScore = screen.getByText(/Three of a Kind/i);
  expect(threeOfAKindScore).toHaveTextContent('Three of a Kind: 0');
});

test('score for Four of a Kind starts at 0', () => {
  render(<App initialDice={[1, 1, 2, 3, 4]} />);
  const fourOfAKindScore = screen.getByText(/Four of a Kind/i);
  expect(fourOfAKindScore).toHaveTextContent('Four of a Kind: 0');
});