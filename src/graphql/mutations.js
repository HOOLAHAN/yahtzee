/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const submitScore = /* GraphQL */ `
  mutation SubmitScore($id: ID, $score: Int!) {
    submitScore(id: $id, score: $score) {
      id
      userId
      username
      score
      timestamp
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const submitGameResult = /* GraphQL */ `
  mutation SubmitGameResult($input: SubmitGameResultInput!) {
    submitGameResult(input: $input) {
      id
      userId
      username
      mode
      modeDate
      challengeDate
      score
      completedAt
      yahtzeeCount
      earnedUpperBonus
      completedSmallStraight
      completedLargeStraight
      noZeroScores
      yahtzeeOnFinalRoll
      scorecard
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const submitDailyRoundProgress = /* GraphQL */ `
  mutation SubmitDailyRoundProgress(
    $challengeDate: AWSDate!
    $round: Int!
    $score: Int!
  ) {
    submitDailyRoundProgress(
      challengeDate: $challengeDate
      round: $round
      score: $score
    ) {
      challengeDate
      round
      score
      rank
      playerCount
      percentile
      __typename
    }
  }
`;
export const updateMyProfile = /* GraphQL */ `
  mutation UpdateMyProfile(
    $username: String!
    $firstName: String!
    $lastName: String!
  ) {
    updateMyProfile(
      username: $username
      firstName: $firstName
      lastName: $lastName
    ) {
      userId
      username
      firstName
      lastName
      scoreSuggestionsEnabled
      dailyReminderEnabled
      dailyReminderHour
      __typename
    }
  }
`;
export const updateMyPreferences = /* GraphQL */ `
  mutation UpdateMyPreferences(
    $scoreSuggestionsEnabled: Boolean!
    $dailyReminderEnabled: Boolean!
    $dailyReminderHour: Int!
  ) {
    updateMyPreferences(
      scoreSuggestionsEnabled: $scoreSuggestionsEnabled
      dailyReminderEnabled: $dailyReminderEnabled
      dailyReminderHour: $dailyReminderHour
    ) {
      userId
      username
      firstName
      lastName
      scoreSuggestionsEnabled
      dailyReminderEnabled
      dailyReminderHour
      __typename
    }
  }
`;
export const deleteMyProfile = /* GraphQL */ `
  mutation DeleteMyProfile {
    deleteMyProfile
  }
`;
export const createScore = /* GraphQL */ `
  mutation CreateScore(
    $input: CreateScoreInput!
    $condition: ModelScoreConditionInput
  ) {
    createScore(input: $input, condition: $condition) {
      id
      userId
      username
      score
      timestamp
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const updateScore = /* GraphQL */ `
  mutation UpdateScore(
    $input: UpdateScoreInput!
    $condition: ModelScoreConditionInput
  ) {
    updateScore(input: $input, condition: $condition) {
      id
      userId
      username
      score
      timestamp
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const deleteScore = /* GraphQL */ `
  mutation DeleteScore(
    $input: DeleteScoreInput!
    $condition: ModelScoreConditionInput
  ) {
    deleteScore(input: $input, condition: $condition) {
      id
      userId
      username
      score
      timestamp
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const createGameResult = /* GraphQL */ `
  mutation CreateGameResult(
    $input: CreateGameResultInput!
    $condition: ModelGameResultConditionInput
  ) {
    createGameResult(input: $input, condition: $condition) {
      id
      userId
      username
      mode
      modeDate
      challengeDate
      score
      completedAt
      yahtzeeCount
      earnedUpperBonus
      completedSmallStraight
      completedLargeStraight
      noZeroScores
      yahtzeeOnFinalRoll
      scorecard
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const updateGameResult = /* GraphQL */ `
  mutation UpdateGameResult(
    $input: UpdateGameResultInput!
    $condition: ModelGameResultConditionInput
  ) {
    updateGameResult(input: $input, condition: $condition) {
      id
      userId
      username
      mode
      modeDate
      challengeDate
      score
      completedAt
      yahtzeeCount
      earnedUpperBonus
      completedSmallStraight
      completedLargeStraight
      noZeroScores
      yahtzeeOnFinalRoll
      scorecard
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const deleteGameResult = /* GraphQL */ `
  mutation DeleteGameResult(
    $input: DeleteGameResultInput!
    $condition: ModelGameResultConditionInput
  ) {
    deleteGameResult(input: $input, condition: $condition) {
      id
      userId
      username
      mode
      modeDate
      challengeDate
      score
      completedAt
      yahtzeeCount
      earnedUpperBonus
      completedSmallStraight
      completedLargeStraight
      noZeroScores
      yahtzeeOnFinalRoll
      scorecard
      createdAt
      updatedAt
      __typename
    }
  }
`;
