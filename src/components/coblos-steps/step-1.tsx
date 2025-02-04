'use client'
import Link from "next/link"
import React from "react"

export default function Step1({ isChecked, onChange } : { isChecked: boolean, onChange: (value: boolean) => void }) {
    const handleCheckBoxChange = () => {
        const newValue = !isChecked;
        onChange(newValue);
    };

    return (
        <div className="">
            <div className="justify-items-center mt-8">
                <span className="text-neutral-50 mt-2 font-neuething text-[30px] font-bold tracking-wide leading-[33.60px]">
                    Udah Siap </span> <span className="text-[#ffbb00] mt-2 font-neuething text-[30px] font-bold tracking-wide leading-[33.60px]">Nyoblos?</span>
                <h1 className="text-neutral-50 mt-2 font-neuething text-[30px] font-bold tracking-wide leading-[33.60px]] mb-[150px]">
                    Yuk, Cek Lagi!
                </h1>
                <h3 className="text-neutral-50 text-2xl font-['Satoshi Variable'] leading-[28.80px] mt-1">
                    Sebelum nyoblos calon jagoanmu, pastikan kamu udah baca semua
                </h3>
                <h3 className="text-neutral-50 text-2xl font-['Satoshi Variable'] leading-[28.80px] mt-1">
                    info penting, ya! Mulai dari dokumen tata cara nyoblos sampai
                </h3>
                <h3 className="text-neutral-50 text-2xl font-['Satoshi Variable'] leading-[28.80px] mt-1">
                    dokumen peraturan.
                </h3>
                <div className="mt-[40px] flex">
                    <label>
                        <input type="checkbox" className="w-5 h-5 border-gray-300 rounded-full mr-2 mt-2" checked={isChecked} onChange={handleCheckBoxChange}></input>
                    </label>
                    <span className="text-neutral-50 text-2xl font-['Satoshi Variable'] leading-[28.80px] mt-1">Saya telah memahami</span>
                    <Link 
                        href="https://drive.google.com/drive/folders/1t2Hv0BFil_-vrxoYzif9JNLHh957Vm7S" 
                        className="text-neutral-50 text-2xl font-['Satoshi Variable'] leading-[28.80px] mt-1 underline ml-[7px]">
                            dokumen teknis pemilu
                    </Link>
                </div>
            </div>
        </div>
    )
}