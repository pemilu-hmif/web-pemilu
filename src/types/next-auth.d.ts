import { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session extends DefaultSession {
    accessToken?: string
    error?: string
    user: {
      id: string
      email: string
      name: string
      image?: string
    } & DefaultSession["user"]
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    [key: string]: unknown  // Add index signature, was any
    accessToken?: string
    accessTokenExpires?: number
    refreshToken?: string
    error?: string
    user?: {
      id: string
      email: string | null
      name: string | null
      image?: string | null
    }
  }
}