"use client";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useEffect } from "react";
import DialogBox from "~/components/DialogBox";
import LoadingSpinner from "~/components/LoadingSpinner";
import Onboarding from "~/components/coblos-wizard";

export default function Coblos() {
  const { data: session, status } = useSession();
  const [showDialog, setShowDialog] = useState(false);
  const [isEligible, setIsEligible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
      if (status === "authenticated") {
          checkEligibility();
      }
  }, [status]);

  const checkEligibility = async () => {
      try {
          const response = await fetch("http://localhost:3000/api/vote/eligible", {
              method: "GET",
              headers: {
                  "Content-Type": "application/json",
              },
          });

          if (!response.ok) {
              throw new Error("Failed to fetch eligibility");
          }

          const data = await response.json();
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
              onCancel={() => setShowDialog(true)}
          />
      );
  }

  if (!isEligible && showDialog) {
      return (
          <DialogBox
              title="Not Eligible"
              message="You are not eligible to proceed."
              onConfirm={() => (window.location.href = "/")}
              onCancel={() => setShowDialog(false)}
          />
      );
  }
    return (
        <div className="flex items-center justify-center h-screen sm:mt-[130px] mt-[30px] sm:mb-[140px] mb-[-28px]">
          {session?.user?.email && <Onboarding userEmailParam={session.user.email} />}
        </div>
    );
}
