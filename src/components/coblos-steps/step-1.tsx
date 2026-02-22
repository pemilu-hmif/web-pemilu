"use client";

import Link from "next/link";
import React from "react";

export default function Step1({
  isChecked,
  onChange,
}: {
  isChecked: boolean;
  onChange: (value: boolean) => void;
}) {
  const handleCheckBoxChange = () => onChange(!isChecked);

  return (
    <div className="items-center">
      <div className="mt-[10px] justify-items-center px-4 text-center sm:mt-[37px] sm:px-0">
        <span className="mt-2 font-neuething text-[30px] font-bold leading-[33.60px] tracking-wide text-neutral-50">
          Udah Siap{" "}
        </span>
        <span className="font-neuething text-[30px] font-bold leading-[33.60px] tracking-wide text-[#ffbb00] sm:mt-2">
          Nyoblos?
        </span>
        <h1 className="leading-[33.60px]] mb-[70px] mt-[-5px] font-neuething text-[30px] font-bold tracking-wide text-neutral-50 sm:mb-[150px] sm:mt-2">
          Yuk, Cek Lagi!
        </h1>

        <h3 className="mt-1 font-satoshi text-2xl leading-[28.80px] text-neutral-50">
          Sebelum nyoblos calon jagoanmu, pastikan kamu udah baca semua
        </h3>
        <h3 className="mt-1 font-satoshi text-2xl leading-[28.80px] text-neutral-50">
          info penting, ya! Mulai dari dokumen tata cara nyoblos sampai
        </h3>
        <h3 className="mt-1 font-satoshi text-2xl leading-[28.80px] text-neutral-50">
          dokumen peraturan.
        </h3>

        <div className="mt-[30px] flex-wrap sm:mt-[40px]">
          <label>
            <input
              type="checkbox"
              className="mr-2 mt-2 h-5 w-5 rounded-full border-gray-300"
              checked={isChecked}
              onChange={handleCheckBoxChange}
            />
          </label>
          <span className="mt-1 font-satoshi text-2xl leading-[28.80px] text-neutral-50">
            Saya telah memahami
          </span>
          <Link
            href="https://drive.google.com/drive/folders/1t2Hv0BFil_-vrxoYzif9JNLHh957Vm7S"
            className="ml-[7px] mt-1 font-satoshi text-2xl leading-[28.80px] text-neutral-50 underline"
          >
            dokumen teknis pemilu
          </Link>
        </div>
      </div>
    </div>
  );
}

