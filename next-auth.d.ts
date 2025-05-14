// types/next-auth.d.ts or just next-auth.d.ts at root

import NextAuth from 'next-auth'

declare module 'next-auth' {
  interface Session {
    accessToken?: string
    idToken?: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken?: string
    idToken?: string
  }
}
