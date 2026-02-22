"use client";

import React from "react";

export default function SubmittedPage({
  existingVote,
}: {
  existingVote: {
    kahimId: number | null;
    senatId: number | null;
    createdAt: Date;
    kahim?: { id: number; name: string; number: number } | null;
    senat?: { id: number; name: string; number: number } | null;
  } | null;
}) {
  const kahimLabel =
    existingVote?.kahimId === null
      ? "Kertas Kosong"
      : existingVote?.kahim
        ? `${existingVote.kahim.number}. ${existingVote.kahim.name}`
        : "-";

  const senatLabel =
    existingVote?.senatId === null
      ? "Kertas Kosong"
      : existingVote?.senat
        ? `${existingVote.senat.number}. ${existingVote.senat.name}`
        : "-";

  return (
    <div className="mt-[-80px] flex flex-col items-center text-center sm:mt-0">
      <div className="mb-[150px]">
        <span className="mt-2 font-neuething text-[28px] font-bold leading-[33.60px] tracking-wide text-neutral-50 sm:text-[30px]">
          Terima Kasih Sudah{" "}
        </span>
        <span className="mt-2 font-neuething text-[28px] font-bold leading-[33.60px] tracking-wide text-[#ffbb00] sm:text-[30px]">
          Berpartisipasi
        </span>
      </div>

      <div className="mb-6 mt-[-100px] sm:mt-0">
        <p className="font-satoshi text-2xl text-white">
          Sudah mencoblos? Keren banget! Pilihanmu berarti besar untuk masa
          depan
          <span className="text-[#ffbb00]"> HMIF.</span>
        </p>
      </div>

      {existingVote && (
        <div className="mb-10 mt-4 text-white/90">
          <p className="font-satoshi text-lg">
            <b>Pilihan KAHIM:</b> {kahimLabel}
          </p>
          <p className="mt-2 font-satoshi text-lg">
            <b>Pilihan SENAT:</b> {senatLabel}
          </p>
        </div>
      )}

      <div className="mt-2">
        <span className="font-satoshi text-2xl leading-[28.80px] text-neutral-50">
          Punya kritik, saran, atau sekadar ide keren buat bikin pemilu lebih
          seru? Kami siap dengerin!
        </span>
        <p className="mt-2 font-satoshi text-2xl leading-[28.80px] text-neutral-50 sm:mb-0">
          Tinggalkan pesanmu, siapa tahu ide kamu bikin perubahan besar.
        </p>
      </div>
    </div>
  );
}
