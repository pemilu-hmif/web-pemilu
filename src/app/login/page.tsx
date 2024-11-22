"use client";
import React, { useState } from "react";
import Image from "next/image";
import logo from "public/login/login_logo.png";
import google from "public/login/google.svg";
import { signIn, useSession } from "next-auth/react";
import LoadingSpinner from "~/components/LoadingSpinner";
import DialogBox from "~/components/DialogBox";

export async function doLogin() {
  await signIn("google", { callbackUrl: "/" });
}

const LoginPage = () => {
  const { data: session, status } = useSession();
  const [showDialog, setShowDialog] = useState(false);
  if (status === "loading") {
    return <LoadingSpinner/>;
  }
  if (status === "authenticated" && !showDialog) {
    return (
      <DialogBox
        title="User have been login"
        message="You are have been login. Let's go to home page."
        onConfirm={() => (window.location.href = "/")}
        onCancel={() => setShowDialog(true)} // Menutup dialog
      />
    );
  }
  return (
    <div className="flex min-h-screen items-center justify-center">
      {/* Left section with logo - hidden on mobile */}
      <div className="hidden w-1/2 items-center justify-center md:flex">
        <Image alt="logo" src={logo} width={521} height={497} priority />
      </div>

      {/* Right section - full width on mobile */}
      <div className="flex min-h-screen w-full items-center justify-center p-4 md:w-1/2 md:bg-[#FAFAFA] md:p-8">
        <div className="w-full max-w-md">
          <div className="mb-8 text-start text-[#FAFAFA] md:text-[#3F3F3F]">
            <h1 className="mb-2 font-neuething text-4xl md:text-6xl">
              Welcome
            </h1>
            <h2 className="mb-1 text-6xl md:mb-4">
              <span className="font-sloop text-8xl">B</span>
              <span className="font-playfair">ack</span>
            </h2>
            <p className="font-satoshi text-sm tracking-wide md:text-lg md:font-semibold">
              Hey, Pips! Log in with your std email to get you in
            </p>
          </div>

          <button
            onClick={doLogin}
            className="flex w-full items-center justify-center gap-4 rounded-full border border-[#3F3F3F] bg-white p-2 font-satoshi text-sm font-bold text-[#3F3F3F] transition-colors hover:bg-gray-50 md:p-4 md:text-base"
          >
            <Image
              className="h-[18px] w-[18px] md:h-[28px] md:w-[28px]"
              alt="google"
              src={google}
            />
            Log in with Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
