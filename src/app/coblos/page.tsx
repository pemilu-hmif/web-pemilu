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
    return (
        <div className="flex items-center justify-center h-screen sm:mt-[130px] mt-[30px] sm:mb-[140px] mb-[-28px]">
          {session?.user?.email && <Onboarding/>}
        </div>
    );
}
