import { dailyDiceForThrow, utcDateKey } from '../lib/dailyChallenge';

test('daily dice are deterministic and valid', () => {
  const first = dailyDiceForThrow('2026-08-06', 0);
  expect(dailyDiceForThrow('2026-08-06', 0)).toEqual(first);
  expect(first).toHaveLength(5);
  expect(first.every((die) => die >= 1 && die <= 6)).toBe(true);
  expect(dailyDiceForThrow('2026-08-07', 0)).not.toEqual(first);
});

test('UTC date keys are stable', () => {
  expect(utcDateKey(new Date('2026-08-06T23:59:59Z'))).toBe('2026-08-06');
});
