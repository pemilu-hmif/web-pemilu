"use client";

import { useMemo, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { api } from "~/trpc/react";
import DialogBox from "~/components/DialogBox";
import LoadingSpinner from "~/components/LoadingSpinner";

/* ---------------- Small UI helpers ---------------- */

function Card(props: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  right?: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-white">{props.title}</h2>
          {props.subtitle && (
            <p className="mt-1 text-sm text-white/70">{props.subtitle}</p>
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
    <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
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
          ? "border-emerald-400/30 bg-emerald-500/10 text-emerald-200"
          : "border-white/15 bg-white/5 text-white/70",
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
  // Assuming listdpt was added to voteRouter
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
      // Search matching (Nim or Name)
      const query = search.toLowerCase().trim();
      const matchSearch =
        item.nim.toLowerCase().includes(query) ||
        item.name?.toLowerCase().includes(query);

      // Status matching
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
        title="Unauthorized"
        message="You are not authenticated. Please log in to view the DPT."
        onConfirm={() => (window.location.href = "/auth/login")}
        onCancel={() => (window.location.href = "/auth/login")}
      />
    );
  }

  /* ================= RENDER ================= */

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6 pt-40 text-white">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Daftar Pemilih Tetap (DPT)</h1>
        <p className="text-sm text-white/70">
          List of eligible voters and their voting status for the current active
          election.
        </p>
      </div>

      <Card
        title="Eligible Voters"
        subtitle="Search by NIM or Name, and filter by voting status."
        right={
          dptQuery.isFetching ? (
            <span className="text-sm text-white/60">Refreshing…</span>
          ) : null
        }
      >
        {/* Controls / Filters */}
        <div className="mb-5 grid grid-cols-1 gap-3 md:grid-cols-4">
          <input
            className="rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-white placeholder:text-white/40 focus:border-white/25 focus:outline-none md:col-span-2"
            placeholder="Search NIM or Name…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-white focus:border-white/25 focus:outline-none"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
          >
            <option value="ALL">All Status</option>
            <option value="VOTED">Have Voted</option>
            <option value="NOT_VOTED">Not Voted</option>
          </select>

          <div className="flex items-center justify-end gap-2">
            <span className="text-sm text-white/60">Showing: {totalItems}</span>
          </div>
        </div>

        {/* List */}
        {dptQuery.isLoading && <LoadingSpinner />}
        {dptQuery.error && <ErrorBox message={dptQuery.error.message} />}

        {!dptQuery.isLoading && !dptQuery.error && (
          <>
            <div className="overflow-hidden rounded-2xl border border-white/10">
              <table className="w-full text-left text-sm">
                <thead className="bg-white/5 text-white/70">
                  <tr>
                    <th className="w-16 px-4 py-3">No.</th>
                    <th className="w-32 px-4 py-3">NIM</th>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {paginatedDpt.map((row) => (
                    <tr
                      key={row.nim}
                      className="bg-black/20 transition-colors hover:bg-white/5"
                    >
                      <td className="px-4 py-3 text-white/60">{row.index}</td>
                      <td className="px-4 py-3 font-medium">{row.nim}</td>
                      <td className="px-4 py-3">
                        <span
                          className={
                            row.name === "Belum Registrasi / Unknown"
                              ? "italic text-white/40"
                              : "text-white"
                          }
                        >
                          {row.name}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Badge ok={row.hasVoted} text={row.status} />
                      </td>
                    </tr>
                  ))}

                  {paginatedDpt.length === 0 && (
                    <tr className="bg-black/20">
                      <td
                        className="px-4 py-8 text-center text-white/60"
                        colSpan={4}
                      >
                        No matching voters found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-sm text-white/60">Rows per page:</span>
                <select
                  className="rounded-xl border border-white/10 bg-black/30 px-2 py-1.5 text-sm text-white focus:border-white/25 focus:outline-none"
                  value={pageSize}
                  onChange={(e) => setPageSize(e.target.value as any)}
                >
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                  <option value="ALL">Show All</option>
                </select>
              </div>

              {pageSize !== "ALL" && (
                <div className="flex items-center gap-4">
                  <div className="text-sm text-white/60">
                    Page{" "}
                    <span className="font-medium text-white">{page + 1}</span>{" "}
                    of{" "}
                    <span className="font-medium text-white">{totalPages}</span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="rounded-xl border border-white/15 bg-white/5 px-3 py-1.5 text-xs transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
                      disabled={!canPrev}
                      onClick={() => setPage((p) => Math.max(0, p - 1))}
                    >
                      Prev
                    </button>
                    <button
                      type="button"
                      className="rounded-xl border border-white/15 bg-white/5 px-3 py-1.5 text-xs transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
                      disabled={!canNext}
                      onClick={() => setPage((p) => p + 1)}
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
