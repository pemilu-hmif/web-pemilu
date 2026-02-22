"use client";

import { useSession } from "next-auth/react";
import DialogBox from "~/components/DialogBox";
import LoadingSpinner from "~/components/LoadingSpinner";
import Onboarding from "~/components/coblos-wizard";
import { api } from "~/trpc/react";

export default function CoblosPage() {
  const { status } = useSession();

  // 🔥 ALL hooks must be declared before any return
  const config = api.admin.configuration.config.get.useQuery(undefined, {
    enabled: status === "authenticated",
  });

  const myStatus = api.vote.myStatus.useQuery(undefined, {
    enabled: status === "authenticated",
  });

  const electionId = myStatus.data?.activeElectionId;

  const election = api.admin.configuration.election.get.useQuery(
    { id: electionId ?? "" },
    {
      enabled: status === "authenticated" && !!electionId,
    },
  );

  // ---------------------------
  // After ALL hooks are declared
  // ---------------------------

  const voteDateStart = new Date(2025, 2, 1, 1, 0, 0);
  const voteDateEnd = new Date(2026, 2, 19, 1, 0, 0);
  const now = new Date();
  const isVoteDate = now > voteDateStart && now < voteDateEnd;

  // Loading state
  if (
    status === "loading" ||
    config.isLoading ||
    myStatus.isLoading ||
    election.isLoading
  ) {
    return <LoadingSpinner />;
  }

  // Unauthenticated
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

  // Coblos disabled
  if (!config.data?.coblos) {
    return null;
  }

  // Error from myStatus
  if (myStatus.isError) {
    return (
      <DialogBox
        title="Error"
        message={myStatus.error.message ?? "Failed to load voting status."}
        onConfirm={() => (window.location.href = "/")}
        onCancel={() => (window.location.href = "/")}
      />
    );
  }

  // Not eligible
  if (!myStatus.data?.isEligible) {
    return (
      <DialogBox
        title="Not Eligible"
        message="Kamu tidak eligible untuk masuk. Informasi lengkap bisa dilihat di page profile."
        onConfirm={() => (window.location.href = "/profile")}
        onCancel={() => (window.location.href = "/")}
      />
    );
  }

  // Not within voting date
  if (!isVoteDate) {
    return (
      <DialogBox
        title="Belum Waktunya"
        message="Voting belum dimulai atau sudah berakhir."
        onConfirm={() => (window.location.href = "/")}
        onCancel={() => (window.location.href = "/")}
      />
    );
  }

  // Build candidates
  const links = election.data?.calons ?? [];

  const activeCalons = links
    .filter((ec) => ec.isActive && ec.calon?.isActive)
    .map((ec) => ec.calon);

  const kahimCandidates = activeCalons
    .filter((c) => c.type === "KAHIM")
    .sort((a, b) => (a.number ?? 0) - (b.number ?? 0));

  const senatCandidates = activeCalons
    .filter((c) => c.type === "SENAT")
    .sort((a, b) => (a.number ?? 0) - (b.number ?? 0));

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-5 py-10">
      <div className="mt-12 max-w-[95%] [@media(max-width:350px)]:max-w-[90%]">
        <Onboarding
          kahimCandidates={kahimCandidates}
          senatCandidates={senatCandidates}
          hasVoted={myStatus.data.hasVoted}
          existingVote={myStatus.data.vote ?? null}
        />
      </div>
    </div>
  );
}
