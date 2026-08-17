import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Game from '../components/game/Game';
import * as AuthContext from '../context/AuthContext';
import { localDateKey } from '../lib/dailyChallenge';
import { fetchDailyResults } from '../services/gameResults';

HTMLCanvasElement.prototype.getContext = jest.fn();

jest.mock('jspdf', () => {
  return function () {};
});

jest.mock('../context/AuthContext', () => ({
  useAuth: jest.fn(),
}));

jest.mock('../services/gameResults', () => ({
  ...jest.requireActual('../services/gameResults'),
  fetchDailyResults: jest.fn().mockResolvedValue([]),
}));

afterEach(() => {
  localStorage.clear();
  jest.clearAllMocks();
});

test('daily completion is scoped to the signed-in user', async () => {
  (fetchDailyResults as jest.Mock).mockResolvedValue([]);
  let currentUserId = 'user-a';
  (AuthContext.useAuth as jest.Mock).mockImplementation(() => ({
    isUserSignedIn: true,
    userDetails: { userId: currentUserId, preferred_username: currentUserId },
  }));
  localStorage.setItem(`yahtzee.daily.completed.${localDateKey()}.user-a`, 'true');

  const { rerender } = render(<Game isDailyChallenge isTwoPlayer={false} setIsTwoPlayer={jest.fn()} />);
  expect(await screen.findByText('Challenge completed')).toBeInTheDocument();

  currentUserId = 'user-b';
  rerender(<Game isDailyChallenge isTwoPlayer={false} setIsTwoPlayer={jest.fn()} />);

  expect(await screen.findByTestId('roll-dice-button')).toBeInTheDocument();
  expect(screen.queryByText('Challenge completed')).not.toBeInTheDocument();
  expect(fetchDailyResults).toHaveBeenCalledWith(localDateKey());
  expect(localStorage.getItem(`yahtzee.daily.completed.${localDateKey()}.user-b`)).toBeNull();
});

test('initial roll count is 3', () => {
  (AuthContext.useAuth as jest.Mock).mockImplementation(() => ({
    isUserSignedIn: true,
    userDetails: { preferred_username: 'testuser' },
  }));

  const setIsTwoPlayer = jest.fn();
  render(<Game isTwoPlayer={false} setIsTwoPlayer={setIsTwoPlayer} />);
  
  const rollButton = screen.getByTestId('roll-dice-button'); 
  fireEvent.click(rollButton);
  
  expect(rollButton).toHaveTextContent('Roll Dice (3 left)');
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
  fireEvent.click(screen.getByTestId('roll-dice-button'));
  const score = await screen.findByTestId('score-three-of-a-kind');
  await waitFor(() => expect(score).toHaveTextContent('0'));
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
  fireEvent.click(screen.getByTestId('roll-dice-button'));
  const score = await screen.findByTestId('score-four-of-a-kind');
  await waitFor(() => expect(score).toHaveTextContent('0'));
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
  fireEvent.click(screen.getByTestId('roll-dice-button'));
  const score = await screen.findByTestId('score-full-house');
  await waitFor(() => expect(score).toHaveTextContent('0'));
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
  fireEvent.click(screen.getByTestId('roll-dice-button'));
  const score = await screen.findByTestId('score-full-house');
  await waitFor(() => expect(score).toHaveTextContent('0'));
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
  fireEvent.click(screen.getByTestId('roll-dice-button'));
  const score = await screen.findByTestId('score-small-straight');
  await waitFor(() => expect(score).toHaveTextContent('0'));
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
  fireEvent.click(screen.getByTestId('roll-dice-button'));
  const score = await screen.findByTestId('score-large-straight');
  await waitFor(() => expect(score).toHaveTextContent('0'));
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
  fireEvent.click(screen.getByTestId('roll-dice-button'));
  const score = await screen.findByTestId('score-yahtzee');
  await waitFor(() => expect(score).toHaveTextContent('0'));
});

test('holding dice functionality', async () => {
  (AuthContext.useAuth as jest.Mock).mockImplementation(() => ({
    isUserSignedIn: true,
    userDetails: { preferred_username: 'testuser' },
  }));

  const setIsTwoPlayer = jest.fn();
  render(<Game initialDice={[1, 2, 3, 4, 5]} isTwoPlayer={false} setIsTwoPlayer={setIsTwoPlayer} />);

  fireEvent.click(screen.getByTestId('roll-dice-button'));

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
