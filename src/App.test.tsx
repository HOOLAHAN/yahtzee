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


test('holding dice functionality', async () => {
  render(<App initialDice={[1, 1, 1, 2, 2]} />);
  
  // Simulate the clicking of the Roll Dice button to trigger the rendering of checkboxes
  fireEvent.click(screen.getByText(/Roll Dice/));

  // Wait for checkboxes to appear and then proceed with test
  const checkboxes = await screen.findAllByRole('checkbox');

  // Make sure 5 checkboxes are rendered (or however many you expect)
  expect(checkboxes.length).toBe(5);

  // Clicking a checkbox should toggle its checked status
  fireEvent.click(checkboxes[0]);
  expect(checkboxes[0]).toBeChecked();

  fireEvent.click(checkboxes[0]);
  expect(checkboxes[0]).not.toBeChecked();
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

test('game reset functionality', () => {
  // 1. Render the App component with some initial dice values
  render(<App initialDice={[2, 3, 2, 5, 6]} />);
  
  // Check the initial state
  let rollButton = screen.getByText(/Roll Dice/i);
  expect(rollButton).toHaveTextContent('Roll Dice (Rolls left: 3)');
  
  // Simulate rolling the dice once
  fireEvent.click(rollButton);

  // Check if the roll count decreases
  rollButton = screen.getByText(/Roll Dice/i);
  expect(rollButton).toHaveTextContent('Roll Dice (Rolls left: 2)');
  
  // 2. Click the "Reset Game" button
  const resetButton = screen.getByText(/Reset Game/i);
  fireEvent.click(resetButton);

  // 3. Check if the game state is reset
  rollButton = screen.getByText(/Roll Dice/i);
  expect(rollButton).toHaveTextContent('Roll Dice (Rolls left: 3)');

});
