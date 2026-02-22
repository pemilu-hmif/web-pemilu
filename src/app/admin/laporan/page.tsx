"use client";

import * as React from "react";
import { api } from "~/trpc/react";
import { useSession } from "next-auth/react";
import DialogBox from "~/components/DialogBox";

type TotalsRow = {
  calonId: number;
  name: string;
  number: number | null;
  angkatan: string | null;
  type: "KAHIM" | "SENAT";
  count: number;
};

function TotalsTable({ rows }: { rows: TotalsRow[] }) {
  const totalVotes = rows.reduce((acc, r) => acc + r.count, 0);

  return (
    <div className="overflow-x-auto rounded-xl border">
      <table className="w-full text-sm">
        <thead className="border-b bg-gray-50 text-left">
          <tr>
            <th className="px-4 py-3">No</th>
            <th className="px-4 py-3">Nama</th>
            <th className="px-4 py-3">Angkatan</th>
            <th className="px-4 py-3">Total</th>
            <th className="px-4 py-3">Persentase</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => {
            const percentage =
              totalVotes > 0 ? (r.count / totalVotes) * 100 : 0;

            return (
              <tr key={r.calonId} className="border-b last:border-b-0">
                <td className="px-4 py-3">{r.number ?? "-"}</td>
                <td className="px-4 py-3">{r.name}</td>
                <td className="px-4 py-3">{r.angkatan ?? "-"}</td>
                <td className="px-4 py-3 font-semibold">{r.count}</td>
                <td className="px-4 py-3">{percentage.toFixed(2)}%</td>
              </tr>
            );
          })}

          {rows.length === 0 && (
            <tr>
              <td colSpan={5} className="px-4 py-6 text-center text-gray-500">
                Belum ada data.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "rounded-lg border px-3 py-2 text-sm",
        active ? "bg-black text-white" : "bg-white hover:bg-gray-50",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

type TotalsResult = NonNullable<
  ReturnType<typeof api.vote.totalsByElection.useQuery>["data"]
>;

function isTotalsBoth(
  x: TotalsResult | undefined,
): x is TotalsResult & { kahim: any; senat: any } {
  return !!x && "kahim" in x && "senat" in x;
}

export default function AdminLaporanPage() {
  const { data: session, status } = useSession();

  const isAuthed = status === "authenticated";
  const isAdmin = session?.user?.role === "ADMIN";

  const [tab, setTab] = React.useState<"kahim" | "senat">("kahim");

  // ✅ Always call hook (React rule)
  const totals = api.vote.totalsByElection.useQuery(undefined, {
    enabled: isAdmin, // only fetch if admin
  });

  const data = totals.data;
  const both = isTotalsBoth(data) ? data : null;

  // 🔒 While checking session
  if (status === "loading") {
    return null;
  }

  // 🔒 Not logged in
  if (!isAuthed) {
    return (
      <DialogBox
        title="Unauthorized"
        message="You must login first."
        onConfirm={() => (window.location.href = "/login")}
        onCancel={() => (window.location.href = "/")}
      />
    );
  }

  // 🔒 Logged in but not admin
  if (!isAdmin) {
    return (
      <DialogBox
        title="Forbidden"
        message="Admin only."
        onConfirm={() => (window.location.href = "/")}
        onCancel={() => (window.location.href = "/")}
      />
    );
  }

  return (
    <div className="mt-20 p-6">
      <div className="rounded-2xl border bg-white p-5 shadow-sm">
        <div className="mb-4">
          <h1 className="text-lg font-semibold">Laporan Hasil Voting</h1>
          <p className="text-sm text-gray-500">
            Rekap berdasarkan election aktif di config.
          </p>
        </div>

        {totals.isLoading && (
          <div className="text-sm text-gray-600">Loading…</div>
        )}

        {totals.error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {totals.error.message}
          </div>
        )}

        {data && (
          <div className="mt-4 space-y-4">
            <div className="text-sm text-gray-600">
              Election:{" "}
              <span className="font-medium text-gray-900">
                {data.election.name}
              </span>{" "}
              (<span className="font-mono">{data.election.id}</span>)
            </div>

            <div className="space-y-3">
              <div className="flex gap-2">
                <TabButton
                  active={tab === "kahim"}
                  onClick={() => setTab("kahim")}
                >
                  KAHIM
                </TabButton>
                <TabButton
                  active={tab === "senat"}
                  onClick={() => setTab("senat")}
                >
                  SENAT
                </TabButton>
              </div>

              {tab === "kahim" ? (
                <div className="rounded-2xl border p-4">
                  <div className="mb-3 flex justify-between">
                    <div className="font-semibold">Rekap KAHIM</div>
                    <div className="text-sm text-gray-600">
                      Total Votes: <b>{data.kahim.totalVotes}</b>
                    </div>
                  </div>
                  <TotalsTable rows={data.kahim.rows ?? []} />
                </div>
              ) : (
                <div className="rounded-2xl border p-4">
                  <div className="mb-3 flex justify-between">
                    <div className="font-semibold">Rekap SENAT</div>
                    <div className="text-sm text-gray-600">
                      Total Votes: <b>{data.senat.totalVotes}</b>
                    </div>
                  </div>
                  <TotalsTable rows={data.senat.rows ?? []} />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
