// awsConfig.js
import { CognitoUserPool } from 'amazon-cognito-identity-js';

const poolData = {
    UserPoolId: process.env.REACT_APP_USER_POOL_ID, // e.g., us-east-1_XXXXX
    ClientId: process.env.REACT_APP_CLIENT_ID, // e.g., 2jqdp3hj3example
};

export const userPool = new CognitoUserPool(poolData);
