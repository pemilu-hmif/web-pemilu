import { NextResponse } from "next/server";
import { db } from "~/server/db";
import { hashSync } from "bcrypt-ts";

//contoh body
// {
//     "userEmail": "user-id-here",
//     "kahimEmail": "new-kahim-id",
//     "senatEmail": "new-senat-id"
// }


//i used kahim_id and senat_id as kahim and senat's email, biar ga banyak api call
export async function PATCH(req: Request) {
    try{
        const {userEmail,kahimEmail,senatEmail} = await req.json();
        if(!userEmail||!kahimEmail||!senatEmail){
            return NextResponse.json(
                {error: "user, kahim, and senat email are required"},
                {status: 400}
            );
        }
        // Fetch current user data to check existing values
        const existingUser = await db.user.findUnique({
            where: { email: userEmail },
            select: { kahim_email: true, senat_email: true },
        });
        if (!existingUser) {
            return NextResponse.json({ error: "User not found." }, { status: 404 });
        }

        if (existingUser.kahim_email !== null || existingUser.senat_email !== null) {
            return NextResponse.json(
                { error: "You've already voted." },
                { status: 403 }
            );
        }

        //nanti harus di hash dl setelah dbnya di update
        const hashedKahimEmail = hashSync(kahimEmail,10);
        const hashedSenatEmail = hashSync(senatEmail, 10);

        //the update/voting part
        const updatedUser= await db.user.update({
            where: {email: userEmail},
            data: {
                kahim_email: hashedKahimEmail,
                senat_email: hashedSenatEmail,
            },
        });
        return NextResponse.json({ message: "User updated successfully", user: updatedUser });
    } catch (error){
        console.error("Error updating user:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });       
    }
}