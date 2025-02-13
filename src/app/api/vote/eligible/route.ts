import { db } from "~/server/db";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export const dynamic = 'force-dynamic';
export async function GET(req:NextRequest) {
  try{
    const token = await getToken({ req, secret: process.env.JWT_SECRET });
    if(!token?.user?.email){
        return NextResponse.json(
            { eligible: false,hasVoted:false ,message: "Not authenticated" },
            { status: 401 }
          );
    }    
    const user = await db.user.findUnique({
        where: {
          email: token?.user?.email,
        },
        select: {
          email: true,
          kahim_email: true,
          senat_email: true,
        },
      });
      if (!user) {
        return NextResponse.json(
          { eligible: false,hasVoted:false, message: "User not found" },
          { status: 404 }
        );
      }
      const isEligible = user.email && user.kahim_email === null && user.senat_email === null;
      return NextResponse.json(
        { 
          eligible: isEligible,
          hasVoted: !isEligible,
          message: isEligible ? "User is eligible" : "User is not eligible"
        },
        { status: 200 }
      );
  } catch (error){
    console.error("Error checking eligibility:", error);
    return NextResponse.json(
      { eligible: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}