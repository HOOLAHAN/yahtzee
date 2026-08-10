/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const myProfile = /* GraphQL */ `
  query MyProfile {
    myProfile {
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
export const usernameAvailable = /* GraphQL */ `
  query UsernameAvailable($username: String!) {
    usernameAvailable(username: $username)
  }
`;
export const getScore = /* GraphQL */ `
  query GetScore($id: ID!) {
    getScore(id: $id) {
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
export const listScores = /* GraphQL */ `
  query ListScores(
    $filter: ModelScoreFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listScores(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        userId
        username
        score
        timestamp
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const listUserScores = /* GraphQL */ `
  query ListUserScores(
    $userId: String
    $limit: Int
    $nextToken: String
  ) {
    listScores(
      filter: { userId: { eq: $userId } }
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        userId
        username
        score
        timestamp
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getGameResult = /* GraphQL */ `
  query GetGameResult($id: ID!) {
    getGameResult(id: $id) {
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
export const listGameResults = /* GraphQL */ `
  query ListGameResults(
    $filter: ModelGameResultFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listGameResults(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
      __typename
    }
  }
`;
export const gameResultsByUser = /* GraphQL */ `
  query GameResultsByUser(
    $userId: String!
    $completedAt: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelGameResultFilterInput
    $limit: Int
    $nextToken: String
  ) {
    gameResultsByUser(
      userId: $userId
      completedAt: $completedAt
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
      nextToken
      __typename
    }
  }
`;
export const gameResultsByModeDate = /* GraphQL */ `
  query GameResultsByModeDate(
    $modeDate: String!
    $score: ModelIntKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelGameResultFilterInput
    $limit: Int
    $nextToken: String
  ) {
    gameResultsByModeDate(
      modeDate: $modeDate
      score: $score
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
      nextToken
      __typename
    }
  }
`;
