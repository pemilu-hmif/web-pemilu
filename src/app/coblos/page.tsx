"use client";
import { useSession } from "next-auth/react";
import { useState } from "react";
import DialogBox from "~/components/DialogBox";
import LoadingSpinner from "~/components/LoadingSpinner";

export default function Coblos() {
    const { data: session, status } = useSession();
    const [showDialog, setShowDialog] = useState(false);
    if (status === "loading") {
      return <LoadingSpinner/>;
    }
    if (status === "unauthenticated" && !showDialog) {
      return (
        <DialogBox
          title="Unauthorized"
          message="You are not authenticated. Please log in to continue."
          onConfirm={() => (window.location.href = "/auth/login")}
          onCancel={() => setShowDialog(true)} // Menutup dialog
        />
      );
    }
    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <h1 className="
                text-4xl font-bold text-gray-800 font-['Satoshi Variable'] 
                lg:text-9xl lg:font-extrabold
            ">
                COMING SOON
            </h1>
        </div>
    );
}
