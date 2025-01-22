import Google from "next-auth/providers/google";
import type { JWT } from "next-auth/jwt";
import { env } from "~/env";
import NextAuth, {
  NextAuthOptions,
} from "next-auth";

interface TokenUser {
  id: string;
  email: string | null;
  name: string | null;
  image?: string | null;
}

interface CustomJWT extends JWT {
  accessToken?: string;
  accessTokenExpires?: number;
  refreshToken?: string;
  user?: TokenUser;
  error?: string;
}

interface TokenResponse {
  access_token: string;
  expires_in: number;
  refresh_token?: string;
}

type StrictUser = {
  id: string;
  email: string;
  name: string;
  image?: string;
};

class RefreshTokenError extends Error {
  details: unknown;

  constructor(message: string, details: unknown) {
    super(message);
    this.name = "RefreshTokenError";
    this.details = details;
  }
}

export const authOptions: NextAuthOptions = {
  
  providers: [
    Google({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          // prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  pages: {
    signIn: "/auth/login/",
    signOut: "/auth/login/",
    error: "/auth/error/",
  },
  secret: env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 60*60*24, // one day
  },
  callbacks: {
    async signIn({ profile }) {
      const allowedDomain = "std.stei.itb.ac.id";
      if (profile?.email?.endsWith(`@${allowedDomain}`)) {
        return true;
      } else {
        return false;
      }
    },
    async jwt({ token, account, user }): Promise<JWT> {
      // Initial sign in
      if (account && user) {
        const customToken: CustomJWT = {
          accessToken: account.access_token,
          accessTokenExpires: Date.now() + (account.expires_at ?? 0) * 1000,
          refreshToken: account.refresh_token,
          user: {
            id: user.id,
            email: user.email ?? null,
            name: user.name ?? null,
            image: user.image ?? null,
          },
        };
        return customToken;
      }

      // Return previous token if the access token has not expired yet
      if (token.accessTokenExpires && Date.now() < token.accessTokenExpires) {
        return token;
      }

      // Access token has expired, try to update it
      return refreshAccessToken(token);
    },
    async session({ session, token }) {
      if (token.user) {
        const strictUser: StrictUser = {
          id: token.user.id,
          email: token.user.email ?? "", // Default to an empty string if null
          name: token.user.name ?? "",   // Default to an empty string if null
          image: token.user.image ?? "",       // Optional field remains as is
        };
        session.user = strictUser; 
      }
      session.accessToken = token.accessToken;
      session.error = token.error;

      return session;
    },
  },
};

async function refreshAccessToken(token: CustomJWT): Promise<CustomJWT> {
  try {
    const response = await fetch("https://oauth2.googleapis.com/token", {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        grant_type: "refresh_token",
        refresh_token: token.refreshToken!,
      }),
      method: "POST",
    });

    const refreshedTokens = (await response.json()) as TokenResponse;

    if (!response.ok) {
      //was throw refrshedTokens
      throw new RefreshTokenError("Failed to refresh access token", refreshedTokens);
    }
    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken,
    };
  } catch (error) {
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

export default NextAuth(authOptions);
