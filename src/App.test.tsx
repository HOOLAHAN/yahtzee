import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
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
  // Render the component with an initial dice array
  render(<App initialDice={[1, 1, 2, 3, 4]} />);

  // Use getAllByText to get all elements containing the text "Three of a Kind"
  const allThreeOfAKindScores = screen.getAllByText(/Three of a Kind/i);

  // Filter out the element that contains the specific text we're looking for
  const threeOfAKindScore = allThreeOfAKindScores.find(el => el.textContent === 'Three of a Kind: 0');

  // Ensure the element is not null and contains the correct text
  expect(threeOfAKindScore).not.toBeNull();
  expect(threeOfAKindScore).toHaveTextContent('Three of a Kind: 0');
});

test('score for Four of a Kind starts at 0', () => {
  // Render the component with an initial dice array
  render(<App initialDice={[1, 1, 2, 3, 4]} />);

  // Use getAllByText to get all elements containing the text "Four of a Kind"
  const allFourOfAKindScores = screen.getAllByText(/Four of a Kind/i);

  // Filter out the element that contains the specific text we're looking for
  const fourOfAKindScore = allFourOfAKindScores.find(el => el.textContent === 'Four of a Kind: 0');

  // Ensure the element is not null and contains the correct text
  expect(fourOfAKindScore).not.toBeNull();
  expect(fourOfAKindScore).toHaveTextContent('Four of a Kind: 0');
});

test('initial Full House score starts at 0', () => {
  // Render the component with an initial dice array
  render(<App initialDice={[1, 1, 2, 3, 4]} />);

  // Use getAllByText to get all elements containing the text "Full House"
  const allFullHouseScores = screen.getAllByText(/Full House/i);

  // Filter out the element that contains the specific text we're looking for
  const fullHouseScore = allFullHouseScores.find(el => el.textContent === 'Full House: 0');

  // Ensure the element is not null and contains the correct text
  expect(fullHouseScore).not.toBeNull();
  expect(fullHouseScore).toHaveTextContent('Full House: 0');
});

test('holding dice functionality', async () => {
  render(<App initialDice={[1, 2, 3, 4, 5]} />);

  // Simulate an initial roll
  const rollButton = screen.getByText(/Roll Dice/i);
  fireEvent.click(rollButton);

  // Check that dice are clickable (can be held)
  const diceElements = screen.getAllByRole('button', { name: /^([1-6])$/ }); // Assumes that the dice have role="button" and their names are the numbers 1-6
  expect(diceElements.length).toBe(5);

  // Click a die to hold it
  fireEvent.click(diceElements[0]);

  // Wait for the class to be added
  await waitFor(() => {
    expect(diceElements[0]).toHaveClass('transition-colors duration-300 ease-in-out flex items-center justify-center h-16 w-16 cursor-pointer');
  });
});

test('calculate Full House score with invalid dice', () => {
  // Render the component with initial dice array
  render(<App initialDice={[1, 1, 1, 1, 1]} />);

  // Use getAllByText to get all elements containing the text "Full House"
  const allFullHouseScores = screen.getAllByText(/Full House/i);

  // Filter out the element that contains the specific text we're looking for
  const fullHouseScore = allFullHouseScores.find(el => el.textContent === 'Full House: 0');

  // Ensure the element is not null and contains the correct text
  expect(fullHouseScore).not.toBeNull();
  expect(fullHouseScore).toHaveTextContent('Full House: 0');
});

test('game reset functionality', async () => {
  // 1. Render the App component with some initial dice values
  render(<App initialDice={[1, 3, 2, 5, 6]} />);
  
  // Check the initial state
  let rollButton = screen.getByText(/Roll Dice/i);
  expect(rollButton).toHaveTextContent('Roll Dice (Rolls left: 3)');
  
  // Simulate rolling the dice once
  fireEvent.click(rollButton);

  // Check if the roll count decreases
  rollButton = screen.getByText(/Roll Dice/i);
  await waitFor(() => {
    expect(screen.getByText(/Roll Dice/i)).toHaveTextContent('Roll Dice (Rolls left: 2)');
  });
  
  // 2. Click the "Reset Game" button
  const resetButton = screen.getByText(/Reset Game/i);
  fireEvent.click(resetButton);

  // 3. Check if the game state is reset
  rollButton = screen.getByText(/Roll Dice/i);
  expect(rollButton).toHaveTextContent('Roll Dice (Rolls left: 3)');

});

test('calculate Small Straight score with invalid dice', () => {
  render(<App initialDice={[1, 1, 1, 2, 2]} />);
  expect(screen.getByText(/Small Straight: 0/)).toBeInTheDocument();
});

test('calculate Large Straight score with invalid dice', () => {
  render(<App initialDice={[1, 2, 3, 3, 5]} />);
  expect(screen.getByText(/Large Straight: 0/)).toBeInTheDocument();
});

test('calculate Yahtzee score with invalid dice', () => {
  render(<App initialDice={[1, 1, 2, 2, 2]} />);
  expect(screen.getByText(/Yahtzee: 0/)).toBeInTheDocument();
});
