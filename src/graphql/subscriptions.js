/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateScore = /* GraphQL */ `
  subscription OnCreateScore($filter: ModelSubscriptionScoreFilterInput) {
    onCreateScore(filter: $filter) {
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
export const onUpdateScore = /* GraphQL */ `
  subscription OnUpdateScore($filter: ModelSubscriptionScoreFilterInput) {
    onUpdateScore(filter: $filter) {
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
export const onDeleteScore = /* GraphQL */ `
  subscription OnDeleteScore($filter: ModelSubscriptionScoreFilterInput) {
    onDeleteScore(filter: $filter) {
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
export const onCreateGameResult = /* GraphQL */ `
  subscription OnCreateGameResult(
    $filter: ModelSubscriptionGameResultFilterInput
  ) {
    onCreateGameResult(filter: $filter) {
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
export const onUpdateGameResult = /* GraphQL */ `
  subscription OnUpdateGameResult(
    $filter: ModelSubscriptionGameResultFilterInput
  ) {
    onUpdateGameResult(filter: $filter) {
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
export const onDeleteGameResult = /* GraphQL */ `
  subscription OnDeleteGameResult(
    $filter: ModelSubscriptionGameResultFilterInput
  ) {
    onDeleteGameResult(filter: $filter) {
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
