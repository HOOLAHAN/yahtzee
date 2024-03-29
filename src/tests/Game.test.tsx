import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Game from '../components/Game';
import * as AuthContext from '../context/AuthContext';

HTMLCanvasElement.prototype.getContext = jest.fn();

jest.mock('jspdf', () => {
  return function() {
  };
});

// Explicitly mock useAuth with jest.fn()
jest.mock('../context/AuthContext', () => ({
  useAuth: jest.fn(),
}));

test('initial roll count is 3', () => {
  (AuthContext.useAuth as jest.Mock).mockImplementation(() => ({
    isUserSignedIn: true,
    userDetails: { preferred_username: 'testuser' },
  }));

  render(<Game />);
  const rollButton = screen.getByText(/Roll Dice/i);
  expect(rollButton).toHaveTextContent('Roll Dice (Rolls left: 3)');
});

test('score for Three of a Kind starts at 0', () => {
  (AuthContext.useAuth as jest.Mock).mockImplementation(() => ({
    isUserSignedIn: true,
    userDetails: { preferred_username: 'testuser' },
  }));

  // Render the component with an initial dice array
  render(<Game initialDice={[1, 1, 2, 3, 4]} />);

  // Use getAllByText to get all elements containing the text "Three of a Kind"
  const allThreeOfAKindScores = screen.getAllByText(/Three of a Kind/i);

  // Filter out the element that contains the specific text we're looking for
  const threeOfAKindScore = allThreeOfAKindScores.find(el => el.textContent === 'Three of a Kind: 0');

  // Ensure the element is not null and contains the correct text
  expect(threeOfAKindScore).not.toBeNull();
  expect(threeOfAKindScore).toHaveTextContent('Three of a Kind: 0');
});

test('score for Four of a Kind starts at 0', () => {
  (AuthContext.useAuth as jest.Mock).mockImplementation(() => ({
    isUserSignedIn: true,
    userDetails: { preferred_username: 'testuser' },
  }));

  // Render the component with an initial dice array
  render(<Game initialDice={[1, 1, 2, 3, 4]} />);

  // Use getAllByText to get all elements containing the text "Four of a Kind"
  const allFourOfAKindScores = screen.getAllByText(/Four of a Kind/i);

  // Filter out the element that contains the specific text we're looking for
  const fourOfAKindScore = allFourOfAKindScores.find(el => el.textContent === 'Four of a Kind: 0');

  // Ensure the element is not null and contains the correct text
  expect(fourOfAKindScore).not.toBeNull();
  expect(fourOfAKindScore).toHaveTextContent('Four of a Kind: 0');
});

test('initial Full House score starts at 0', () => {
  (AuthContext.useAuth as jest.Mock).mockImplementation(() => ({
    isUserSignedIn: true,
    userDetails: { preferred_username: 'testuser' },
  }));

  // Render the component with an initial dice array
  render(<Game initialDice={[1, 1, 2, 3, 4]} />);

  // Use getAllByText to get all elements containing the text "Full House"
  const allFullHouseScores = screen.getAllByText(/Full House/i);

  // Filter out the element that contains the specific text we're looking for
  const fullHouseScore = allFullHouseScores.find(el => el.textContent === 'Full House: 0');

  // Ensure the element is not null and contains the correct text
  expect(fullHouseScore).not.toBeNull();
  expect(fullHouseScore).toHaveTextContent('Full House: 0');
});

test('holding dice functionality', async () => {
  (AuthContext.useAuth as jest.Mock).mockImplementation(() => ({
    isUserSignedIn: true,
    userDetails: { preferred_username: 'testuser' },
  }));

  render(<Game initialDice={[1, 2, 3, 4, 5]} />);

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
    expect(diceElements[0]).toHaveClass('transition-colors duration-300 ease-in-out flex items-center justify-center m-2 md:m-4 lg:m-6 cursor-pointer');
  });
});

test('calculate Full House score with invalid dice', () => {
  (AuthContext.useAuth as jest.Mock).mockImplementation(() => ({
    isUserSignedIn: true,
    userDetails: { preferred_username: 'testuser' },
  }));

  // Render the component with initial dice array
  render(<Game initialDice={[1, 1, 1, 1, 1]} />);

  // Use getAllByText to get all elements containing the text "Full House"
  const allFullHouseScores = screen.getAllByText(/Full House/i);

  // Filter out the element that contains the specific text we're looking for
  const fullHouseScore = allFullHouseScores.find(el => el.textContent === 'Full House: 0');

  // Ensure the element is not null and contains the correct text
  expect(fullHouseScore).not.toBeNull();
  expect(fullHouseScore).toHaveTextContent('Full House: 0');
});

test('calculate Small Straight score with invalid dice', () => {
  (AuthContext.useAuth as jest.Mock).mockImplementation(() => ({
    isUserSignedIn: true,
    userDetails: { preferred_username: 'testuser' },
  }));

  render(<Game initialDice={[1, 1, 1, 2, 2]} />);
  expect(screen.getByText(/Small Straight: 0/)).toBeInTheDocument();
});

test('calculate Large Straight score with invalid dice', () => {
  (AuthContext.useAuth as jest.Mock).mockImplementation(() => ({
    isUserSignedIn: true,
    userDetails: { preferred_username: 'testuser' },
  }));

  render(<Game initialDice={[1, 2, 3, 3, 5]} />);
  expect(screen.getByText(/Large Straight: 0/)).toBeInTheDocument();
});

test('calculate Yahtzee score with invalid dice', () => {
  (AuthContext.useAuth as jest.Mock).mockImplementation(() => ({
    isUserSignedIn: true,
    userDetails: { preferred_username: 'testuser' },
  }));
  
  render(<Game initialDice={[1, 1, 2, 2, 2]} />);
  expect(screen.getByText(/Yahtzee: 0/)).toBeInTheDocument();
});