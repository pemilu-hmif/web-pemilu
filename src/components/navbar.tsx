"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useMemo, useCallback } from "react";
import { Menu, User, X } from "lucide-react";
import { twMerge } from "tailwind-merge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export default function NavBar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = useMemo(
    () => [
      { name: "Beranda", href: "/" },
      { name: "Coblos", href: "/coblos" },
      { name: "Tata Cara", href: "/tata-cara" },
      { name: "Peraturan", href: "/peraturan" },
      { name: "Profil", href: "/profile" },
    ],
    [],
  );

  const toggleMenu = useCallback(() => setIsOpen((prev) => !prev), []);

  const renderNavLink = (navLink: { name: string; href: string }) => (
    <Link
      key={navLink.name}
      href={navLink.href}
      className={`hidden px-4 py-2 text-center font-satoshi text-xl font-bold underline-offset-4 hover:text-green-700 md:flex ${
        pathname === navLink.href ? "text-green-700 underline" : ""
      }`}
      onClick={isOpen ? toggleMenu : undefined}
    >
      {navLink.name === "Profil" ? (
        <Avatar className="size-10 text-black">
          <AvatarImage src="3d_avatar_5.svg" alt="Profil" />
          <AvatarFallback>
            <User className="size-8" />
          </AvatarFallback>
        </Avatar>
      ) : (
        navLink.name
      )}
    </Link>
  );

  return (
    <nav className="fixed left-0 top-0 z-50 flex w-screen items-center justify-center bg-[#FAFAFA]">
      <div className="w-[90%] px-6 py-3">
        <div className="flex w-full flex-row items-center justify-between">
          <Link href="/">
            <img
              src="/logo.svg"
              alt="logo"
              className="h-[70%] w-[70%] md:h-full"
            />
          </Link>
          <div className="flex flex-row items-center gap-3.5 lg:gap-5">
            {navLinks.map(renderNavLink)}
          </div>
          <button
            onClick={toggleMenu}
            className="md:hidden"
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
          >
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>
        {isOpen && (
          <div
            className="mt-3 flex flex-col items-start justify-start self-stretch md:hidden"
            role="menu"
          >
            {navLinks.map((navLink) => (
              <Link
                key={navLink.name}
                href={navLink.href}
                className="mt-2 inline-flex items-center justify-start gap-[10px] self-stretch bg-[#FAFAFA] py-2"
                onClick={toggleMenu}
                role="menuitem"
              >
                <div
                  className={twMerge(
                    "text-md text-center font-satoshi font-bold leading-normal",
                    pathname === navLink.href ? "text-green-700 underline" : "",
                  )}
                >
                  {navLink.name}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
