"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

const navLinks = [
    { name: "Beranda", href:"/" },
    { name: "Coblos", href:"/Coblos" },
    { name: "Tata Cara", href:"/TataCara" },
    { name: "Peraturan", href:"/Peraturan" },
    { name: "Profile", href:"/Profile" },
];

export default function NavBar() {
    const pathname = usePathname();

    return (
    <div className="fixed min-w-full justify-around bg-[#F8F7F2] py-[16px] px-[72px] items-center">
        <div className="flex flex-row  justify-between">
            <div className="items-center">
            <Link
                href="/">
                <img src="/logo.svg" alt="logo" loading="lazy"/>
            </Link>
            </div>
            <div className="flex flex-row items-center gap-[24px]">

                    {navLinks.map((navLink) => (
                    <Link 
                        key={navLink.name}
                        href={navLink.href}
                        className={clsx(
                            "text-center text-[#3f3f3f] text-2xl font-bold font-['Satoshi Variable'] leading-[28.80px] hover:text-[#156e3c]", 
                            {
                                "text-[#156e3c] underline": pathname === navLink.href
                            },
                        )}
                        style={pathname === navLink.href ? { color: '#156e3c' } : {}}
                        > {navLink.name}
                    </Link>
                ))}
            </div>
        </div>
    </div>
    )
}
