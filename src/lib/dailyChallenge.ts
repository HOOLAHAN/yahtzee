export const utcDateKey = (date = new Date()) => date.toISOString().slice(0, 10);

const hashSeed = (value: string) => {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
};

const nextRandom = (seed: number) => {
  let value = seed + 0x6d2b79f5;
  value = Math.imul(value ^ (value >>> 15), value | 1);
  value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
  return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
};

export const dailyDiceForThrow = (dateKey: string, throwIndex: number): number[] =>
  Array.from({ length: 5 }, (_, dieIndex) => {
    const seed = hashSeed(`yahtzee-hub:${dateKey}:${throwIndex}:${dieIndex}`);
    return Math.floor(nextRandom(seed) * 6) + 1;
  });

export const currentDailyStreak = (dateKeys: string[], today: string) => {
  const completed = new Set(dateKeys); const cursor = new Date(`${today}T00:00:00.000Z`);
  if (!completed.has(today)) cursor.setUTCDate(cursor.getUTCDate() - 1);
  let streak = 0;
  while (completed.has(cursor.toISOString().slice(0, 10))) { streak += 1; cursor.setUTCDate(cursor.getUTCDate() - 1); }
  return streak;
};
