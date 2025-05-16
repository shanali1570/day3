/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { redirectToGoogleOAuth, redirectToMicrosoftOAuth, signUp } from "@/lib/auth"
import { FcGoogle } from "react-icons/fc"
import { TfiMicrosoftAlt } from "react-icons/tfi"
import { HiEye, HiEyeOff } from "react-icons/hi"
import Link from "next/link"

export default function SignupForm() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsSubmitting(true)

    try {
      // Assuming signUp returns a promise and throws on error
      await signUp(email, password)
      router.push("/auth/login")
    } catch (err: any) {
      console.error("Signup error:", err)
      setError(err.message || "Signup failed")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-tr from-indigo-100 via-purple-100 to-pink-100 px-4 py-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-6 animate-fade-in">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800">Create an Account 🚀</h2>
          <p className="text-sm text-gray-500 mt-2">Sign up to get started</p>
        </div>

        {/* Social signups */}
        <div className="space-y-3">
          <button
            onClick={redirectToMicrosoftOAuth}
            type="button"
            className="w-full flex items-center justify-center gap-3 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            <TfiMicrosoftAlt />
            <span className="text-sm font-medium text-gray-700">Continue with Microsoft</span>
          </button>
          <button
            onClick={redirectToGoogleOAuth}
            type="button"
            className="w-full flex items-center justify-center gap-3 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            <FcGoogle />
            <span className="text-sm font-medium text-gray-700">Continue with Google</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex-grow h-px bg-gray-300" />
          <span className="text-sm text-gray-400">or sign up with email</span>
          <div className="flex-grow h-px bg-gray-300" />
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="********"
                className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 hover:text-indigo-600"
                tabIndex={-1}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <HiEyeOff size={20} /> : <HiEye size={20} />}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && <p className="text-sm text-red-500 text-center">{error}</p>}

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 text-white bg-indigo-600 hover:bg-indigo-700 rounded-md font-medium transition"
          >
            {isSubmitting ? "Signing up..." : "Sign Up"}
          </button>

          {/* Login redirect */}
          <p className="text-sm text-center text-gray-500">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-indigo-600 hover:underline">Log in</Link>
          </p>
        </form>

        {/* Terms */}
        <p className="text-xs text-center text-gray-400">
          By continuing, you agree to our{" "}
          <a href="#" className="text-indigo-600 hover:underline">Terms</a> and{" "}
          <a href="#" className="text-indigo-600 hover:underline">Privacy Policy</a>.
        </p>
      </div>
    </div>
  )
}
