"use client";
import { useSession } from "next-auth/react";
import { useState } from "react";
import DialogBox from "~/components/DialogBox";
import LoadingSpinner from "~/components/LoadingSpinner";
import PeraturanList from "~/components/peraturan-list";

export default async function TataCara() {
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
        onConfirm={() => (window.location.href = "/login")}
        onCancel={() => setShowDialog(true)} // Menutup dialog
      />
    );
  }
  return (
    <div className="mb-12 mt-32 flex flex-col items-center">
      <div className="container flex flex-col gap-16 p-4">
        {/* Title */}
        <div className="relative flex w-full flex-col items-center justify-center text-center text-white">
          <div className="relative flex gap-1">
            <h1 className="-rotate-12 font-sloop text-7xl sm:text-9xl">P</h1>
            <h1 className="font-playfair text-6xl sm:text-8xl">eraturan</h1>
          </div>
          <h1 className="mt-2 font-neuething text-5xl font-bold tracking-wide sm:text-7xl">
            PEMILU HMIF ITB
          </h1>
        </div>
        {/* Tata Cara List */}
        <PeraturanList />
      </div>
    </div>
  );
}
