# Profile service

Source for the `YahtzeeProfileService` Lambda used by the custom AppSync profile resolvers.

`updateMyProfile` reserves the unique username, updates private profile fields and Cognito attributes, then propagates a changed public username to existing score records owned by the same Cognito `sub`.

The function uses the AWS SDK supplied by the Node.js Lambda runtime. Its environment requires `PROFILE_TABLE`, `SCORE_TABLE`, `GAME_RESULT_TABLE`, and `USER_POOL_ID`. `GAME_RESULT_TABLE` is created by the V2 GraphQL deployment and must be added to the Lambda environment and IAM policy before releasing V2 clients.
