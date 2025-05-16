"use client"
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function MicrosoftCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  useEffect(() => {
    if (code) {
      const fetchUserInfo = async () => {
        try {
          // Exchange code for tokens
          const clientId = process.env.NEXT_PUBLIC_CLIENT_ID
          const redirectUri = `${window.location.origin}/auth/callback/microsoft`

          const tokenRes = await fetch("https://shanpool-app.auth.us-east-1.amazoncognito.com/oauth2/token", {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
              grant_type: "authorization_code",
              client_id: clientId!,
              code: code!,
              redirect_uri: redirectUri,
            }),
          })

          const tokenData = await tokenRes.json()

          if (!tokenData.access_token) {
            throw new Error("Failed to fetch access token")
          }

          const userInfoRes = await fetch("https://shanpool-app.auth.us-east-1.amazoncognito.com/oauth2/userInfo", {
            headers: {
              Authorization: `Bearer ${tokenData.access_token}`,
            },
          })

          const userInfo = await userInfoRes.json()
          console.log("User Info:", userInfo)

          // Store email and username in localStorage
          localStorage.setItem("accessToken", tokenData.access_token)
          localStorage.setItem("email", userInfo.email)
          localStorage.setItem("username", userInfo.email.split("@")[0]) //  username

          router.push("/auth/dashboard")
        } catch (err) {
          console.error("OAuth callback error:", err)
         }
      }

      fetchUserInfo()
    }
  }, [code, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <div className="animate-spin h-10 w-10 rounded-full border-4 border-blue-400 border-t-transparent mx-auto mb-4" />
        <h1 className="text-xl font-semibold text-gray-800">Signing you in...</h1>
        {error && (
          <p className="mt-2 text-red-500">Error: {error}</p>
        )}
        {!code && !error && (
          <p className="mt-2 text-gray-500">Waiting for authorization code...</p>
        )}
      </div>
    </div>
  );
}
