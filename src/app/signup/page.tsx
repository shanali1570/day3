"use client"; // Make sure this is at the very top of the file

import { useState } from "react";
import { CognitoUserAttribute } from "amazon-cognito-identity-js";
import { userPool } from "@/lib/cognito";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";

// Helper function for email validation
const validateEmail = (email: string) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

// Helper function for password validation
const validatePassword = (password: string) => {
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,}$/;

  if (password.length < 8) {
    return "Password must be at least 8 characters.";
  }

  if (!passwordRegex.test(password)) {
    return "Password must include at least one letter (uppercase and lowercase), one number, and one special character.";
  }

  return "";
};

export default function SignUpPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const errors: { [key: string]: string } = {};

    if (!name) {
      errors.name = "Full Name is required.";
    }

    if (!email) {
      errors.email = "Email is required.";
    } else if (!validateEmail(email)) {
      errors.email = "Please enter a valid email address.";
    }

    if (!password) {
      errors.password = "Password is required.";
    } else {
      const passwordError = validatePassword(password);
      if (passwordError) {
        errors.password = passwordError;
      }
    }

    return errors;
  };

  const handleSignUp = () => {
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const attributeList = [
      new CognitoUserAttribute({ Name: "email", Value: email }),
      new CognitoUserAttribute({ Name: "name", Value: name }),
    ];

    const username = email; // Use email directly as the username

    userPool.signUp(username, password, attributeList, [], (err, _result) => {
      console.log("SignUp result:", _result);
      if (err) {
        console.error(err);

        const error = err as unknown;

        if (error && typeof error === "object" && "code" in error) {
          const typedError = error as { code: string; message: string };

          if (typedError.code === "UsernameExistsException") {
            setMessage(
              "This email is already registered. Please log in or reset your password."
            );
          } else {
            setMessage(typedError.message || "Signup failed.");
          }
        } else {
          setMessage("An unknown error occurred.");
        }
        return;
      }

      setMessage("Signup successful! Please check your email to confirm.");

      setTimeout(() => {
        router.push(
          `/confirm?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`
        );
      }, 2000);
    });
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Sign Up</h1>

      <input
        className={`border p-2 w-full mb-2 ${errors.name ? "border-red-500" : ""}`}
        type="text"
        placeholder="Full Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}

      <input
        className={`border p-2 w-full mb-2 ${errors.email ? "border-red-500" : ""}`}
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

      <div className="relative mb-2">
        <input
          className={`border p-2 w-full pr-10 ${errors.password ? "border-red-500" : ""}`}
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
      {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}

      <button
        className="bg-green-600 text-white px-4 py-2 rounded w-full"
        onClick={handleSignUp}
      >
        Sign Up
      </button>

      <button
        className="bg-blue-600 text-white px-4 py-2 rounded w-full mt-3"
        onClick={() => signIn("google")}
      >
        Continue with Google
      </button>

      <button
        className="bg-[#2F2F2F] text-white px-4 py-2 rounded w-full mt-3"
        onClick={() => signIn("microsoft")}
      >
        Continue with Microsoft
      </button>

      {message && <p className="mt-4 text-sm text-blue-600">{message}</p>}

      <p className="mt-4 text-sm">
        Already signed up but didn’t confirm?{" "}
        <Link href="/confirm" className="text-blue-600 underline">
          Confirm here
        </Link>
      </p>
    </div>
  );
}
