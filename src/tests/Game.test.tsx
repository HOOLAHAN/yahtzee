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
  expect(rollButton).toHaveTextContent('Roll Dice (Rolls left: 3)');
});

test('score for Three of a Kind starts at 0 with known non-scoring dice', async () => {
  (AuthContext.useAuth as jest.Mock).mockImplementation(() => ({
    isUserSignedIn: true,
    userDetails: { preferred_username: 'testuser' },
  }));

  const setIsTwoPlayer = jest.fn();

  render(
    <Game
      initialDice={[1, 1, 1, 1, 1]} // will be overridden
      testOverrideDice={[1, 2, 3, 4, 6]} // non-scoring for Three of a Kind
      isTwoPlayer={false}
      setIsTwoPlayer={setIsTwoPlayer}
    />
  );

  fireEvent.click(screen.getByText(/Roll Dice/i));

  // Use findByText directly to assert the correct score
  const threeOfKind = await screen.findByText(/Three of a Kind: 0/);
  expect(threeOfKind).toBeInTheDocument();
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
  const fourOfKind = await screen.findByText(/Four of a Kind: 0/);
  expect(fourOfKind).toBeInTheDocument();
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
  const fullHouse = await screen.findByText(/Full House: 0/);
  expect(fullHouse).toBeInTheDocument();
});


test('holding dice functionality', async () => {
  (AuthContext.useAuth as jest.Mock).mockImplementation(() => ({
    isUserSignedIn: true,
    userDetails: { preferred_username: 'testuser' },
  }));

  const setIsTwoPlayer = jest.fn(); 

  render(<Game initialDice={[1, 2, 3, 4, 5]} isTwoPlayer={false} setIsTwoPlayer={setIsTwoPlayer}/>);

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
    const matchingHeldDice = screen.getAllByRole('button', {
      name: diceElements[0].getAttribute('aria-label') ?? '',
    })[0];
    
    expect(matchingHeldDice).toHaveClass('cursor-pointer');
  });
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
      testOverrideDice={[1, 2, 4, 5, 6]} // clearly not a full house
      isTwoPlayer={false}
      setIsTwoPlayer={setIsTwoPlayer}
    />
  );

  fireEvent.click(screen.getByText(/Roll Dice/i));
  const fullHouse = await screen.findByText(/Full House: 0/);
  expect(fullHouse).toBeInTheDocument();
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
      testOverrideDice={[1, 1, 3, 5, 6]} // no 4-segment straight
      isTwoPlayer={false}
      setIsTwoPlayer={setIsTwoPlayer}
    />
  );

  fireEvent.click(screen.getByText(/Roll Dice/i));
  const smallStraight = await screen.findByText(/Small Straight: 0/);
  expect(smallStraight).toBeInTheDocument();
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
      testOverrideDice={[1, 2, 2, 4, 6]} // not a sequence of 5
      isTwoPlayer={false}
      setIsTwoPlayer={setIsTwoPlayer}
    />
  );

  fireEvent.click(screen.getByText(/Roll Dice/i));
  const largeStraight = await screen.findByText(/Large Straight: 0/);
  expect(largeStraight).toBeInTheDocument();
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
      testOverrideDice={[1, 2, 3, 4, 5]} // clearly not a Yahtzee
      isTwoPlayer={false}
      setIsTwoPlayer={setIsTwoPlayer}
    />
  );

  fireEvent.click(screen.getByText(/Roll Dice/i));
  const yahtzee = await screen.findByText(/Yahtzee: 0/);
  expect(yahtzee).toBeInTheDocument();
});
