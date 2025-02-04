'use client'
import Link from "next/link"
import React from "react"

export default function Step4({ isConfirmed, onChange } : { isConfirmed: boolean, onChange: (value: boolean) => void }) {
    const handleCheckBoxChange = () => {
        const newValue = !isConfirmed;
        onChange(newValue);
    };

    return (
        <div className="flex-col justify-items-center">
            <div className="items-center mb-[150px]">
                <h1 className="text-3xl font-satoshi text-white">Konfirmasi Pencoblosan</h1>
            </div>
            <div className="items-center mb-6">
                <h2 className="text-2xl font-satoshi text-white">Apakah kamu yakin dengan pilihanmu?</h2>
                <h2 className="text-2xl font-satoshi text-white">Aksi ini tidak bisa diulang kembali</h2>
            </div>
            <div className="flex mt-2" >
                <label>
                    <input type="checkbox" className="w-5 h-5 border-gray-300 rounded-full mr-2 mt-2" checked={isConfirmed} onChange={handleCheckBoxChange}></input>
                </label>
                <span className="text-neutral-50 text-2xl font-['Satoshi Variable'] leading-[28.80px] mt-1 mb-[131px]">Ya, saya yakin</span>
            </div>
        </div>
    )
}