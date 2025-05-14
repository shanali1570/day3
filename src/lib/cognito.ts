import { CognitoUserPool } from "amazon-cognito-identity-js";

// Replace these with your actual values from AWS Console
const poolData = {
  UserPoolId: "us-east-1_PrW2IjiH3",  // Replace with your actual User Pool ID
  ClientId: "3k25p90k9m0vm5iq7fr81vemrl",  // Replace with your actual App Client ID
};

export const userPool = new CognitoUserPool(poolData);
