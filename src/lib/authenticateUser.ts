import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserSession, // Importing CognitoUserSession for type clarification
} from "amazon-cognito-identity-js";
import { userPool } from "./cognito";

// Define the type for the successful response
type AuthenticationResponse = CognitoUserSession;

export function authenticateUser(email: string, password: string): Promise<AuthenticationResponse> {
  return new Promise((resolve, reject) => {
    const user = new CognitoUser({
      Username: email,
      Pool: userPool,
    });

    const authDetails = new AuthenticationDetails({
      Username: email,
      Password: password,
    });

    user.authenticateUser(authDetails, {
      onSuccess: (session: CognitoUserSession) => resolve(session),
      onFailure: (error: Error) => reject(error),  // Error can be of type `Error`
    });
  });
}
