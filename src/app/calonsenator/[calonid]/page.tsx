"use client";

import { useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { CalonType } from "@prisma/client";
import { api } from "~/trpc/react";
import LoadingSpinner from "~/components/LoadingSpinner";
import CalonTabs from "~/components/calon-tabs";

export default function CalonSenatorPage() {
  const { calonid } = useParams<{ calonid: string }>();
  const router = useRouter();

  const config = api.admin.configuration.config.get.useQuery();

  const calonQuery = api.admin.configuration.calonDetail.list.useQuery(
    { type: CalonType.SENAT },
    { enabled: !!config.data?.calon },
  );

  const tabsData = useMemo(() => {
    return (calonQuery.data ?? []).map((c) => ({
      id: String(c.number),
      name: c.name,
      number: c.number,
      angkatan: c.angkatan,
      imageSrc: c.image ?? "",
      visi: c.vision ?? "",
      misi: (c.mision ?? "")
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
      draflink: c.document ?? "",
    }));
  }, [calonQuery.data]);

  const ready =
    !config.isLoading && (!config.data?.calon || !calonQuery.isLoading);

  const calonEnabled = !!config.data?.calon;

  const active = useMemo(() => {
    if (!calonEnabled) return null;
    return tabsData.find((t) => t.id === calonid) ?? null;
  }, [calonEnabled, tabsData, calonid]);

  useEffect(() => {
    if (!ready) return;
    if (!calonEnabled) return;
    if (tabsData.length === 0) return;

    const valid = tabsData.some((t) => t.id === calonid);
    if (!valid) {
      router.replace(`/calonsenator/${tabsData[0]!.id}`);
    }
  }, [ready, calonEnabled, tabsData, calonid, router]);

  if (config.isLoading || (calonEnabled && calonQuery.isLoading)) {
    return <LoadingSpinner />;
  }

  if (!calonEnabled) return null;
  if (tabsData.length === 0) return null;
  if (!active) return <LoadingSpinner />;

  return (
    <div className="mb-24 mt-32 flex flex-col items-center pt-[80px]">
      <div className="container flex flex-col p-4">
        {/* Title */}
        <div className="relative flex w-full flex-col items-center justify-center text-center text-white">
          <div className="relative flex gap-1">
            <h1 className="-rotate-12 font-sloop text-7xl sm:text-9xl">C</h1>
            <h1 className="font-playfair text-6xl sm:text-8xl">alon</h1>
          </div>
          <h1 className="mt-2 font-neuething text-5xl font-bold tracking-wide sm:text-7xl">
            SENATOR
          </h1>
        </div>

        {/* Content */}
        <div className="mt-8 flex w-full flex-col items-center justify-center gap-12">
          <CalonTabs
            tabsData={tabsData}
            activeId={active.id}
            basePath="/calonsenator"
          />
        </div>
      </div>
    </div>
  );
}
