/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const submitScore = /* GraphQL */ `
  mutation SubmitScore($userId: String!, $username: String!, $score: Int!) {
    submitScore(userId: $userId, username: $username, score: $score) {
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
