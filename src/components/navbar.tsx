"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useMemo, useCallback, useEffect } from "react";
import { Menu, User, X } from "lucide-react";
import { twMerge } from "tailwind-merge";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { signOut, useSession } from "next-auth/react";
import { api } from "~/trpc/react";

export default function NavBar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  const [isOpen, setIsOpen] = useState(false);
  const [userInitial, setUserInitial] = useState<string | null>(null);

  const config = api.admin.configuration.config.get.useQuery(undefined, {
    enabled: status === "authenticated",
  });

  useEffect(() => {
    if (session?.user?.name) {
      const name = session.user.name.trim();
      setUserInitial(
        name.charAt(0) === "1"
          ? name.charAt(9)?.toUpperCase()
          : name.charAt(0).toUpperCase(),
      );
    }
  }, [session]);

  const toggleMenu = useCallback(() => setIsOpen((p) => !p), []);

  const logout = async () => {
    await signOut({ redirect: false });
    window.location.href = "/auth/login";
  };

  const navLinks = useMemo(() => {
    if (!config.data) return [];

    const links: { name: string; href: string }[] = [
      { name: "Beranda", href: "/" },
    ];

    if (config.data.coblos) {
      links.push({ name: "Coblos", href: "/coblos" });
    }

    if (config.data.peraturan) {
      links.push({ name: "Tata Cara", href: "/tata-cara" });
      links.push({ name: "Peraturan", href: "/peraturan" });
    }
    if (session?.user?.role === "ADMIN") {
      links.push({ name: "Admin", href: "/admin" });
    }

    links.push({ name: "Profil", href: "/profile" });

    links.push({ name: "Logout", href: "/auth/login" });

    return links;
  }, [config.data, session]);

  const renderNavLink = (navLink: { name: string; href: string }) => (
    <Link
      key={navLink.name}
      href={navLink.href}
      className={`hidden px-4 py-2 text-center font-satoshi text-xl font-bold underline-offset-4 hover:text-[#156E3C] md:flex ${
        pathname === navLink.href ? "text-[#156E3C] underline" : ""
      }`}
      onClick={isOpen ? toggleMenu : undefined}
    >
      {navLink.name === "Profil" ? (
        <Avatar className="size-10 bg-black text-white">
          <AvatarFallback className="bg-black text-white">
            {userInitial ?? <User className="size-8" />}
          </AvatarFallback>
        </Avatar>
      ) : navLink.name === "Logout" ? (
        <button
          className="rounded-xl bg-[#156E3C] px-4 py-2 text-[1.25rem] text-white transition-colors hover:bg-[#0C4224]"
          onClick={logout}
        >
          Sign out
        </button>
      ) : (
        navLink.name
      )}
    </Link>
  );

  if (status === "loading") return null;

  return (
    <nav className="fixed left-0 top-0 z-50 flex w-screen items-center justify-center bg-[#FAFAFA]">
      <div className="w-[90%] px-6 py-3">
        <div className="flex w-full items-center justify-between">
          <Link href="/">
            <img
              src="/logo.svg"
              alt="logo"
              className="h-[70%] w-[70%] md:h-full"
            />
          </Link>

          <div className="flex items-center gap-3.5 lg:gap-5">
            {navLinks.map(renderNavLink)}
          </div>

          <button
            onClick={toggleMenu}
            className="md:hidden"
            aria-expanded={isOpen}
          >
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>

        {isOpen && (
          <div className="mt-3 flex flex-col md:hidden">
            {navLinks.map((navLink) => (
              <Link
                key={navLink.name}
                href={navLink.href}
                className="mt-2 flex py-2"
                onClick={navLink.name === "Logout" ? logout : toggleMenu}
              >
                <span
                  className={twMerge(
                    "font-satoshi font-bold",
                    pathname === navLink.href ? "text-[#156E3C] underline" : "",
                  )}
                >
                  {navLink.name}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
