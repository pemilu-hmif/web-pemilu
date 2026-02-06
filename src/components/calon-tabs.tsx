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
  if (tabsData.length === 0) return null;

  const active = tabsData.find((t) => t.id === activeId) ?? tabsData[0]!;
  const triggerBase =
    "ring-offset-background focus-visible:ring-ring inline-flex w-40 items-center justify-center whitespace-nowrap rounded-2xl border-4 border-[#FFBB00] px-6 py-1.5 text-2xl transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

  return (
    <div className="rounded-lg p-4">
      <div className="mb-6 inline-flex w-full items-center justify-center gap-4 rounded-md bg-transparent p-1 font-satoshi font-bold">
        {tabsData.map((t) => {
          const isActive = t.id === active.id;
          return (
            <Link
              key={t.id}
              href={`${basePath}/${t.id}`}
              className={[
                triggerBase,
                isActive
                  ? "bg-[#FFBB00] text-white"
                  : "bg-transparent text-[#FFBB00]",
              ].join(" ")}
            >
              {t.number}
            </Link>
          );
        })}
      </div>

      <div className="flex flex-col items-center justify-center gap-4">
        <CalonCard
          number={active.number}
          angkatan={active.angkatan}
          imageSrc={active.imageSrc}
          name={active.name}
          draflink={active.draflink}
          calonpagelink={`${basePath}/${active.id}`}
          variant="calon"
        />

        <div className="flex w-full max-w-[1000px] flex-col gap-2 text-white">
          <h1 className="font-neuething text-3xl">Visi:</h1>
          <p className="text-xl">&quot;{active.visi}&quot;</p>
        </div>

        <div className="flex w-full max-w-[1000px] flex-col gap-2 text-white">
          <h1 className="font-neuething text-3xl">Misi:</h1>
          <ol className="list-inside list-decimal text-xl">
            {active.misi.map((m, i) => (
              <li key={i} className="text-xl">
                {m}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
