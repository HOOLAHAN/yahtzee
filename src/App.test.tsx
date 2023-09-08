import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
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

test('initial Full House score starts at 0', () => {
  render(<App initialDice={[1, 1, 2, 3, 4]} />);
  const fullHouseScore = screen.getByText(/Full House/i);
  expect(fullHouseScore).toHaveTextContent('Full House: 0');
});

test('holding dice functionality', () => {
  render(<App initialDice={[1, 1, 1, 2, 2]} />);
  const firstDieCheckbox = screen.getAllByRole('checkbox')[0];
  const secondDieCheckbox = screen.getAllByRole('checkbox')[1];
  
  // Ensure checkboxes are initially unchecked
  expect(firstDieCheckbox).not.toBeChecked();
  expect(secondDieCheckbox).not.toBeChecked();

  // Check the first and second dice
  fireEvent.click(firstDieCheckbox);
  fireEvent.click(secondDieCheckbox);

  expect(firstDieCheckbox).toBeChecked();
  expect(secondDieCheckbox).toBeChecked();
});

test('calculate Full House score with valid dice', () => {
  render(<App initialDice={[1, 1, 1, 2, 2]} />);
  const fullHouseScore = screen.getByText(/Full House/i);
  expect(fullHouseScore).toHaveTextContent('Full House: 7');
});

test('calculate Full House score with invalid dice', () => {
  render(<App initialDice={[1, 1, 1, 1, 1]} />);
  const fullHouseScore = screen.getByText(/Full House/i);
  expect(fullHouseScore).toHaveTextContent('Full House: 0');
});