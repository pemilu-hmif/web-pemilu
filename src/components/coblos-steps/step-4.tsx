"use client";

import React from "react";

export default function Step4({
  isConfirmed,
  onChange,
  summary,
}: {
  isConfirmed: boolean;
  onChange: (value: boolean) => void;
  summary: { kahim: string; senat: string };
}) {
  const handleCheckBoxChange = () => onChange(!isConfirmed);

  return (
    <div className="mb-[228px] mt-0 flex-col justify-items-center sm:mb-[80px] sm:mt-8">
      <div className="mb-[140px] items-center text-center">
        <h1 className="mt-2 font-neuething text-[30px] font-bold leading-[33.60px] tracking-wide text-neutral-50">
          Konfirmasi Pencoblosan
        </h1>
      </div>

      <div className="mb-6 flex flex-col items-center justify-center text-center">
        <h2 className="font-satoshi text-2xl text-white">
          Apakah kamu yakin dengan pilihanmu?
        </h2>
        <h2 className="font-satoshi text-2xl text-white">
          Aksi ini tidak bisa diulang kembali
        </h2>
      </div>

      <div className="mb-6 mt-6 text-center text-white/90">
        <p className="font-satoshi text-lg">
          <b>KAHIM:</b> {summary.kahim}
        </p>
        <p className="mt-2 font-satoshi text-lg">
          <b>SENAT:</b> {summary.senat}
        </p>
      </div>

      <div className="mb-[-78px] mt-2 flex">
        <label>
          <input
            type="checkbox"
            className="mr-2 mt-2 h-5 w-5 rounded-full border-gray-300"
            checked={isConfirmed}
            onChange={handleCheckBoxChange}
          />
        </label>
        <span className="mt-1 font-satoshi text-2xl leading-[28.80px] text-neutral-50 sm:mb-[131px]">
          Ya, saya yakin
        </span>
      </div>
    </div>
  );
}

