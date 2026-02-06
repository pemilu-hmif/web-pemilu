"use client";

import { signIn, useSession } from "next-auth/react";
import { useState } from "react";
import Image from "next/image";
import logo from "public/homepage/logo.png";
import LoadingSpinner from "~/components/LoadingSpinner";
import DialogBox from "~/components/DialogBox";


export default function AdminLoginPage() {
  const { status } = useSession();

  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await signIn("credentials", {
      id,
      password,
      redirect: false,
    });

    setLoading(false);

    if (res?.error) {
      setError("Invalid ID or password");
    } else {
      window.location.href = "/admin";
    }
  }

  if (status === "loading") {
    return <LoadingSpinner />;
  }

  if (status === "authenticated" && !showDialog) {
    return (
      <DialogBox
        title="Already logged in"
        message="You are already logged in as an admin."
        onConfirm={() => (window.location.href = "/admin")}
        onCancel={() => setShowDialog(true)}
      />
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      {/* Left section */}
      <div className="hidden w-1/2 items-center justify-center md:flex md:flex-col">
        <Image alt="logo" src={logo} width={264} height={245} priority />
        <p className="mt-10 font-neuething text-7xl text-white">PEMILU</p>
        <p className="font-neuething text-5xl text-white">HMIF 2026</p>
      </div>

      {/* Right section */}
      <div className="flex min-h-screen w-full items-center justify-center p-4 md:w-1/2 md:bg-[#FAFAFA] md:p-8">
        <div className="w-full max-w-md">
          <div className="mb-8 text-start text-[#FAFAFA] md:text-[#3F3F3F]">
            <h1 className="mb-2 font-neuething text-4xl md:text-6xl">Admin</h1>
            <h2 className="mb-1 text-6xl md:mb-4">
              <span className="font-sloop text-8xl">L</span>
              <span className="font-playfair">ogin</span>
            </h2>
            <p className="font-satoshi text-sm tracking-wide md:text-lg md:font-semibold">
              Enter your admin credentials to continue
            </p>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <input
              className="w-full rounded-md border border-gray-300 p-3 font-satoshi text-sm md:text-base"
              placeholder="Admin ID"
              value={id}
              onChange={(e) => setId(e.target.value)}
              required
            />

            <input
              type="password"
              className="w-full rounded-md border border-gray-300 p-3 font-satoshi text-sm md:text-base"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="mt-2 rounded-full bg-[#3F3F3F] p-3 font-satoshi text-sm font-bold text-white transition hover:bg-black disabled:opacity-50 md:text-base"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          {error && (
            <p className="mt-4 text-sm font-semibold text-red-600">{error}</p>
          )}
        </div>
      </div>
    </div>
  );
}
