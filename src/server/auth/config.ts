import { type DefaultSession, type NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { db } from "~/server/db";
import { env } from "~/env";

declare module "next-auth" {
  interface User {
    role: "ADMIN" | "USER";
  }

  interface Session extends DefaultSession {
    user: {
      id: string;
      email: string;
      name: string;
      image?: string;
    } & User;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: "ADMIN" | "USER";
  }
}

export const authConfig = {
  session: {
    strategy: "jwt",
  },

  providers: [
    Google({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          access_type: "offline",
          response_type: "code",
        },
      },
    }),

    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        id: { label: "ID", type: "text" },
        password: { label: "Password", type: "password" },
      },

      authorize: async (credentials) => {
        const id = credentials?.id as string | undefined;
        const password = credentials?.password as string | undefined;

        if (!id || !password) return null;

        const user = await db.user.findUnique({
          where: { id },
        });
        if (!user) return null;

        const isValid = await bcrypt.compare(password, user.passwordHash ?? "");
        if (!isValid) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],

  callbacks: {
    async signIn({ profile, account }) {
      if (account?.provider === "google") {
        const allowedDomain = "std.stei.itb.ac.id";
        const email = profile?.email;
        if (!email || !email.endsWith(`@${allowedDomain}`)) {
          return false;
        }

        await db.user.upsert({
          where: { email },
          update: {
            name: profile.name ?? undefined,
          },
          create: {
            email,
            name: profile.name ?? undefined,
            nim: email ? email.split("@")[0] : undefined,
            role: "USER",
          },
        });

        return true;
      }
      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        if (user.role) {
          token.id = user.id;
          token.role = user.role;
          return token;
        }

        if (user.email) {
          const dbUser = await db.user.findUnique({
            where: { email: user.email },
            select: { id: true, role: true },
          });

          if (dbUser) {
            token.id = dbUser.id;
            token.role = dbUser.role;
          }
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.id as string;
        session.user.role = token.role as "ADMIN" | "USER";
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
