"use client";

import { useState, useEffect, Suspense } from "react";
import { CognitoUser } from "amazon-cognito-identity-js";
import { userPool } from "@/lib/cognito";
import { useRouter, useSearchParams } from "next/navigation";

// ✅ Optional: Define a type for Cognito error
interface CognitoError extends Error {
  code?: string;
}

const ConfirmPageContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [username, setUsername] = useState("");
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");

  // ✅ Auto-fill username from query param
  useEffect(() => {
    const queryUsername = searchParams.get("username");
    if (queryUsername) {
      setUsername(queryUsername);
    }
  }, [searchParams]);

  const handleConfirm = async () => {
    const userData = {
      Username: username,
      Pool: userPool,
    };

    const cognitoUser = new CognitoUser(userData);

    try {
      await new Promise((resolve, reject) => {
        cognitoUser.confirmRegistration(code, true, (err, result) => {
          if (err) return reject(err);
          resolve(result);
        });
      });

      setMessage("Confirmation successful! Redirecting to login...");
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err: unknown) {
      const error = err as CognitoError;

      console.error(error);

      if (error.code === "NotAuthorizedException") {
        setMessage("Account is already confirmed. You can log in.");
      } else {
        setMessage(error.message || "Confirmation failed.");
      }
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Confirm Your Account</h1>

      <input
        className="border p-2 w-full mb-2"
        type="text"
        placeholder="Username from signup"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <input
        className="border p-2 w-full mb-2"
        type="text"
        placeholder="Confirmation Code"
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />

      <button
        className="bg-blue-600 text-white px-4 py-2 rounded w-full"
        onClick={handleConfirm}
      >
        Confirm Account
      </button>

      {message && <p className="mt-4 text-sm text-blue-600">{message}</p>}
    </div>
  );
};

// Wrap your component inside Suspense for client-side rendering
export default function ConfirmPageWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ConfirmPageContent />
    </Suspense>
  );
}
