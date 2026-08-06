# Profile service

This is the source deployed to the `YahtzeeProfileService` Lambda and its four
AppSync JavaScript resolvers: `usernameAvailable`, `myProfile`,
`updateMyProfile`, and `deleteMyProfile`.

Usernames are claimed case-insensitively in the `YahtzeeUserProfiles` DynamoDB
table. Profile writes require Cognito user-pool authentication. First name and
surname are returned only by authenticated profile operations and are never
part of the public leaderboard schema.

V2 also requires `GAME_RESULT_TABLE`. Username changes propagate to this table,
and account deletion removes its completion records. Grant the Lambda Scan and
BatchWriteItem access to the deployed `GameResult` table before releasing V2.

`lambda-policy.json` records the table and Cognito permissions required by the
function. DynamoDB transactions still require the corresponding item-level
`PutItem` and `DeleteItem` permissions.

Account deletion also scans for and removes leaderboard rows owned by the
authenticated Cognito `sub`, before the client deletes the Cognito user.
