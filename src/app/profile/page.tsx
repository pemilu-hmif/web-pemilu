"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import DialogBox from "~/components/DialogBox";
import LoadingSpinner from "~/components/LoadingSpinner";
import ProfileCard from "~/components/profile-card";
import { ProfileUser } from "~/types/user";
import { api } from "~/trpc/react";

export default function Profile() {
  const { data: session, status } = useSession();

  const config = api.admin.configuration.config.get.useQuery(undefined, {
    enabled: status === "authenticated",
  });

  const coblosEnabled = !!config.data?.coblos;

  const eligibility = api.admin.configuration.eligible.me.useQuery(undefined, {
    enabled: status === "authenticated",
  });

  if (status === "loading" || config.isLoading) {
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

  const user = session!.user;

  if (typeof user.email !== "string") {
    throw new Error("User email missing");
  }

  const nim = user.email.split("@")[0] ?? "";
  const kodeJurusan = nim.substring(0, 3);
  const angkatan = nim.substring(3, 5);

  const getJurusan = (kode: string) => {
    switch (kode) {
      case "135":
        return "IF";
      case "182":
        return "STI";
      default:
        return "Unknown";
    }
  };

  const nama = user.name?.slice(user.name.search(/[a-zA-Z]/)) ?? "Admin";

  const userProfile: ProfileUser = {
    id: user.id ?? "",
    email: user.email,
    name: nama,
    image: user.image,
    nim: nim,
    jurusan: getJurusan(kodeJurusan),
    angkatan: `20${angkatan}`,
    isEligible: !!eligibility.data?.eligible,
    hasVoted: coblosEnabled && false,
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center pt-20">
      <div className="mt-16 flex items-center justify-center text-white">
        <h1 className="font-sloop text-7xl sm:text-9xl">P</h1>
        <h1 className="font-playfair text-6xl sm:text-8xl">rofil</h1>
      </div>
      <ProfileCard user={userProfile} />
    </div>
  );
}
