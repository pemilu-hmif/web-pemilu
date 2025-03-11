"use client";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useEffect } from "react";
import DialogBox from "~/components/DialogBox";
import LoadingSpinner from "~/components/LoadingSpinner";
import Onboarding from "~/components/coblos-wizard";
import { eligibilityResponse } from "~/types/eligibilityResponse";


export default function Coblos() {
  const { data: session, status } = useSession();
  const [showDialog, setShowDialog] = useState(false);
  const [isEligible, setIsEligible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const voteDateStart = new Date(2025,2,17,1,0,0);
  const voteDateEnd = new Date(2025,2,19,1,0,0);
  const currentDate = new Date();
  const isVoteDate = (currentDate > voteDateStart) &&(currentDate<voteDateEnd);
console.log("voteDateStart:", voteDateStart);
console.log("voteDateEnd:", voteDateEnd);
console.log("currentDate:", currentDate);
console.log("isVoteDate:", isVoteDate);
  useEffect(() => {
    if (status === "authenticated") {
        void (async () => {
            await checkEligibility();
        })();
    }
}, [status]);

  const checkEligibility = async () => {
      try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/vote/eligible`, {
              method: "GET",
              headers: {
                  "Content-Type": "application/json",
              },
          });

          if (!response.ok) {
              throw new Error("Failed to fetch eligibility");
          }

          const data = await response.json() as eligibilityResponse;
          if (data.eligible) {
              setIsEligible(true);
          } else {
              setShowDialog(true);
          }
      } catch (error) {
          console.error("Error checking eligibility:", error);
          setShowDialog(true);
      } finally {
          setIsLoading(false);
      }
  };

  if (status === "loading" || isLoading) {
      return <LoadingSpinner />;
  }

  if (status === "unauthenticated" && !showDialog) {
      return (
          <DialogBox
              title="Unauthorized"
              message="You are not authenticated. Please log in to continue."
              onConfirm={() => (window.location.href = "/auth/login")}
              onCancel={() =>(window.location.href = "/auth/login")}
          />
      );
  }

  if (!isEligible) {
      return (
          <DialogBox
              title="Not Eligible"
              message="Kamu tidak eligible untuk masuk. Informasi lengkap bisa dilihat di page profile."
              onConfirm={() => (window.location.href = "/profile")}
              onCancel={() => (window.location.href = "/")}
          />
      );
  }

  if (!isVoteDate) {
    return (
        <DialogBox
            title="Belum Waktunya"
            message="Voting akan dilakukan pada tanggal 11 & 12 Maret 2025. Ditunggu ya !!!"
            onConfirm={() => (window.location.href = "/")}
            onCancel={() => (window.location.href = "/")}
        />
    );
}
    return (
        <div className="flex flex-col items-center justify-center min-h-screen px-5 py-10">
            <div className="max-w-[95%] [@media(max-width:350px)]:max-w-[90%] mt-12">
                {session?.user?.email && <Onboarding />}
            </div>
        </div>
    );
}
