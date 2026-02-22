"use client";

import { useSession } from "next-auth/react";
import DialogBox from "~/components/DialogBox";
import LoadingSpinner from "~/components/LoadingSpinner";
import ProfileCard from "~/components/profile-card";
import { api } from "~/trpc/react";
import type { ProfileUser } from "~/types/user";

export default function Profile() {
  const { data: session, status } = useSession();
  const me = api.user.me.useQuery(undefined, {
    enabled: status === "authenticated",
  });

  if (status === "loading" || me.isLoading) {
    return <LoadingSpinner />;
  }

  if (status === "unauthenticated") {
    return (
      <DialogBox
        title="Unauthorized"
        message="You are not authenticated. Please log in to continue."
        onConfirm={() => (window.location.href = "/auth/login")}
        onCancel={() => (window.location.href = "/auth/login")}
      />
    );
  }

  if (!me.data) {
    return (
      <DialogBox
        title="Error"
        message="Failed to load profile."
        onConfirm={() => window.location.reload()}
        onCancel={() => (window.location.href = "/")}
      />
    );
  }

  const userProfile: ProfileUser = {
    id: me.data.id,
    email: me.data.email ?? "",
    name: me.data.name,
    image: session?.user?.image, // still from session unless you add image to Prisma User
    nim: me.data.nim ?? "",
    jurusan: me.data.jurusan,
    angkatan: me.data.angkatan ?? "",
    isEligible: me.data.isEligible,
    hasVoted: me.data.hasVoted,
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center pt-20 px-4">
      <div className="mt-16 flex items-center justify-center text-white">
        <h1 className="font-sloop text-7xl sm:text-9xl">P</h1>
        <h1 className="font-playfair text-6xl sm:text-8xl">rofil</h1>
      </div>
      <ProfileCard user={userProfile} />
    </div>
  );
}
