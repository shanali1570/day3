"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // ✅ Update: check from localStorage instead of cookie
    const token = localStorage.getItem("accessToken");
    setIsLoggedIn(!!token);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-tr from-indigo-100 via-purple-100 to-pink-100 px-4 text-center">
      <h1 className="text-4xl font-bold text-blue-800 mb-4">Welcome to MyApp 🚀</h1>
      <p className="text-gray-700 max-w-md mb-6">
        Your all-in-one platform for secure, simple access. Log in to manage your
        dashboard and get started.
      </p>

      {/* ✅ Show this only when logged in */}
      {isLoggedIn && (
        <button
          onClick={() => router.push("/auth/dashboard")}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
        >
          Go to Dashboard
        </button>
      )}
    </div>
  );
}
