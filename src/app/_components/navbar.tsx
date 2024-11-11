"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { useState } from 'react';

const navLinks = [
    { name: "Beranda", href:"/" },
    { name: "Coblos", href:"/coblos" },
    { name: "Tata Cara", href:"/tata-cara" },
    { name: "Peraturan", href:"/peraturan" },
    { name: "Profil", href:"/profil" },
];

export default function NavBar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    return (
    <>
        <div className="fixed top-0 left-0 w-full z-50 justify-around bg-[#FAFAFA] lg:py-[16px] py-[14px] lg:px-[72px] px-[24px]">
            <div className="flex flex-row justify-between items-center w-full">
                <Link
                    href="/">
                    <img src="/logo.svg" alt="logo" loading="lazy" className="lg:h-full h-[70%] w-[70%]"/>
                </Link>
                <div className="flex flex-row items-center gap-[24px]">
                        {navLinks.map((navLink) => (
                        <Link 
                            key={navLink.name}
                            href={navLink.href}
                            className={clsx(
                                "hidden lg:flex text-center text-[#3f3f3f] text-2xl font-bold font-['Satoshi Variable'] leading-[28.80px] hover:text-[#156e3c] px-4 py-3 gap-2.5", 
                                {
                                    "text-[#156e3c] underline": pathname === navLink.href
                                },
                            )}
                            style={pathname === navLink.href ? { color: '#156e3c' } : {}}
                            > 
                            {navLink.name === "Profil" ? (
                                <img src="3d_avatar_5.svg" alt="Profil"/>
                            ) : (navLink.name)
                            }
                        </Link>
                    ))}
                </div>
                <div className="lg:hidden">
                    <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-[30px] h-[30px]">
                        {isOpen ? (
                            <img
                            src = "/close.svg"
                            alt="close"
                            className="w-[30px] h-[30px]"
                            />
                        ) : (
                            <img
                            src="/menu6.svg"
                            alt="menu"
                            className="w-[30px] h-[30px]"
                            />
                        )
                        }
                    </button>
                </div>
            </div>
            {/*drop down menu*/}
                {isOpen && (
                    <div className="lg:hidden self-stretch h-[345px] flex-col justify-start items-start flex mt-3">
                        {navLinks.map((navLink) => (
                            <Link 
                                onClick={() => setIsOpen(!isOpen)}
                                key={navLink.name}
                                href={navLink.href}
                                className="self-stretch px-[18px] py-[18px] bg-[#FAFAFA] justify-start items-center gap-[10px] inline-flex ml-[-20px] mt-2"
                            >
                                <div className={clsx(
                                    "text-center text-lg font-bold font-['Satoshi Variable'] leading-normal",
                                    {
                                        "text-[#156e3c]": pathname === navLink.href,
                                        "text-[#3f3f3f]": pathname !== navLink.href,
                                    }
                                )}>
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
