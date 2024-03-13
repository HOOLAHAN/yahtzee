/* eslint-disable */
// this is an auto generated file. This will be overwritten

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
    $userId: String,
    $limit: Int,
    $nextToken: String
  ) {
    listScores(filter: {userId: {eq: $userId}}, limit: $limit, nextToken: $nextToken) {
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
