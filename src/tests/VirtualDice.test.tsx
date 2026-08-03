import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import VirtualDice from '../components/game/VirtualDice';

test('adds and removes virtual dice within the supported range', () => {
  render(<VirtualDice />);
  const add = screen.getByRole('button', { name: 'Add a die' });
  const remove = screen.getByRole('button', { name: 'Remove a die' });

  expect(remove).toBeDisabled();
  fireEvent.click(add);
  expect(screen.getByRole('button', { name: 'Roll 2 dice' })).toBeInTheDocument();
  expect(screen.getAllByRole('button', { name: /^([1-6])$/ })).toHaveLength(2);

  for (let index = 0; index < 12; index += 1) fireEvent.click(add);
  expect(add).toBeDisabled();
  expect(screen.getAllByRole('button', { name: /^([1-6])$/ })).toHaveLength(10);
});

test('rolls a single virtual die', () => {
  jest.spyOn(Math, 'random').mockReturnValue(0.99);
  render(<VirtualDice />);
  fireEvent.click(screen.getByRole('button', { name: 'Roll die' }));
  expect(screen.getByRole('button', { name: '6' })).toBeInTheDocument();
  jest.restoreAllMocks();
});
