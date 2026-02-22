"use client";

import React from "react";
import Image from "next/image";
import CoblosCard from "../coblos-card";

type Candidate = {
  id: number;
  name: string;
  angkatan: string;
  number: number;
  image: string | null;
  type: "KAHIM" | "SENAT";
};

type Choice = number | null | undefined;

export default function Step2({
  candidates,
  value,
  allowBlank,
  onChange,
}: {
  candidates: Candidate[];
  value: Choice;
  allowBlank: boolean;
  onChange: (v: Choice) => void;
}) {
  return (
    <div className="flex-col justify-items-center">
      <div className="mb-10 items-center text-center">
        <h1 className="mt-2 font-neuething text-[30px] font-bold leading-[33.60px] tracking-wide text-neutral-50">
          Coblos Calon Ketua Himpunan
        </h1>
      </div>

      <div className="mb-6 items-center text-center">
        <h2 className="font-satoshi text-2xl text-white">
          {!allowBlank
            ? "Pilih calon ketua himpunan yang ingin dicoblos"
            : "Apakah kamu setuju atau tidak setuju calon berikut menjadi kahim HMIF?"}
        </h2>
      </div>

      <div className="flex flex-wrap justify-center gap-8">
        {candidates.map((c) => (
          <button
            key={c.id}
            onClick={() => onChange(c.id)}
            className="relative"
          >
            <CoblosCard
              number={c.number}
              name={c.name}
              imageSrc={c.image ?? ""}
              angkatan={c.angkatan}
            />
            {value === c.id && (
              <div className="absolute left-0 top-0 flex h-full w-full items-center justify-center">
                <Image
                  src="/coblos/paku.svg"
                  alt="Selected"
                  width={100}
                  height={100}
                  className="z-10"
                />
              </div>
            )}
          </button>
        ))}

        {allowBlank && (
          <button onClick={() => onChange(null)} className="relative">
            {/* reusing your existing blank-card pattern */}
            <CoblosCard name="" imageSrc="" angkatan="" />
            {value === null && (
              <div className="absolute left-0 top-0 flex h-full w-full items-center justify-center">
                <Image
                  src="/coblos/paku.svg"
                  alt="Selected blank"
                  width={100}
                  height={100}
                  className="z-10"
                />
              </div>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
