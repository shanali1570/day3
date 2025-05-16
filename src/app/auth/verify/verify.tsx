/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { useState } from "react"
import { confirmSignUp } from "@/lib/auth"

export default function VerifyCodeForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get("email") || ""

  const [code, setCode] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!code.trim()) {
      setError("Verification code is required.")
      return
    }

    setError("")
    setLoading(true)
    try {
      await confirmSignUp(email, code)
      router.push("/auth/login")
    } catch (err: any) {
      setError(err.message || "Verification failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Verify Your Email</h2>
        
        <form onSubmit={handleVerify} className="space-y-6">
          {/* Verification Code Input */}
          <div className="space-y-2">
            <label htmlFor="verificationCode" className="block text-sm font-medium text-gray-600">Enter Verification Code</label>
            <input
              id="verificationCode"
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter your code"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
              aria-describedby="verificationCodeError"
            />
          </div>

          {/* Error message */}
          {error && (
            <p id="verificationCodeError" className="text-red-500 text-sm text-center">{error}</p>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 disabled:bg-gray-400 transition duration-200"
          >
            {loading ? "Verifying..." : "Verify Code"}
          </button>

          {/* Redirect to login page */}
          <div className="text-center text-sm mt-4">
            Already have an account?{" "}
            <a href="/auth/login" className="text-indigo-600 hover:underline">Log in</a>
          </div>
        </form>
      </div>
    </div>
  )
}
