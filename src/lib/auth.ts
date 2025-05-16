"use client"
/* eslint-disable @typescript-eslint/no-explicit-any */


// import necessary AWS cognito commands and types from the SDK
import {
  CognitoIdentityProviderClient,
  ConfirmForgotPasswordCommand,
  ConfirmSignUpCommand,
  ForgotPasswordCommand,
  InitiateAuthCommand,
  SignUpCommand,
  SignUpCommandInput,
  ConfirmForgotPasswordCommandInput,
  InitiateAuthCommandInput,
  ConfirmSignUpCommandInput,
  ForgotPasswordCommandInput,
} from "@aws-sdk/client-cognito-identity-provider";

// Create an AWS Cognito client
const ClientId = process.env.NEXT_PUBLIC_CLIENT_ID!;
const region = "us-east-1";
const client = new CognitoIdentityProviderClient({
  region
});
 
// Function to sign in a user with email and password
export async function signIn(email: string, password: string) {
  const input: InitiateAuthCommandInput = {
    AuthFlow: "USER_PASSWORD_AUTH", // Use password-based auth flow
    ClientId: ClientId,
    AuthParameters: {
      USERNAME: email , // Use email as the username
      PASSWORD: password,
    },
  };

  try {
    const command = new InitiateAuthCommand(input); // Create the auth command
    const response = await client.send(command); // Send the request to Cognito
    console.log("Cognito Sign-in Response:", response);
    return response; // Return the sign-in response
  } catch (error: any) {
    console.error("Error during sign-in:", error.message);
    throw new Error("Failed to sign in. Please check your credentials.");
  }
}

// Function to sign up a new user
export async function signUp(email: string, password: string) {
  const input: SignUpCommandInput = {
    ClientId: ClientId,
    Username: email , // Use email as the username, even though it's an alias
    Password: password,
    UserAttributes: [
      {
        Name: "email",
        Value: email, // Pass email as an attribute
      },
    ],
  };

  try {
    const command = new SignUpCommand(input);
    const result = await client.send(command);
    console.log("User successfully signed up:", result);
    return result;
  } catch (err: any) {
    console.error("Error during sign-up:", err.message);
    throw new Error("Failed to sign up. Please try again.");
  }
}

// Function to confirm a user's sign-up using a confirmation code
export async function confirmSignUp(email: string, code: string) {
  const input: ConfirmSignUpCommandInput = {
    ClientId: ClientId,
    Username: email , // Pass email as the username
    ConfirmationCode: code,
  };

  try {
    const command = new ConfirmSignUpCommand(input); // Create the confirm sign-up command
    const result = await client.send(command); // Send the request
    console.log("Sign-up confirmed:", result);
    return result; // Return the confirmation result
  } catch (err: any) {
    console.error("Error confirming sign-up:", err.message);
    throw new Error("Failed to confirm sign-up. Please try again.");
  }
}

// Function to send a password reset email
export async function sendResetEmail(email: string): Promise<void> {
  const input: ForgotPasswordCommandInput = {
    ClientId: ClientId,
    Username: email , // Use email as the username
  };

  try {
    const command = new ForgotPasswordCommand(input); // Create the password reset command
    await client.send(command); // Send the request
  } catch (err: any) {
    console.error("Error sending reset email:", err.message);
    throw new Error("Failed to send reset email. Please try again.");
  }
}

// Function to confirm the password reset using code and new password
export async function confirmPasswordReset(email: string, code: string, newPassword: string) {
  const input: ConfirmForgotPasswordCommandInput = {
    ClientId: ClientId,
    Username: email, // Use email as the username
    ConfirmationCode: code,
    Password: newPassword,
  };

  try {
    const command = new ConfirmForgotPasswordCommand(input); // Create the confirm reset command
    await client.send(command); // Send the request
  } catch (error: any) {
    console.error("Error resetting password:", error.message);
    throw new Error("Failed to reset password. Please try again.");
  }
}

export function redirectToGoogleOAuth() {
  const domain = "https://shanpool-app.auth.us-east-1.amazoncognito.com";
  const clientId = process.env.NEXT_PUBLIC_CLIENT_ID!;
  const redirectUrl = `${window.location.origin}/auth/callback/google`;  
  const responseType = "code"; 
  console.log(domain)
  console.log(clientId)
  // console.log(redirectUrl)
  const loginUrl = `${domain}/oauth2/authorize?response_type=${responseType}&client_id=${clientId}&redirect_uri=${redirectUrl}&identity_provider=Google`;

  window.location.href = loginUrl;
}

export const redirectToMicrosoftOAuth = () => {
  const clientId = process.env.NEXT_PUBLIC_CLIENT_ID!;
  const domain = "https://shanpool-app.auth.us-east-1.amazoncognito.com";
  const redirectUrl = `${window.location.origin}/auth/callback/microsoft`;

  const login = `${domain}/oauth2/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUrl}&identity_provider=Microsoft`;

  window.location.href = login;
};

//  
// use .split("@")[0] to get the username from email