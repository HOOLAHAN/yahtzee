import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Game from '../components/game/Game';
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

  const setIsTwoPlayer = jest.fn();
  render(<Game isTwoPlayer={false} setIsTwoPlayer={setIsTwoPlayer} />);
  const rollButton = screen.getByText(/Roll Dice/i);
  expect(rollButton).toHaveTextContent('🎲 Roll Dice (3 left)');
});

test('score for Three of a Kind starts at 0 with known non-scoring dice', async () => {
  (AuthContext.useAuth as jest.Mock).mockImplementation(() => ({
    isUserSignedIn: true,
    userDetails: { preferred_username: 'testuser' },
  }));

  const setIsTwoPlayer = jest.fn();
  render(
    <Game
      initialDice={[1, 1, 1, 1, 1]}
      testOverrideDice={[1, 2, 3, 4, 6]}
      isTwoPlayer={false}
      setIsTwoPlayer={setIsTwoPlayer}
    />
  );
  fireEvent.click(screen.getByText(/Roll Dice/i));
  const score = await screen.findByTestId('score-three-of-a-kind');
  expect(score).toHaveTextContent('Three of a Kind: 0');
});

test('score for Four of a Kind starts at 0 with known non-scoring dice', async () => {
  (AuthContext.useAuth as jest.Mock).mockImplementation(() => ({
    isUserSignedIn: true,
    userDetails: { preferred_username: 'testuser' },
  }));

  const setIsTwoPlayer = jest.fn();
  render(
    <Game
      initialDice={[1, 1, 1, 1, 1]}
      testOverrideDice={[1, 2, 3, 4, 6]}
      isTwoPlayer={false}
      setIsTwoPlayer={setIsTwoPlayer}
    />
  );
  fireEvent.click(screen.getByText(/Roll Dice/i));
  const score = await screen.findByTestId('score-four-of-a-kind');
  expect(score).toHaveTextContent('Four of a Kind: 0');
});

test('initial Full House score starts at 0 with known non-scoring dice', async () => {
  (AuthContext.useAuth as jest.Mock).mockImplementation(() => ({
    isUserSignedIn: true,
    userDetails: { preferred_username: 'testuser' },
  }));

  const setIsTwoPlayer = jest.fn();
  render(
    <Game
      initialDice={[1, 1, 1, 1, 1]}
      testOverrideDice={[1, 2, 3, 4, 6]}
      isTwoPlayer={false}
      setIsTwoPlayer={setIsTwoPlayer}
    />
  );
  fireEvent.click(screen.getByText(/Roll Dice/i));
  const score = await screen.findByTestId('score-full-house');
  expect(score).toHaveTextContent('Full House: 0');
});

test('calculate Full House score with invalid dice', async () => {
  (AuthContext.useAuth as jest.Mock).mockImplementation(() => ({
    isUserSignedIn: true,
    userDetails: { preferred_username: 'testuser' },
  }));

  const setIsTwoPlayer = jest.fn();
  render(
    <Game
      initialDice={[1, 1, 1, 1, 1]}
      testOverrideDice={[1, 2, 4, 5, 6]}
      isTwoPlayer={false}
      setIsTwoPlayer={setIsTwoPlayer}
    />
  );
  fireEvent.click(screen.getByText(/Roll Dice/i));
  const score = await screen.findByTestId('score-full-house');
  expect(score).toHaveTextContent('Full House: 0');
});

test('calculate Small Straight score with invalid dice', async () => {
  (AuthContext.useAuth as jest.Mock).mockImplementation(() => ({
    isUserSignedIn: true,
    userDetails: { preferred_username: 'testuser' },
  }));

  const setIsTwoPlayer = jest.fn();
  render(
    <Game
      initialDice={[1, 1, 1, 1, 1]}
      testOverrideDice={[1, 1, 3, 5, 6]}
      isTwoPlayer={false}
      setIsTwoPlayer={setIsTwoPlayer}
    />
  );
  fireEvent.click(screen.getByText(/Roll Dice/i));
  const score = await screen.findByTestId('score-small-straight');
  expect(score).toHaveTextContent('Small Straight: 0');
});

test('calculate Large Straight score with invalid dice', async () => {
  (AuthContext.useAuth as jest.Mock).mockImplementation(() => ({
    isUserSignedIn: true,
    userDetails: { preferred_username: 'testuser' },
  }));

  const setIsTwoPlayer = jest.fn();
  render(
    <Game
      initialDice={[1, 1, 1, 1, 1]}
      testOverrideDice={[1, 2, 2, 4, 6]}
      isTwoPlayer={false}
      setIsTwoPlayer={setIsTwoPlayer}
    />
  );
  fireEvent.click(screen.getByText(/Roll Dice/i));
  const score = await screen.findByTestId('score-large-straight');
  expect(score).toHaveTextContent('Large Straight: 0');
});

test('calculate Yahtzee score with invalid dice', async () => {
  (AuthContext.useAuth as jest.Mock).mockImplementation(() => ({
    isUserSignedIn: true,
    userDetails: { preferred_username: 'testuser' },
  }));

  const setIsTwoPlayer = jest.fn();
  render(
    <Game
      initialDice={[1, 1, 1, 1, 1]}
      testOverrideDice={[1, 2, 3, 4, 5]}
      isTwoPlayer={false}
      setIsTwoPlayer={setIsTwoPlayer}
    />
  );
  fireEvent.click(screen.getByText(/Roll Dice/i));
  const score = await screen.findByTestId('score-yahtzee');
  expect(score).toHaveTextContent('Yahtzee: 0');
});

test('holding dice functionality', async () => {
  (AuthContext.useAuth as jest.Mock).mockImplementation(() => ({
    isUserSignedIn: true,
    userDetails: { preferred_username: 'testuser' },
  }));

  const setIsTwoPlayer = jest.fn();
  render(<Game initialDice={[1, 2, 3, 4, 5]} isTwoPlayer={false} setIsTwoPlayer={setIsTwoPlayer} />);

  const rollButton = screen.getByText(/Roll Dice/i);
  fireEvent.click(rollButton);

  const diceElements = await screen.findAllByRole('button', { name: /^([1-6])$/ });
  expect(diceElements.length).toBe(5);

  fireEvent.click(diceElements[0]);

  await waitFor(() => {
    const held = screen.getAllByRole('button', {
      name: diceElements[0].getAttribute('aria-label') ?? '',
    })[0];
    expect(held).toHaveClass('cursor-pointer');
  });
});
