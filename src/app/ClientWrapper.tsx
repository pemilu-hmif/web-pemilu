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
  const isLoginPage = pathname === "/login";

  return (
    
    <SessionProvider>
      {!isLoginPage && <NavBar />}
      {children}
      {!isLoginPage && <Footer />}
    </SessionProvider>
  );
}
