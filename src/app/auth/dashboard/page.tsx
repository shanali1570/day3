"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import LogoutButton from "@/components/logoutButton"

export default function DashboardPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [username, setUserName] = useState<string | null>(null)

  useEffect(() => {
    const token = localStorage.getItem("accessToken")
    const username = localStorage.getItem("username")
    if (!token) {
      router.push("/auth/login")
    } else {
      setUserName(username)
      setLoading(false)
    }
  }, [router])

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-tr from-indigo-100 via-purple-100 to-pink-100 px-4">
        <div className="text-center">
          <div className="animate-spin border-4 border-indigo-600 border-t-transparent rounded-full w-14 h-14 mx-auto mb-5"></div>
          <p className="text-indigo-700 text-lg font-semibold">Loading your dashboard...</p>
        </div>
      </div>
    )

  return (
    <div className="min-h-screen bg-gradient-to-tr from-indigo-100 via-purple-100 to-pink-100 flex flex-col items-center py-12 px-6 relative">
      
      {/* Logout Button at Top Right */}
      <div className="absolute top-6 right-6">
        <LogoutButton />
      </div>

      <div className="bg-white max-w-3xl w-full rounded-3xl shadow-2xl p-10 space-y-8">
        <h1 className="text-4xl font-extrabold text-indigo-700 text-center">
          Welcome, {username} 👋
        </h1>
        <p className="text-center text-gray-600 text-lg">
          Here is your personalized dashboard.
        </p>

        <div className="grid gap-6 sm:grid-cols-2">
          <div className="border border-indigo-200 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow bg-indigo-50">
            <h3 className="text-indigo-700 font-semibold text-2xl mb-3">📊 Recent Activities</h3>
            <p className="text-indigo-900/90">View and track your latest interactions and changes.</p>
          </div>
          <div className="border border-indigo-200 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow bg-indigo-50">
            <h3 className="text-indigo-700 font-semibold text-2xl mb-3">⚙️ Account Settings</h3>
            <p className="text-indigo-900/90">Update your personal information and preferences.</p>
          </div>
          <div className="border border-indigo-200 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow bg-indigo-50 sm:col-span-2">
            <h3 className="text-indigo-700 font-semibold text-2xl mb-3">🔔 Notifications</h3>
            <p className="text-indigo-900/90">Stay informed with important messages and alerts.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
