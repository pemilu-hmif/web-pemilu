"use server"
import NextAuth from "next-auth";
import { authOptions } from "~/server/auth";

export async function doLogin() {
    const signIn = NextAuth(authOptions);
    await signIn("google", { redirectTo: "/" });
}