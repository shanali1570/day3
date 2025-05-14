"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  CognitoUser,
  AuthenticationDetails,
  CognitoUserSession,
} from "amazon-cognito-identity-js";
import { userPool } from "@/lib/cognito";
import Link from "next/link";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setMessage("");
    if (!email || !password) {
      setMessage("Please provide both email and password.");
      return;
    }

    const authDetails = new AuthenticationDetails({
      Username: email,
      Password: password,
    });

    const user = new CognitoUser({
      Username: email,
      Pool: userPool,
    });

    setLoading(true);
    try {
      const result = await new Promise<CognitoUserSession>((resolve, reject) => {
        user.authenticateUser(authDetails, {
          onSuccess: (session) => resolve(session),
          onFailure: (err) => reject(err),
        });
      });

      const idToken = result.getIdToken().getJwtToken();
      document.cookie = `id_token=${idToken}; path=/`;

      setMessage("Login successful!");
      router.push("/dashboard");
    } catch (error: unknown) {
      console.error("Login failed:", error);

      if (typeof error === "object" && error !== null && "code" in error) {
        const typedError = error as { code?: string; message?: string };

        if (typedError.code === "NotAuthorizedException") {
          setMessage("Incorrect username or password.");
        } else if (typedError.code === "UserNotFoundException") {
          setMessage("User not found.");
        } else {
          setMessage(typedError.message || "Login failed.");
        }
      } else {
        setMessage("An unknown error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-xl mb-4 font-bold">Log In</h1>

      <input
        className="border p-2 w-full mb-2"
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <div className="relative mb-2">
        <input
          className="border p-2 w-full pr-10"
          type={passwordVisible ? "text" : "password"}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="button"
          onClick={() => setPasswordVisible((prev) => !prev)}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-600"
        >
          {passwordVisible ? "🙈" : "👁️"}
        </button>
      </div>

      <p className="mt-1 mb-2 text-right text-sm">
        <Link href="/forgot-password" className="text-blue-600 underline">
          Forgot Password?
        </Link>
      </p>

      <button
        className="bg-green-600 text-white px-4 py-2 rounded w-full disabled:opacity-50"
        onClick={handleLogin}
        disabled={loading}
      >
        {loading ? "Logging in..." : "Log In"}
      </button>

      <div className="my-3 text-center text-sm text-gray-500">OR</div>

      <button
        className="bg-blue-600 text-white px-4 py-2 rounded w-full"
        onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
      >
        Continue with Google
      </button>

      <button
        className="bg-[#2F2F2F] text-white px-4 py-2 rounded w-full mt-3"
        onClick={() => signIn("microsoft", { callbackUrl: "/dashboard" })}
      >
        Continue with Microsoft
      </button>

      <p className="mt-4 text-sm">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="text-blue-600 underline">
          Sign Up
        </Link>
      </p>

      {message && <p className="mt-3 text-sm text-red-600">{message}</p>}
    </div>
  );
}
