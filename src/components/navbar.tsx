"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { useState } from "react";

const navLinks = [
  { name: "Beranda", href: "/" },
  { name: "Coblos", href: "/coblos" },
  { name: "Tata Cara", href: "/tata-cara" },
  { name: "Peraturan", href: "/peraturan" },
  { name: "Profil", href: "/" },
];

export default function NavBar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <div className="fixed left-0 top-0 z-50 w-full justify-around bg-[#F8F7F2] px-[36px] py-[16px] lg:px-[72px] lg:py-[16px]">
        <div className="flex w-full flex-row items-center justify-between">
          <Link href="/">
            <img src="/logo.svg" alt="logo" loading="lazy" className="h-full" />
          </Link>
          <div className="flex flex-row items-center gap-[24px]">
            {navLinks.map((navLink) => (
              <Link
                key={navLink.name}
                href={navLink.href}
                className={clsx(
                  "font-['Satoshi Variable'] hidden gap-2.5 px-4 py-3 text-center text-2xl font-bold leading-[28.80px] text-[#3f3f3f] hover:text-[#156e3c] lg:flex",
                  {
                    "text-[#156e3c] underline": pathname === navLink.href,
                  },
                )}
                style={pathname === navLink.href ? { color: "#156e3c" } : {}}
              >
                {navLink.name === "Profil" ? (
                  <img src="3d_avatar_5.svg" alt="Profil" />
                ) : (
                  navLink.name
                )}
              </Link>
            ))}
          </div>
          <div className="lg:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="h-10 w-10">
              {isOpen ? (
                <img
                  src="/close.svg"
                  alt="close"
                  className="min-h-full min-w-full"
                />
              ) : (
                <img
                  src="/menu6.svg"
                  alt="menu"
                  className="min-h-full min-w-full"
                />
              )}
            </button>
          </div>
        </div>
        {/*drop down menu*/}
        {isOpen && (
          <div className="mt-3 flex h-[360.75px] flex-col items-start justify-start self-stretch lg:hidden">
            {navLinks.map((navLink) => (
              <Link
                key={navLink.name}
                href={navLink.href}
                className={clsx(
                  "ml-[-20px] inline-flex items-center justify-start gap-2.5 self-stretch bg-[#f8f7f2] px-6 py-5",
                  {
                    "text-[#156e3c] underline": pathname === navLink.href,
                  },
                )}
                style={pathname === navLink.href ? { color: "#156e3c" } : {}}
              >
                <div className="font-['Satoshi Variable'] text-center text-xl font-bold leading-normal text-[#3f3f3f]">
                  {navLink.name}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
