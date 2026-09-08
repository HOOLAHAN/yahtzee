import { fetchAuthSession } from 'aws-amplify/auth';
import { client } from '../lib/amplifyClient';

export type LiveCategory = 'Ones' | 'Twos' | 'Threes' | 'Fours' | 'Fives' | 'Sixes' | 'Three of a Kind' | 'Four of a Kind' | 'Full House' | 'Small Straight' | 'Large Straight' | 'Yahtzee' | 'Chance';
export type LiveGameStatus = 'WAITING' | 'ACTIVE' | 'COMPLETED' | 'ABANDONED';
export interface LiveScoreEntry { category: LiveCategory; score: number; dice: number[]; yahtzeeBonus?: number; }
export interface LiveGame {
  id: string; code: string; status: LiveGameStatus; hostUserId: string; hostUsername: string;
  guestUserId?: string | null; guestUsername?: string | null; currentUserId: string; round: number;
  dice: number[]; held: number[]; rollsLeft: number; hasRolled: boolean; selectedCategory?: LiveCategory | null;
  hostScores: LiveScoreEntry[]; guestScores: LiveScoreEntry[]; winnerUserId?: string | null;
  endedByUserId?: string | null; createdAt: string; updatedAt: string;
}
export type LiveGameAction = { type: 'ROLL' } | { type: 'TOGGLE_HOLD'; index: number } | { type: 'SELECT_CATEGORY'; category: LiveCategory } | { type: 'LOCK_CATEGORY'; category: LiveCategory } | { type: 'LEAVE' };

const fields = 'id code status hostUserId hostUsername guestUserId guestUsername currentUserId round dice held rollsLeft hasRolled selectedCategory hostScores guestScores winnerUserId endedByUserId createdAt updatedAt';
const parseJsonArray = <T,>(value: T[] | string | null | undefined): T[] => {
  let parsed: unknown = value;
  try {
    for (let pass = 0; pass < 2 && typeof parsed === 'string'; pass += 1) parsed = JSON.parse(parsed);
    return Array.isArray(parsed) ? parsed as T[] : [];
  } catch { return []; }
};
const parseGame = (game: LiveGame): LiveGame => ({
  ...game,
  dice: parseJsonArray<number>(game.dice),
  held: parseJsonArray<number>(game.held),
  hostScores: parseJsonArray<LiveScoreEntry>(game.hostScores),
  guestScores: parseJsonArray<LiveScoreEntry>(game.guestScores),
});

async function authToken() {
  const session = await fetchAuthSession();
  const token = session.tokens?.idToken?.toString();
  if (!token) throw new Error('Sign in to play a remote game.');
  return token;
}

async function request<T>(query: string, field: string, variables?: Record<string, unknown>): Promise<T> {
  const result = await (client as any).graphql({ query, variables, authMode: 'userPool', authToken: await authToken() });
  const value = result.data?.[field];
  if (value) return value as T;
  throw new Error(result.errors?.map((error: { message?: string }) => error.message).filter(Boolean).join('\n') || 'Unable to update the remote game.');
}

export const createLiveGame = async () => parseGame(await request<LiveGame>(`mutation CreateLiveGame { createLiveGame { ${fields} } }`, 'createLiveGame'));
export const joinLiveGame = async (code: string) => parseGame(await request<LiveGame>(`mutation JoinLiveGame($code:String!){joinLiveGame(code:$code){${fields}}}`, 'joinLiveGame', { code }));
export const fetchLiveGame = async (gameId: string) => parseGame(await request<LiveGame>(`query LiveGame($gameId:ID!){liveGame(gameId:$gameId){${fields}}}`, 'liveGame', { gameId }));
export const fetchMyLiveGames = async () => (await request<LiveGame[]>(`query MyLiveGames { myLiveGames { ${fields} } }`, 'myLiveGames')).map(parseGame);
export const updateLiveGame = async (gameId: string, action: LiveGameAction) => parseGame(await request<LiveGame>(`mutation UpdateLiveGame($gameId:ID!,$action:AWSJSON!){updateLiveGame(gameId:$gameId,action:$action){${fields}}}`, 'updateLiveGame', { gameId, action: JSON.stringify(action) }));

export async function subscribeToLiveGame(gameId: string, onGame: (game: LiveGame) => void, onError: (error: Error) => void) {
  const operation = (client as any).graphql({ query: `subscription LiveGameChanged($id:ID!){onLiveGameChanged(id:$id){${fields}}}`, variables: { id: gameId }, authMode: 'userPool', authToken: await authToken() });
  return operation.subscribe({
    next: (event: { data?: { onLiveGameChanged?: LiveGame | null } }) => { if (event.data?.onLiveGameChanged) onGame(parseGame(event.data.onLiveGameChanged)); },
    error: (error: unknown) => onError(error instanceof Error ? error : new Error('Live updates were interrupted. Reconnecting…')),
  }) as { unsubscribe: () => void };
}
