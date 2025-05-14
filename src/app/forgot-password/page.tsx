// src/app/forgot-password/page.tsx
"use client";

import { useState } from "react";
import { CognitoUser } from "amazon-cognito-identity-js";
import { userPool } from "@/lib/cognito";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleForgotPassword = () => {
    const user = new CognitoUser({ Username: email, Pool: userPool });

    user.forgotPassword({
      onSuccess: () => {
        setMessage("Check your email for the reset code.");
        setTimeout(() => router.push("/reset-password-confirm"), 2000);
      },
      onFailure: (err) => {
        console.error(err);
        setMessage(err.message || "Failed to send reset code.");
      },
    });
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-xl mb-4 font-bold">Forgot Password</h1>
      <input
        className="border p-2 w-full mb-2"
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded w-full"
        onClick={handleForgotPassword}
      >
        Send Reset Code
      </button>
      {message && <p className="mt-4 text-sm text-blue-600">{message}</p>}
    </div>
  );
}
