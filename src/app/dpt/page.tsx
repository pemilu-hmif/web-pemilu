"use client";

import { useMemo, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { api } from "~/trpc/react";
import DialogBox from "~/components/DialogBox";
import LoadingSpinner from "~/components/LoadingSpinner";

/* ---------------- Small UI helpers ---------------- */

// Updated to match AdminLaporan card style (White bg, shadow-sm, gray borders)
function Card(props: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  right?: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">{props.title}</h2>
          {props.subtitle && (
            <p className="mt-1 text-sm text-gray-500">{props.subtitle}</p>
          )}
        </div>
        {props.right}
      </div>
      {props.children}
    </section>
  );
}

function ErrorBox({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
      {message}
    </div>
  );
}

function Badge({ ok, text }: { ok: boolean; text: string }) {
  return (
    <span
      className={[
        "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium",
        ok
          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
          : "border-gray-200 bg-gray-100 text-gray-600",
      ].join(" ")}
    >
      {text}
    </span>
  );
}

/* ---------------- Main Page ---------------- */

export default function DptPage() {
  const { data: session, status } = useSession();
  const [showAuthDialog, setShowAuthDialog] = useState(false);

  // Data fetching
  const dptQuery = api.vote.listdpt.useQuery(undefined, {
    enabled: status === "authenticated",
  });

  // Local states for filtering and pagination
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "ALL" | "VOTED" | "NOT_VOTED"
  >("ALL");
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState<"10" | "25" | "50" | "ALL">("10");

  // Reset to first page when filters or page size change
  useEffect(() => {
    setPage(0);
  }, [search, filterStatus, pageSize]);

  // Client-side filtering
  const filteredDpt = useMemo(() => {
    const data = dptQuery.data ?? [];
    return data.filter((item) => {
      const query = search.toLowerCase().trim();
      const matchSearch =
        item.nim.toLowerCase().includes(query) ||
        item.name?.toLowerCase().includes(query);

      const matchStatus =
        filterStatus === "ALL"
          ? true
          : filterStatus === "VOTED"
            ? item.hasVoted
            : !item.hasVoted;

      return matchSearch && matchStatus;
    });
  }, [dptQuery.data, search, filterStatus]);

  // Pagination Math
  const totalItems = filteredDpt.length;
  const numericPageSize =
    pageSize === "ALL" ? Math.max(totalItems, 1) : parseInt(pageSize, 10);
  const totalPages = Math.max(1, Math.ceil(totalItems / numericPageSize));

  const canPrev = page > 0;
  const canNext = page + 1 < totalPages;

  const startIndex = page * numericPageSize;
  const endIndex = startIndex + numericPageSize;
  const paginatedDpt = filteredDpt.slice(startIndex, endIndex);

  /* ================= AUTH UI ================= */

  if (status === "loading") return <LoadingSpinner />;

  if (status === "unauthenticated" && !showAuthDialog) {
    return (
      <DialogBox
        title="Akses Ditolak"
        message="Anda belum masuk. Silakan masuk untuk melihat DPT."
        onConfirm={() => (window.location.href = "/auth/login")}
        onCancel={() => (window.location.href = "/auth/login")}
      />
    );
  }

  /* ================= RENDER ================= */

  return (
    <div className="mb-24 mt-32 flex flex-col items-center pt-[80px]">
      <div className="container mx-auto flex max-w-6xl flex-col gap-16 p-4">
        {/* Title updated to use dark text for visibility against light background */}
        <div className="relative flex w-full flex-col items-center justify-center text-center text-white">
          <div className="relative flex gap-1">
            <h1 className="-rotate-12 font-sloop text-7xl text-white sm:text-9xl">
              D
            </h1>
            <h1 className="font-playfair text-6xl sm:text-8xl">aftar</h1>
          </div>
          <h1 className="mt-2 font-neuething text-5xl font-bold tracking-wide sm:text-7xl">
            PEMILIH TETAP
          </h1>
        </div>

        <Card
          title="Rekap Data Pemilih"
          subtitle="Daftar seluruh mahasiswa yang terdaftar dalam DPT Pemilu HMIF."
          right={
            dptQuery.isFetching ? (
              <span className="animate-pulse text-sm text-gray-400">
                Memuat ulang…
              </span>
            ) : null
          }
        >
          {/* Controls / Filters - Switched to White theme inputs */}
          <div className="mb-5 grid grid-cols-1 gap-3 md:grid-cols-4">
            <input
              className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 md:col-span-2"
              placeholder="Cari NIM atau Nama…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select
              className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
            >
              <option value="ALL">Semua Status</option>
              <option value="VOTED">Sudah Memilih</option>
              <option value="NOT_VOTED">Belum Memilih</option>
            </select>

            <div className="flex items-center justify-end gap-2">
              <span className="text-sm font-medium text-gray-500">
                Total: {totalItems}
              </span>
            </div>
          </div>

          {/* List */}
          {dptQuery.isLoading && <LoadingSpinner />}
          {dptQuery.error && <ErrorBox message={dptQuery.error.message} />}

          {!dptQuery.isLoading && !dptQuery.error && (
            <>
              {/* TABLE: Styled exactly like Laporan Page (White theme, horizontal scroll) */}
              <div className="w-full overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
                <table className="w-full min-w-[600px] text-left text-sm">
                  <thead className="border-b bg-gray-50 text-gray-600">
                    <tr>
                      <th className="w-16 px-4 py-3">No.</th>
                      <th className="w-32 px-4 py-3">NIM</th>
                      <th className="px-4 py-3">Nama</th>
                      <th className="px-4 py-3 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 bg-white">
                    {paginatedDpt.map((row) => (
                      <tr
                        key={row.nim}
                        className="transition-colors hover:bg-gray-50"
                      >
                        <td className="px-4 py-3 text-gray-400">{row.index}</td>
                        <td className="px-4 py-3 font-medium text-gray-900">
                          {row.nim}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={
                              row.name?.toLowerCase() === "belum registrasi"
                                ? "italic text-gray-300"
                                : "text-gray-700"
                            }
                          >
                            {row.name}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <Badge
                            ok={row.hasVoted}
                            text={
                              row.hasVoted ? "Sudah Memilih" : "Belum Memilih"
                            }
                          />
                        </td>
                      </tr>
                    ))}

                    {paginatedDpt.length === 0 && (
                      <tr>
                        <td
                          className="bg-white px-4 py-12 text-center text-gray-400"
                          colSpan={4}
                        >
                          Pemilih tidak ditemukan.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls - White Theme */}
              <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t pt-4">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-500">
                    Baris per halaman:
                  </span>
                  <select
                    className="rounded-lg border border-gray-200 bg-white px-2 py-1 text-sm text-gray-700 focus:outline-none"
                    value={pageSize}
                    onChange={(e) => setPageSize(e.target.value as any)}
                  >
                    <option value="10">10</option>
                    <option value="25">25</option>
                    <option value="50">50</option>
                    <option value="ALL">Semua</option>
                  </select>
                </div>

                {pageSize !== "ALL" && (
                  <div className="flex items-center gap-4">
                    <div className="text-sm text-gray-500">
                      Halaman{" "}
                      <span className="font-semibold text-gray-900">
                        {page + 1}
                      </span>{" "}
                      dari{" "}
                      <span className="font-semibold text-gray-900">
                        {totalPages}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                        disabled={!canPrev}
                        onClick={() => setPage((p) => Math.max(0, p - 1))}
                      >
                        Sebelumnya
                      </button>
                      <button
                        type="button"
                        className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                        disabled={!canNext}
                        onClick={() => setPage((p) => p + 1)}
                      >
                        Selanjutnya
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}
