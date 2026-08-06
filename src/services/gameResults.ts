import { fetchAuthSession } from 'aws-amplify/auth';
import { client } from '../lib/amplifyClient';
import { ScoreEntry } from '../lib/types';

export type ResultMode = 'SOLO' | 'DAILY';
export interface GameResult {
  id: string; userId: string; username: string; mode: ResultMode; modeDate: string;
  challengeDate?: string; score: number; completedAt: string; yahtzeeCount: number;
  earnedUpperBonus: boolean; completedSmallStraight: boolean;
  completedLargeStraight: boolean; noZeroScores: boolean; yahtzeeOnFinalRoll: boolean;
}
const fields = 'id userId username mode modeDate challengeDate score completedAt yahtzeeCount earnedUpperBonus completedSmallStraight completedLargeStraight noZeroScores yahtzeeOnFinalRoll';

export const resultMetrics = (entries: ScoreEntry[]) => {
  const upper = new Set(['Ones', 'Twos', 'Threes', 'Fours', 'Fives', 'Sixes']);
  const subtotal = entries.filter((entry) => upper.has(entry.category)).reduce((sum, entry) => sum + entry.roundScore, 0);
  return {
    score: entries.reduce((sum, entry) => sum + entry.roundScore, 0) + (subtotal >= 63 ? 35 : 0),
    yahtzeeCount: entries.filter((entry) => entry.category === 'Yahtzee' && entry.roundScore === 50).length,
    earnedUpperBonus: subtotal >= 63,
    completedSmallStraight: entries.some((entry) => entry.category === 'SmallStraight' && entry.roundScore === 30),
    completedLargeStraight: entries.some((entry) => entry.category === 'LargeStraight' && entry.roundScore === 40),
    noZeroScores: entries.length === 13 && entries.every((entry) => entry.roundScore > 0),
  };
};

export async function createGameResult(input: Omit<GameResult, 'userId' | 'username'>) {
  const session = await fetchAuthSession();
  const token = session.tokens?.idToken;
  if (!token) throw new Error('Sign in to save progress and join the leaderboard.');
  const userId = String(token.payload.sub);
  const username = String(token.payload.preferred_username ?? token.payload.email ?? 'Player');
  const result = await (client as any).graphql({ query: `mutation CreateGameResult($input:CreateGameResultInput!){createGameResult(input:$input){${fields}}}`, authMode: 'userPool', authToken: token.toString(), variables: { input: { ...input, userId, username } } });
  if (!result.data?.createGameResult) throw new Error(result.errors?.map((error: { message: string }) => error.message).join(', ') || 'Unable to save game progress.');
  return result.data.createGameResult as GameResult;
}

export async function fetchDailyResults(dateKey: string): Promise<GameResult[]> {
  const result = await (client as any).graphql({ query: `query Daily($modeDate:String!){gameResultsByModeDate(modeDate:$modeDate,sortDirection:DESC,limit:100){items{${fields}}}}`, authMode: 'apiKey', variables: { modeDate: `DAILY#${dateKey}` } });
  return (result.data?.gameResultsByModeDate?.items ?? []).filter(Boolean);
}

export async function fetchMyGameResults(userId: string): Promise<GameResult[]> {
  const result = await (client as any).graphql({ query: `query Progress($userId:String!){gameResultsByUser(userId:$userId,sortDirection:DESC,limit:500){items{${fields}}}}`, authMode: 'apiKey', variables: { userId } });
  return (result.data?.gameResultsByUser?.items ?? []).filter(Boolean);
}

export const utcWeekDateKeys = (date = new Date()) => {
  const monday = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const day = monday.getUTCDay() || 7; monday.setUTCDate(monday.getUTCDate() - day + 1);
  return Array.from({ length: 7 }, (_, offset) => { const value = new Date(monday); value.setUTCDate(monday.getUTCDate() + offset); return value.toISOString().slice(0, 10); });
};

export async function fetchWeeklyResults(date = new Date()) {
  const keys = utcWeekDateKeys(date);
  const results = (await Promise.all(keys.map(fetchDailyResults))).flat();
  const players = new Map<string, { username: string; scores: number[] }>();
  results.forEach((result) => { const player = players.get(result.userId) ?? { username: result.username, scores: [] }; player.username = result.username; player.scores.push(result.score); players.set(result.userId, player); });
  return Array.from(players.entries()).map(([userId, player]) => ({ id: `week:${keys[0]}:${userId}`, userId, username: player.username, score: player.scores.sort((a, b) => b - a).slice(0, 5).reduce((sum, score) => sum + score, 0) })).sort((a, b) => b.score - a.score);
}
