/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  sendResetEmail,
  confirmPasswordReset,
} from "@/lib/auth"
import { HiEye, HiEyeOff } from "react-icons/hi"  // using react-icons for eye icon, install with: npm i react-icons


export default function ResetPassword() {
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [email, setEmail] = useState("")
  const [code, setCode] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(0)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const router = useRouter()

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setMessage("")

    if (!email) {
      setError("Please enter your email address.")
      return
    }

    setIsSubmitting(true)
    try {
      await sendResetEmail(email)
      setMessage("Verification code sent to your email.")
      setStep(2)
    } catch (err: any) {
      setError(err.message || "Failed to send reset email.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleVerifyCode = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setMessage("")

    if (!code) {
      setError("Please enter the verification code.")
      return
    }

    setMessage("Code verified. Now enter your new password.")
    setStep(3)
  }

  const handleResendCode = async () => {
    if (!email) return
    try {
      await sendResetEmail(email)
      setMessage("Verification code resent.")
      setResendCooldown(30) // 30 seconds cooldown
    } catch (err: any) {
      setError(err.message || "Failed to resend code.")
    }
  }

  useEffect(() => {
    if (resendCooldown === 0) return
    const timer = setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(timer)
  }, [resendCooldown])

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setMessage("")

    if (!newPassword || !confirmPassword) {
      setError("Please enter and confirm your new password.")
      return
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }

    setIsSubmitting(true)
    try {
      await confirmPasswordReset(email, code, newPassword)
      setMessage("Password reset successfully. Redirecting to login...")
      setTimeout(() => router.push("/auth/login"), 3000)
    } catch (err: any) {
      setError(err.message || "Failed to reset password.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-tr from-indigo-100 via-purple-100 to-pink-100 px-4 py-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-6 animate-fade-in">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800">Reset Password 🔐</h2>
          <p className="text-sm text-gray-500 mt-2">
            {step === 1 && "Enter your email to receive a verification code."}
            {step === 2 && "Enter the verification code sent to your email."}
            {step === 3 && "Set your new password."}
          </p>
        </div>

        {step === 1 && (
          <form onSubmit={handleSendCode} className="space-y-4">
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

            {error && <p className="text-sm text-red-500 text-center">{error}</p>}
            {message && <p className="text-sm text-green-600 text-center">{message}</p>}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 text-white bg-indigo-600 hover:bg-indigo-700 rounded-md font-medium transition disabled:bg-gray-400"
            >
              {isSubmitting ? "Sending..." : "Send Verification Code"}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerifyCode} className="space-y-4">
            <div>
              <label htmlFor="code" className="block text-sm font-medium text-gray-700">Verification Code</label>
              <input
                id="code"
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Enter code"
                className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <button
              type="button"
              onClick={handleResendCode}
              disabled={resendCooldown > 0}
              className="text-sm text-indigo-600 hover:underline mt-2"
            >
              {resendCooldown > 0 ? `Resend Code in ${resendCooldown}s` : "Resend Code"}
            </button>

            {error && <p className="text-sm text-red-500 text-center">{error}</p>}
            {message && <p className="text-sm text-green-600 text-center">{message}</p>}

            <button
              type="submit"
              className="w-full py-3 text-white bg-indigo-600 hover:bg-indigo-700 rounded-md font-medium transition"
            >
              Verify Code
            </button>
          </form>
        )}

        {step === 3 && (
  <form onSubmit={handleResetPassword} className="space-y-4">
    <div className="relative">
      <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">New Password</label>
      <input
        id="newPassword"
        type={showNewPassword ? "text" : "password"}
        required
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        placeholder="New Password"
        className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none pr-10"
      />
      <button
        type="button"
        onClick={() => setShowNewPassword(!showNewPassword)}
        className="absolute right-3 top-[38px] text-gray-500 hover:text-gray-700 focus:outline-none"
        tabIndex={-1}  // to avoid tab focusing this button
        aria-label={showNewPassword ? "Hide password" : "Show password"}
      >
        {showNewPassword ? <HiEyeOff size={20} /> : <HiEye size={20} />}
      </button>
    </div>

    <div className="relative">
      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
      <input
        id="confirmPassword"
        type={showConfirmPassword ? "text" : "password"}
        required
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        placeholder="Confirm Password"
        className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none pr-10"
      />
      <button
        type="button"
        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
        className="absolute right-3 top-[38px] text-gray-500 hover:text-gray-700 focus:outline-none"
        tabIndex={-1}
        aria-label={showConfirmPassword ? "Hide password" : "Show password"}
      >
        {showConfirmPassword ? <HiEyeOff size={20} /> : <HiEye size={20} />}
      </button>
    </div>

    {error && <p className="text-sm text-red-500 text-center">{error}</p>}
    {message && <p className="text-sm text-green-600 text-center">{message}</p>}

    <button
      type="submit"
      disabled={isSubmitting}
      className="w-full py-3 text-white bg-indigo-600 hover:bg-indigo-700 rounded-md font-medium transition disabled:bg-gray-400"
    >
      {isSubmitting ? "Resetting..." : "Reset Password"}
    </button>
  </form>
)}

        <div className="text-center mt-6">
          <a href="/auth/login" className="text-indigo-600 hover:underline text-sm">
            Back to Login
          </a>
        </div>
      </div>
    </div>
  )
}
