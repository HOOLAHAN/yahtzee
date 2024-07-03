import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Game from '../components/Game';
import * as AuthContext from '../context/AuthContext';

HTMLCanvasElement.prototype.getContext = jest.fn();

jest.mock('jspdf', () => {
  return function () {};
});

jest.mock('../context/AuthContext', () => ({
  useAuth: jest.fn(),
}));

test('initial roll count is 3', () => {
  (AuthContext.useAuth as jest.Mock).mockImplementation(() => ({
    isUserSignedIn: true,
    userDetails: { preferred_username: 'testuser' },
  }));

  render(<Game isTwoPlayer={false} />);
  const rollButton = screen.getByText(/Roll Dice/i);
  expect(rollButton).toHaveTextContent('Roll Dice (Rolls left: 3)');
});

test('score for Three of a Kind starts at 0', async () => {
  (AuthContext.useAuth as jest.Mock).mockImplementation(() => ({
    isUserSignedIn: true,
    userDetails: { preferred_username: 'testuser' },
  }));

  render(<Game initialDice={[1, 1, 2, 2, 3]} isTwoPlayer={false} />);

  fireEvent.click(screen.getByText(/Roll Dice/i));

  expect(await screen.findByText(/Three of a Kind:/i)).toBeInTheDocument();
  expect(await screen.findByText(/Three of a Kind:/i)).toHaveTextContent('0');
});

test('score for Four of a Kind starts at 0', async () => {
  (AuthContext.useAuth as jest.Mock).mockImplementation(() => ({
    isUserSignedIn: true,
    userDetails: { preferred_username: 'testuser' },
  }));

  render(<Game initialDice={[1, 1, 2, 3, 4]} isTwoPlayer={false} />);

  fireEvent.click(screen.getByText(/Roll Dice/i));

  expect(await screen.findByText(/Four of a Kind:/i)).toBeInTheDocument();
  expect(await screen.findByText(/Four of a Kind:/i)).toHaveTextContent('0');
});

test('initial Full House score starts at 0', async () => {
  (AuthContext.useAuth as jest.Mock).mockImplementation(() => ({
    isUserSignedIn: true,
    userDetails: { preferred_username: 'testuser' },
  }));

  render(<Game initialDice={[1, 1, 2, 3, 4]} isTwoPlayer={false} />);

  fireEvent.click(screen.getByText(/Roll Dice/i));

  expect(await screen.findByText(/Full House:/i)).toBeInTheDocument();
  expect(await screen.findByText(/Full House:/i)).toHaveTextContent('0');
});

test('holding dice functionality', async () => {
  (AuthContext.useAuth as jest.Mock).mockImplementation(() => ({
    isUserSignedIn: true,
    userDetails: { preferred_username: 'testuser' },
  }));

  render(<Game initialDice={[1, 2, 3, 4, 5]} isTwoPlayer={false} />);

  // Simulate an initial roll
  const rollButton = screen.getByText(/Roll Dice/i);
  fireEvent.click(rollButton);

  // Check that dice are clickable (can be held)
  const diceElements = await screen.findAllByRole('button', { name: /^([1-6])$/ });
  expect(diceElements.length).toBe(5);

  // Click a die to hold it
  fireEvent.click(diceElements[0]);

  // Wait for the class to be added and verify the color style change
  await waitFor(() => {
    const heldDiceElement = screen.getByRole('button', { name: `${diceElements[0].getAttribute('aria-label')}` });
    expect(heldDiceElement).toHaveClass('cursor-pointer');
  });
});

test('calculate Full House score with invalid dice', async () => {
  (AuthContext.useAuth as jest.Mock).mockImplementation(() => ({
    isUserSignedIn: true,
    userDetails: { preferred_username: 'testuser' },
  }));

  render(<Game initialDice={[1, 1, 1, 1, 1]} isTwoPlayer={false} />);

  fireEvent.click(screen.getByText(/Roll Dice/i));

  expect(await screen.findByText(/Full House:/i)).toBeInTheDocument();
  expect(await screen.findByText(/Full House:/i)).toHaveTextContent('0');
});

test('calculate Small Straight score with invalid dice', async () => {
  (AuthContext.useAuth as jest.Mock).mockImplementation(() => ({
    isUserSignedIn: true,
    userDetails: { preferred_username: 'testuser' },
  }));

  render(<Game initialDice={[1, 1, 1, 2, 2]} isTwoPlayer={false} />);

  fireEvent.click(screen.getByText(/Roll Dice/i));

  expect(await screen.findByText(/Small Straight:/i)).toBeInTheDocument();
  expect(await screen.findByText(/Small Straight:/i)).toHaveTextContent('0');
});

test('calculate Large Straight score with invalid dice', async () => {
  (AuthContext.useAuth as jest.Mock).mockImplementation(() => ({
    isUserSignedIn: true,
    userDetails: { preferred_username: 'testuser' },
  }));

  render(<Game initialDice={[1, 2, 3, 3, 5]} isTwoPlayer={false} />);

  fireEvent.click(screen.getByText(/Roll Dice/i));

  expect(await screen.findByText(/Large Straight:/i)).toBeInTheDocument();
  expect(await screen.findByText(/Large Straight:/i)).toHaveTextContent('0');
});

test('calculate Yahtzee score with invalid dice', async () => {
  (AuthContext.useAuth as jest.Mock).mockImplementation(() => ({
    isUserSignedIn: true,
    userDetails: { preferred_username: 'testuser' },
  }));

  render(<Game initialDice={[1, 1, 2, 2, 2]} isTwoPlayer={false} />);

  fireEvent.click(screen.getByText(/Roll Dice/i));

  expect(await screen.findByText(/Yahtzee:/i)).toBeInTheDocument();
  expect(await screen.findByText(/Yahtzee:/i)).toHaveTextContent('0');
});
