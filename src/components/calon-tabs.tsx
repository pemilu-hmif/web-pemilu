// src/components/calon-tabs.tsx
"use client";

import Link from "next/link";
import CalonCard from "./calon-card";

type TabData = {
  id: string;
  name: string;
  number: number;
  angkatan: string;
  imageSrc: string;
  visi: string;
  misi: string[];
  draflink: string;
};

type Props = {
  tabsData: TabData[];
  activeId: string;
  basePath: "/calonketua" | "/calonsenator";
};

export default function CalonTabs({ tabsData, activeId, basePath }: Props) {
  if (!tabsData?.length) return null;

  const active = tabsData.find((t) => t.id === activeId) ?? tabsData[0]!;

  const tabBase =
    "inline-flex items-center justify-center rounded-2xl border-2 px-4 py-2 font-satoshi font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent";
  const tabActive = "bg-[#FFBB00] text-white border-[#FFBB00]";
  const tabInactive =
    "bg-transparent text-[#FFBB00] border-[#FFBB00]/70 hover:bg-[#FFBB00]/10";

  return (
    <section className="w-full px-4 py-4 sm:px-6">
      {/* Tabs */}
      <div className="mx-auto mb-6 w-full max-w-6xl">
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          {tabsData.map((t) => {
            const isActive = t.id === active.id;
            return (
              <Link
                key={t.id}
                href={`${basePath}/${t.id}`}
                className={[
                  tabBase,
                  // responsive sizing:
                  "min-w-[64px] sm:min-w-[80px]",
                  "text-base sm:text-xl",
                  isActive ? tabActive : tabInactive,
                ].join(" ")}
              >
                {t.number}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto w-full max-w-6xl">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[420px_1fr] lg:items-start">
          {/* Card */}
          <div className="flex justify-center">
            <div className="flex w-full max-w-[420px] justify-center">
                <CalonCard
                  number={active.number}
                  angkatan={active.angkatan}
                  imageSrc={active.imageSrc}
                  name={active.name}
                  draflink={active.draflink}
                  calonpagelink={`${basePath}/${active.id}`}
                  variant="calon"
                />
            </div>
          </div>

          {/* Visi + Misi */}
          <div className="flex flex-col gap-6 text-white">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-6">
              <h2 className="font-neuething text-2xl sm:text-3xl">Visi</h2>
              <p className="mt-2 break-words text-base leading-relaxed sm:text-xl">
                &quot;{active.visi}&quot;
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-6">
              <h2 className="font-neuething text-2xl sm:text-3xl">Misi</h2>
              <ol className="mt-2 list-inside list-decimal space-y-2 text-base leading-relaxed sm:text-xl">
                {active.misi.map((m, i) => (
                  <li key={`${active.id}-misi-${i}`} className="break-words">
                    {m}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
