// src/app/user-info.tsx
"use client";

import { useEffect, useState } from "react";
import {jwtDecode} from "jwt-decode";

type DecodedToken = {
  email?: string;
  name?: string;
};

export default function UserInfo() {
  const [user, setUser] = useState<DecodedToken | null>(null);

  useEffect(() => {
    // ✅ Read token from cookie
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("id_token="))
      ?.split("=")[1];

    if (token) {
      try {
        const decoded = jwtDecode<DecodedToken>(token);
        setUser(decoded);
      } catch (err) {
        console.error("Token decode failed:", err);
      }
    }
  }, []);

  if (!user) return null;

  return (
    <div className="p-4 bg-gray-100 rounded shadow text-sm">
      <p><strong>Name:</strong> {user.name || "N/A"}</p>
      <p><strong>Email:</strong> {user.email}</p>
    </div>
  );
}
