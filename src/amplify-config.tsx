// Keep local and hosted environments independent from the generated
// aws-exports.js file. That file can easily become stale after an Amplify
// backend is recreated or an AppSync API key is rotated.
const amplifyConfig = {
  Auth: {
    Cognito: {
      userPoolId: process.env.REACT_APP_USER_POOL_ID as string,
      userPoolClientId: process.env.REACT_APP_CLIENT_ID as string,
    },
  },
  API: {
    GraphQL: {
      endpoint: process.env.REACT_APP_AWS_SYNC_GRAPHQLENDPOINT as string,
      region: process.env.REACT_APP_AWS_REGION as string,
      defaultAuthMode: 'apiKey' as const,
      apiKey: process.env.REACT_APP_APPSYNC_APIKEY as string,
    },
  },
};

export default amplifyConfig;
