"use client";
import { useSession } from "next-auth/react";
import { useState } from "react";
import DialogBox from "~/components/DialogBox";
import LoadingSpinner from "~/components/LoadingSpinner";
import Onboarding from "~/components/coblos-wizard";

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
        <div className="flex items-center justify-center h-screen sm:mt-[130px] mt-[30px] sm:mb-[140px] mb-[-28px]">
          <Onboarding/>
        </div>
    );
}
