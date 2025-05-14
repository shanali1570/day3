"use client";

import { useState } from "react";
import { CognitoUser } from "amazon-cognito-identity-js";
import { userPool } from "@/lib/cognito";
import { useRouter } from "next/navigation";

export default function ResetPasswordConfirmPage() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false); // 👁️ visibility toggle
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleResetPassword = () => {
    const user = new CognitoUser({ Username: email, Pool: userPool });

    user.confirmPassword(code, newPassword, {
      onSuccess: () => {
        setMessage("Password successfully reset!");
        setTimeout(() => router.push("/login"), 2000);
      },
      onFailure: (err) => {
        console.error(err);
        setMessage(err.message || "Password reset failed.");
      },
    });
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Reset Your Password</h1>

      <input
        className="border p-2 w-full mb-2"
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        className="border p-2 w-full mb-2"
        type="text"
        placeholder="Reset Code"
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />

      {/* 👁️ New Password field with toggle */}
      <div className="relative mb-2">
        <input
          className="border p-2 w-full pr-10"
          type={passwordVisible ? "text" : "password"}
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <button
          type="button"
          onClick={() => setPasswordVisible((prev) => !prev)}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-600"
        >
          {passwordVisible ? "🙈" : "👁️"}
        </button>
      </div>

      <button
        className="bg-green-600 text-white px-4 py-2 rounded w-full"
        onClick={handleResetPassword}
      >
        Confirm Reset
      </button>

      {message && <p className="mt-4 text-sm text-blue-600">{message}</p>}
    </div>
  );
}
