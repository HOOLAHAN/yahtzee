import { dailyDiceForThrow, localDateKey } from '../lib/dailyChallenge';

test('daily dice are deterministic and valid', () => {
  const first = dailyDiceForThrow('2026-08-06', 0);
  expect(dailyDiceForThrow('2026-08-06', 0)).toEqual(first);
  expect(first).toHaveLength(5);
  expect(first.every((die) => die >= 1 && die <= 6)).toBe(true);
  expect(dailyDiceForThrow('2026-08-07', 0)).not.toEqual(first);
});

test('date keys follow the local calendar day', () => {
  expect(localDateKey(new Date(2026, 7, 7, 0, 38))).toBe('2026-08-07');
});
