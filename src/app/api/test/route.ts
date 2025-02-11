import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function GET(req:NextRequest) {
  const token = await getToken({ req, secret: process.env.JWT_SECRET });

  if (!token) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  return NextResponse.json({
    message: "Authenticated",
    user: token.user?.email, 
  });
}