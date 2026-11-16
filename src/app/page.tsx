"use client";

import Image from "next/image";
import logo from "public/homepage/logo.png";
import arrow from "public/homepage/arrow.png";
import { useRouter } from "next/navigation";
import AOS from "aos";
import "aos/dist/aos.css";

import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";

import LoadingSpinner from "~/components/LoadingSpinner";

import { Button } from "~/components/ui/button";
import Link from "next/link";
import CalonCard from "~/components/calon-card";

import { api } from "~/trpc/react";
import { CalonType } from "../../generated/prisma";
import Countdown from "react-countdown";

const formatTimelineDate = (from: Date, to: Date | null) => {
  const options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "long",
    year: "numeric",
  };
  const dFrom = new Date(from);

  if (!to) return dFrom.toLocaleDateString("id-ID", options);

  const dTo = new Date(to);

  // If dates are in the same month/year: "17 - 18 Maret 2025"
  if (
    dFrom.getMonth() === dTo.getMonth() &&
    dFrom.getFullYear() === dTo.getFullYear()
  ) {
    return `${dFrom.getDate()} - ${dTo.getDate()} ${dFrom.toLocaleDateString("id-ID", { month: "long", year: "numeric" })}`;
  }

  return `${dFrom.toLocaleDateString("id-ID")} - ${dTo.toLocaleDateString("id-ID")}`;
};

const HomePage = () => {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      easing: "ease-out-cubic",
    });
  }, []);

  const router = useRouter();
  const { status, data: session } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/auth/login");
    }
  }, [status, router]);

  const config = api.admin.configuration.config.get.useQuery(undefined, {
    enabled: status === "authenticated",
  });

  const active = api.admin.configuration.election.getActive.useQuery(
    undefined,
    {
      enabled: status === "authenticated",
    },
  );

  const timeline = api.admin.configuration.timeline.list.useQuery(
    { electionId: active.data?.id },
    { enabled: !!active.data?.id },
  );

  const calonEnabled = !!config.data?.calon;
  const timelineEnabled = !!config.data?.timeline;
  const peraturanEnabled = !!config.data?.peraturan;
  const countdownEnabled = !!config.data?.countdown;

  // Auto-calculated Countdown Target
  const countdownTarget = useMemo(() => {
    if (!config.data) return null;

    const toStart = config.data.toStart ? new Date(config.data.toStart) : null;
    const toEnd = config.data.toEnd ? new Date(config.data.toEnd) : null;
    const toReveal = config.data.toReveal
      ? new Date(config.data.toReveal)
      : null;

    if (toStart && now < toStart) {
      return { label: "Menuju Pemilu Dimulai", date: toStart, type: "start" };
    }
    if (toEnd && now < toEnd) {
      return { label: "Menuju Pemilu Berakhir", date: toEnd, type: "end" };
    }
    if (toReveal && now < toReveal) {
      return {
        label: "Menuju Pengumuman Pemilu",
        date: toReveal,
        type: "reveal",
      };
    }

    return null;
  }, [config.data, now]);

  const isVotingOpen = useMemo(() => {
    if (!config.data?.toStart || !config.data?.toEnd) return false;
    const toStart = new Date(config.data.toStart);
    const toEnd = new Date(config.data.toEnd);
    return now >= toStart && now < toEnd;
  }, [config.data, now]);

  const isRevealPassed = useMemo(() => {
    if (!config.data?.toReveal) return false;
    return now >= new Date(config.data.toReveal);
  }, [config.data, now]);

  // Automatically safely fetch results if conditions are met
  const resultsQuery = api.admin.configuration.config.getResults.useQuery(
    undefined,
    {
      enabled: status === "authenticated" && isRevealPassed,
      retry: false, // If the user spoofed local clock, it will fail securely once
    },
  );

  const election = api.admin.configuration.election.get.useQuery(
    { id: active.data?.id as string },
    { enabled: status === "authenticated" && calonEnabled && active.isSuccess },
  );

  const calonList = election.data?.calons;
  const { kahim, senat } = useMemo(() => {
    const all = calonList ?? [];
    return {
      kahim: all.filter((c) => c.calon.type === CalonType.KAHIM),
      senat: all.filter((c) => c.calon.type === CalonType.SENAT),
    };
  }, [calonList]);

  if (status === "loading" || status === "unauthenticated") {
    return <LoadingSpinner />;
  }

  return (
    <div className="mb-12 flex flex-col">
      <div
        className="flex min-h-screen flex-col items-center justify-center gap-4 md:gap-8"
        data-aos="fade-up"
        data-aos-delay="200"
      >
        <div className="relative flex flex-col-reverse items-center justify-center gap-8 px-4 py-12 sm:flex-row sm:gap-0 sm:px-16">
          <div className="text-center text-white sm:text-left">
            <div className="flex items-baseline justify-center gap-1 sm:justify-start">
              <h1 className="font-sloop text-7xl sm:text-9xl">P</h1>
              <h1 className="font-playfair text-6xl sm:text-8xl">emilu</h1>
            </div>
            <h1 className="mt-2 font-neuething text-5xl font-bold tracking-wide sm:text-7xl">
              HMIF {active.isFetched && !active.isError && active.data?.name}
            </h1>
            {calonEnabled && (
              <div className="mt-4">
                <h3 className="rounded-full border px-4 py-2 font-satoshi text-lg font-semibold tracking-wider sm:text-xl">
                  Pelajari calon ketua himpunan yang sesuai denganmu!
                </h3>
              </div>
            )}
          </div>

          <div className="relative h-64 w-64 sm:h-80 sm:w-80">
            <Image src={logo} alt="Logo" />
          </div>
        </div>
        {calonEnabled && (
          <Button
            asChild
            disabled={config.isLoading || !calonEnabled}
            className="flex items-center justify-center rounded-[32px] bg-[#ffbb00] px-9 py-3 text-xl text-[#156E3C] hover:bg-yellow-600 disabled:opacity-60"
          >
            <Link href={calonEnabled ? "#calon" : "#"}>Kenali Calonmu</Link>
          </Button>
        )}
      </div>

      {peraturanEnabled && !countdownTarget && !isRevealPassed && (
        <div
          className="flex min-h-screen flex-col items-center justify-center px-2 py-4 text-center text-white"
          data-aos="fade-up"
          data-aos-delay="200"
        >
          <h1 className="font-neuething text-2xl font-bold sm:text-5xl">
            Mau mencalonkan
          </h1>
          <h1 className="font-neuething text-2xl font-bold sm:text-5xl">
            diri, <span className="text-yellow-400">Pips</span>?
          </h1>
          <p className="mt-4 font-satoshi text-sm sm:text-xl">
            Yuk, kenali tata cara mencalonkan diri menjadi calon ketua himpunan
            dan
          </p>
          <p className="font-satoshi text-sm sm:text-xl">
            senator HMIF selanjutnya
          </p>
          <a
            href="tata-cara"
            className="mt-4 flex items-center gap-2 rounded-full border-yellow-500 bg-yellow-500 px-4 py-2 font-satoshi text-lg font-semibold transition-colors hover:bg-yellow-600 sm:text-2xl"
          >
            Lihat Tata Cara
            <span className="inline-flex items-center">
              <Image src={arrow} alt="arrow" width={24} height={24} />
            </span>
          </a>
        </div>
      )}

      {/* COUNTDOWN SECTION */}
      {countdownEnabled && countdownTarget && (
        <div
          className="flex min-h-screen flex-col items-center justify-center px-4"
          data-aos="fade-up"
          data-aos-delay="200"
        >
          <div className="flex w-full max-w-md flex-col items-center gap-8 sm:max-w-lg lg:max-w-3xl">
            <Countdown
              key={countdownTarget.date.getTime()} // Key forces remount automatically upon target shift
              date={countdownTarget.date}
              onComplete={() => {
                // If it was the 'reveal' phase finishing, auto-refresh to cleanly fetch images
                if (countdownTarget.type === "reveal") {
                  window.location.reload();
                }
              }}
              renderer={({ days, hours, minutes, seconds }) => {
                const pad = (n: number) => n.toString().padStart(2, "0");

                const TimeBlock = ({
                  value,
                  label,
                }: {
                  value: string;
                  label: string;
                }) => (
                  <div className="flex flex-col items-center">
                    <div className="font-mono text-2xl font-extrabold tracking-widest text-yellow-400 sm:text-4xl md:text-6xl lg:text-8xl">
                      {value}
                    </div>
                    <div className="mt-2 text-[10px] font-semibold tracking-[0.3em] text-white sm:text-xs md:text-sm lg:text-base">
                      {label}
                    </div>
                  </div>
                );

                return (
                  <div className="w-fit rounded-2xl bg-black px-6 py-8 shadow-2xl">
                    <div className="flex items-start justify-between gap-4 text-center">
                      <TimeBlock value={pad(days)} label="HARI" />
                      <div className="font-mono text-2xl font-bold text-yellow-400 sm:text-4xl md:text-6xl lg:text-8xl">
                        :
                      </div>
                      <TimeBlock value={pad(hours)} label="JAM" />
                      <div className="font-mono text-2xl font-bold text-yellow-400 sm:text-4xl md:text-6xl lg:text-8xl">
                        :
                      </div>
                      <TimeBlock value={pad(minutes)} label="MENIT" />
                      <div className="font-mono text-2xl font-bold text-yellow-400 sm:text-4xl md:text-6xl lg:text-8xl">
                        :
                      </div>
                      <TimeBlock value={pad(seconds)} label="DETIK" />
                    </div>
                  </div>
                );
              }}
            />

            <div className="text-center text-lg font-bold tracking-tight text-white sm:text-xl md:text-2xl">
              {countdownTarget.label}
            </div>
            {isVotingOpen && (
              <a
                href="/coblos"
                className="mt-4 flex items-center gap-2 rounded-full border-yellow-500 bg-yellow-500 px-4 py-2 font-satoshi text-lg font-semibold text-white transition-colors hover:bg-yellow-600 sm:text-2xl"
              >
                Coblos Sekarang!
                <span className="inline-flex items-center">
                  <Image src={arrow} alt="arrow" width={24} height={24} />
                </span>
              </a>
            )}
          </div>
        </div>
      )}

      {/* ELECTION RESULTS SECTION */}
      {isRevealPassed && (
        <div
          className="flex min-h-screen flex-col items-center justify-center px-4 py-12"
          data-aos="fade-up"
          data-aos-delay="200"
          id="hasil"
        >
          <div className="flex w-full flex-col items-center gap-8 text-center text-white">
            <h1 className="font-neuething text-4xl font-bold md:text-6xl">
              Hasil Pemilu
            </h1>

            {resultsQuery.isLoading && <LoadingSpinner />}

            {/* If local time was manipulated, server securely rejects it and handles the display gracefully */}
            {resultsQuery.isError && (
              <div className="max-w-lg rounded-2xl border border-red-500 bg-red-500/20 px-8 py-6 text-red-100 shadow-xl backdrop-blur">
                <p className="text-xl font-bold text-red-400">
                  Belum waktunya pengumuman!
                </p>
                <p className="mt-2 font-satoshi text-sm">
                  {resultsQuery.error.message}
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-6 rounded-full border border-red-400/50 bg-black/30 px-6 py-2 text-sm transition hover:bg-red-500/30"
                >
                  Refresh Halaman
                </button>
              </div>
            )}

            {resultsQuery.isSuccess && (
              <div className="grid w-full max-w-5xl grid-cols-1 gap-12 md:grid-cols-2">
                <div className="flex flex-col items-center gap-4">
                  <h2 className="font-satoshi text-3xl font-bold tracking-wide text-yellow-400">
                    Kahim
                  </h2>
                  {resultsQuery.data.kahimResult ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={resultsQuery.data.kahimResult}
                      alt="Hasil Kahim"
                      className="rounded-3xl shadow-[0_0_40px_-10px_rgba(250,204,21,0.3)] transition-transform hover:scale-[1.02]"
                    />
                  ) : (
                    <div className="flex h-64 w-full items-center justify-center rounded-3xl border border-white/10 bg-white/5 text-white/50">
                      Hasil Kahim belum diunggah
                    </div>
                  )}
                </div>

                <div className="flex flex-col items-center gap-4">
                  <h2 className="font-satoshi text-3xl font-bold tracking-wide text-yellow-400">
                    Senat
                  </h2>
                  {resultsQuery.data.senatResult ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={resultsQuery.data.senatResult}
                      alt="Hasil Senat"
                      className="rounded-3xl shadow-[0_0_40px_-10px_rgba(250,204,21,0.3)] transition-transform hover:scale-[1.02]"
                    />
                  ) : (
                    <div className="flex h-64 w-full items-center justify-center rounded-3xl border border-white/10 bg-white/5 text-white/50">
                      Hasil Senat belum diunggah
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TIMELINE SECTION */}
      {timelineEnabled && (
        <div
          className="flex min-h-screen flex-col items-center justify-center p-8"
          data-aos="fade-up"
          data-aos-delay="200"
        >
          <div className="mb-12 h-auto w-full max-w-md">
            <h1 className="mb-10 text-center font-neuething text-6xl font-bold tracking-tighter text-white">
              Timeline
            </h1>

            <div className="relative flex flex-col gap-10">
              <div className="absolute left-[15px] top-2 h-[calc(100%-16px)] w-1 bg-white" />

              {timeline.data?.map((item, index) => (
                <div
                  key={item.id}
                  className="relative flex min-h-[80px] flex-col justify-center pl-12"
                >
                  <div className="absolute left-0 top-1/2 z-10 h-7 w-7 -translate-y-1/2 translate-x-[3px] rounded-full border-4 border-white bg-[#D9D9D9]" />

                  <div className="flex flex-col">
                    <h3 className="font-neuething text-3xl font-bold leading-none text-white">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-xl font-medium text-white/90">
                      {formatTimelineDate(item.dateFrom, item.dateTo)}
                    </p>
                  </div>
                </div>
              ))}

              {timeline.isLoading && (
                <p className="italic text-white">Loading...</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* CALON SECTION */}
      {calonEnabled && (
        <div
          className="flex flex-col items-center justify-center gap-24 px-4 pb-12 pt-12 text-center text-white md:pt-32"
          id="calon"
        >
          {election.isLoading && <LoadingSpinner />}

          <div className="flex flex-col flex-wrap items-center justify-center gap-8">
            <h1 className="max-w-[800px] font-neuething text-2xl font-bold text-white md:text-6xl">
              Calon Ketua Himpunan
            </h1>

            <div className="flex flex-wrap items-center justify-center gap-6">
              {[...kahim]
                .sort((a, b) => a.calon.number - b.calon.number)
                .map((calon) => (
                  <CalonCard
                    key={calon.id}
                    number={calon.calon.number}
                    angkatan={calon.calon.angkatan}
                    imageSrc={calon.calon.image ?? ""}
                    name={calon.calon.name}
                    draflink={calon.calon.document ?? ""}
                    calonpagelink={`/calonketua/${calon.calon.number}`}
                    variant="home"
                  />
                ))}
            </div>
          </div>

          <div className="flex flex-col flex-wrap items-center justify-center gap-8">
            <h1 className="max-w-[800px] font-neuething text-2xl font-bold text-white md:text-6xl">
              Calon Senator
            </h1>

            <div className="flex flex-wrap items-center justify-center gap-6">
              {[...senat]
                .sort((a, b) => a.calon.number - b.calon.number)
                .map((calon) => (
                  <CalonCard
                    key={calon.id}
                    number={calon.calon.number}
                    angkatan={calon.calon.angkatan}
                    imageSrc={calon.calon.image ?? ""}
                    name={calon.calon.name}
                    draflink={calon.calon.document ?? ""}
                    calonpagelink={`/calonsenator/${calon.calon.number}`}
                    variant="home"
                  />
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
