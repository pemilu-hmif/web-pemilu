"use client";

import NavBar from "~/components/navbar";
import Footer from "~/components/footer";
import { usePathname } from "next/navigation";
import { SessionProvider } from "next-auth/react";

export default function ClientWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/auth/login";
  const isError = pathname === "/auth/error";

  return (
    <SessionProvider>
      <div className="flex flex-col min-h-screen">
        {!isLoginPage && !isError && <NavBar />}
        <main className="flex-grow">
          {children}
        </main>
        {!isLoginPage && !isError && <Footer />}
      </div>
    </SessionProvider>
  );
}

