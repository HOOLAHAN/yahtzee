// amplify-config.tsx

const amplifyConfig = {
  Auth: {
    region: process.env.REACT_APP_AWS_REGION as string,
    userPoolId: process.env.REACT_APP_USER_POOL_ID as string,
    userPoolWebClientId: process.env.REACT_APP_CLIENT_ID as string,
  },
};

export default amplifyConfig;
