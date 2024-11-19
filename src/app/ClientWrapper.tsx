"use client";

import NavBar from "~/components/navbar";
import Footer from "~/components/footer";
import { usePathname } from "next/navigation";

export default function ClientWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  return (
    <>
      {!isLoginPage && <NavBar />}
      {children}
      {!isLoginPage && <Footer />}
    </>
  );
}
