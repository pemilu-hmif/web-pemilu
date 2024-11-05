"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { useState } from 'react';

const navLinks = [
    { name: "Beranda", href:"/" },
    { name: "Coblos", href:"/Coblos" },
    { name: "Tata Cara", href:"/TataCara" },
    { name: "Peraturan", href:"/Peraturan" },
    { name: "Profile", href:"/Profile" },
];

export default function NavBar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    return (
    <>
        <div className="fixed top-0 left-0 w-full z-50 justify-around bg-[#F8F7F2] lg:py-[16px] py-[16px] lg:px-[72px] px-[36px]">
            <div className="flex flex-row justify-between items-center w-full">
                <Link
                    href="/">
                    <img src="/logo.svg" alt="logo" loading="lazy" className="h-full"/>
                </Link>
                <div className="flex flex-row items-center gap-[24px]">
                        {navLinks.map((navLink) => (
                        <Link 
                            key={navLink.name}
                            href={navLink.href}
                            className={clsx(
                                "hidden lg:flex text-center text-[#3f3f3f] text-2xl font-bold font-['Satoshi Variable'] leading-[28.80px] hover:text-[#156e3c]", 
                                {
                                    "text-[#156e3c] underline": pathname === navLink.href
                                },
                            )}
                            style={pathname === navLink.href ? { color: '#156e3c' } : {}}
                            > {navLink.name}
                        </Link>
                    ))}
                </div>
                <div className="lg:hidden">
                    <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-10 h-10">
                        {isOpen ? (
                            <img
                            src = "/close.svg"
                            alt="close"
                            className="min-w-full min-h-full"
                            />
                        ) : (
                            <img
                            src="/menu6.svg"
                            alt="menu"
                            className="min-w-full min-h-full"
                            />
                        )
                        }
                    </button>
                </div>
            </div>
            {/*drop down menu*/}
                {isOpen && (
                    <div className="self-stretch h-[360.75px] flex-col justify-start items-start flex mt-3">
                            {navLinks.map((navLink) => (
                            <Link 
                                key={navLink.name}
                                href={navLink.href}
                                className={clsx(
                                    "self-stretch px-6 py-5 bg-[#f8f7f2] justify-start items-center gap-2.5 inline-flex ml-[-20px]", 
                                    {
                                        "text-[#156e3c] underline": pathname === navLink.href
                                    },
                                )}
                                style={pathname === navLink.href ? { color: '#156e3c' } : {}}
                                >
                                    <div className="text-center text-[#3f3f3f] text-xl font-bold font-['Satoshi Variable'] leading-normal">
                                        {navLink.name}
                                    </div>
                            </Link>
                        ))}
                    </div>
                )}
        </div>
    </>
    )
}
