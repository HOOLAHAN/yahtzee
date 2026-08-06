# Yahtzee Hub V2 engagement model

## Product loop

V2 is built around one repeatable loop: complete the shared Daily Challenge,
see today's position and weekly progress, unlock achievements, and return for
the next UTC day.

## Rules

- A Daily Challenge is identified by an ISO UTC date (`YYYY-MM-DD`).
- Every client uses the same deterministic dice generator and date seed.
- Each signed-in account can create one official Daily result for a date.
- Anonymous players may play, share, and retain today's result locally, but do
  not appear globally or sync streaks between devices.
- A Daily streak counts consecutive UTC dates with completed official results.
- Weekly competition uses the best five Daily scores from Monday–Sunday UTC.
- All-time competition continues to use the existing `Score` model.
- Existing production scores require no migration.

## Result identity and indexes

- Daily result ID: `daily:<date>:<cognito-sub>`
- Solo result ID: a client-generated persisted game ID
- `modeDate`: `DAILY#<date>` or `SOLO#ALL`
- `byModeDate` supports a descending daily board.
- `byUser` supports achievements, streaks, and personal statistics.

The owner rule ties `userId` to the Cognito `sub`. The model is append-only for
clients: create and read are permitted, while update and delete are not.

## Initial achievements

| ID | Name | Requirement |
| --- | --- | --- |
| first_game | First Roll | Complete 1 solo game |
| solo_5 | Getting Started | Complete 5 solo games |
| solo_25 | Regular Roller | Complete 25 solo games |
| solo_100 | Century Club | Complete 100 solo games |
| first_yahtzee | Yahtzee! | Record a Yahtzee |
| double_yahtzee | Seeing Double | Record 2 Yahtzees in one game |
| score_200 | Two Hundred Club | Score at least 200 |
| score_250 | High Roller | Score at least 250 |
| score_300 | Elite Roller | Score at least 300 |
| upper_bonus | Bonus Hunter | Earn the upper-section bonus |
| both_straights | Straight Shooter | Record both straights in one game |
| clean_card | Clean Card | Finish without a zero category |
| daily_first | Daily Debut | Complete one Daily Challenge |
| streak_3 | On a Roll | Reach a 3-day Daily streak |
| streak_7 | Full Week | Reach a 7-day Daily streak |
| streak_30 | Daily Devotion | Reach a 30-day Daily streak |

Leaderboard-position achievements will be awarded only from confirmed server
rankings, not inferred from a partial client result set.
