"use client";

import { useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { api } from "~/trpc/react";
import { CalonType } from "@prisma/client";

import DialogBox from "~/components/DialogBox";
import LoadingSpinner from "~/components/LoadingSpinner";

/* ---------------- Small UI helpers (same file) ---------------- */

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

function SuccessBox({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-200">
      {message}
    </div>
  );
}

function TogglePill(props: {
  label: string;
  value: boolean;
  disabled?: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      disabled={props.disabled}
      onClick={props.onToggle}
      className={[
        "flex items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left transition",
        props.value
          ? "border-emerald-400/40 bg-emerald-500/15"
          : "border-white/10 bg-black/20",
        props.disabled
          ? "opacity-60"
          : "hover:border-white/25 hover:bg-white/10",
      ].join(" ")}
    >
      <div className="font-medium text-white">{props.label}</div>
      <div
        className={[
          "h-6 w-11 rounded-full border p-1 transition",
          props.value
            ? "border-emerald-400/40 bg-emerald-500/30"
            : "border-white/20 bg-white/5",
        ].join(" ")}
      >
        <div
          className={[
            "h-4 w-4 rounded-full transition",
            props.value
              ? "translate-x-5 bg-emerald-300"
              : "translate-x-0 bg-white/60",
          ].join(" ")}
        />
      </div>
    </button>
  );
}

function Badge({ ok, text }: { ok: boolean; text: string }) {
  return (
    <span
      className={[
        "inline-flex items-center rounded-full border px-2 py-0.5 text-xs",
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

export default function Page() {
  const { data: session, status } = useSession();

  // dialogs
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [confirm, setConfirm] = useState<
    | null
    | { kind: "eligible"; id: number; nim: string }
    | { kind: "calon"; id: number }
  >(null);

  // flash message
  const [flash, setFlash] = useState<null | {
    type: "ok" | "err";
    msg: string;
  }>(null);

  const isAuthed = status === "authenticated";
  const isAdmin = isAuthed && session?.user?.role === "ADMIN";

  // TRPC hooks must be called unconditionally → gate with enabled flags
  const config = api.admin.configuration.config.get.useQuery(undefined, {
    enabled: isAdmin,
  });

  const eligibleSearchState = useState("");
  const [eligibleSearch, setEligibleSearch] = eligibleSearchState;

  const [eligibleFilter, setEligibleFilter] = useState<
    "ALL" | "ELIGIBLE" | "INELIGIBLE"
  >("ALL");

  const eligibleList = api.admin.configuration.eligible.list.useQuery(
    {
      page: 0,
      pageSize: 100,
      search: eligibleSearch.trim() ? eligibleSearch.trim() : undefined,
      eligible:
        eligibleFilter === "ALL"
          ? undefined
          : eligibleFilter === "ELIGIBLE"
            ? true
            : false,
    },
    { enabled: isAdmin },
  );

  const calonList = api.admin.configuration.calonDetail.list.useQuery(
    {},
    { enabled: isAdmin },
  );

  // Mutations
  const updateConfig = api.admin.configuration.config.update.useMutation({
    onSuccess: async () => {
      await config.refetch();
      setFlash({ type: "ok", msg: "Feature flags updated." });
      setTimeout(() => setFlash(null), 1800);
    },
    onError: (e) => {
      setFlash({ type: "err", msg: e.message });
      setTimeout(() => setFlash(null), 2500);
    },
  });

  const createEligible = api.admin.configuration.eligible.create.useMutation({
    onSuccess: async () => {
      await eligibleList.refetch();
      setFlash({ type: "ok", msg: "Eligible entry added." });
      setTimeout(() => setFlash(null), 1800);
    },
    onError: (e) => {
      setFlash({ type: "err", msg: e.message });
      setTimeout(() => setFlash(null), 2500);
    },
  });

  const updateEligible = api.admin.configuration.eligible.update.useMutation({
    onSuccess: async () => {
      await eligibleList.refetch();
      setFlash({ type: "ok", msg: "Eligible entry updated." });
      setTimeout(() => setFlash(null), 1800);
    },
    onError: (e) => {
      setFlash({ type: "err", msg: e.message });
      setTimeout(() => setFlash(null), 2500);
    },
  });

  const deleteEligible = api.admin.configuration.eligible.delete.useMutation({
    onSuccess: async () => {
      await eligibleList.refetch();
      setFlash({ type: "ok", msg: "Eligible entry deleted." });
      setTimeout(() => setFlash(null), 1800);
    },
    onError: (e) => {
      setFlash({ type: "err", msg: e.message });
      setTimeout(() => setFlash(null), 2500);
    },
  });

  const createCalon = api.admin.configuration.calonDetail.create.useMutation({
    onSuccess: async () => {
      await calonList.refetch();
      setFlash({ type: "ok", msg: "Calon detail created." });
      setTimeout(() => setFlash(null), 1800);
      setCalonForm({
        id: null,
        name: "",
        angkatan: "",
        number: 0,
        type: CalonType.KAHIM,
        image: "",
        vision: "",
        mision: "",
        document: "",
      });
    },
    onError: (e) => {
      setFlash({ type: "err", msg: e.message });
      setTimeout(() => setFlash(null), 2500);
    },
  });

  const updateCalon = api.admin.configuration.calonDetail.update.useMutation({
    onSuccess: async () => {
      await calonList.refetch();
      setFlash({ type: "ok", msg: "Calon detail updated." });
      setTimeout(() => setFlash(null), 1800);
    },
    onError: (e) => {
      setFlash({ type: "err", msg: e.message });
      setTimeout(() => setFlash(null), 2500);
    },
  });

  const deleteCalon = api.admin.configuration.calonDetail.delete.useMutation({
    onSuccess: async () => {
      await calonList.refetch();
      setFlash({ type: "ok", msg: "Calon detail deleted." });
      setTimeout(() => setFlash(null), 1800);
    },
    onError: (e) => {
      setFlash({ type: "err", msg: e.message });
      setTimeout(() => setFlash(null), 2500);
    },
  });

  // Local states for forms
  const [newNim, setNewNim] = useState("");
  const [newEligible, setNewEligible] = useState(true);

  const [editingEligibleId, setEditingEligibleId] = useState<number | null>(
    null,
  );
  const [editingEligibleNim, setEditingEligibleNim] = useState("");

  const [calonTypeFilter, setCalonTypeFilter] = useState<"ALL" | CalonType>(
    "ALL",
  );

  type CalonFormState = {
    id: number | null;
    name: string;
    angkatan: string;
    number: number;
    type: CalonType;
    image: string;
    vision: string;
    mision: string;
    document: string;
  };

  const [calonForm, setCalonForm] = useState<CalonFormState>({
    id: null,
    name: "",
    angkatan: "",
    number: 0,
    type: CalonType.KAHIM,
    image: "",
    vision: "",
    mision: "",
    document: "",
  });

  const filteredCalon = useMemo(() => {
    const all = calonList.data ?? [];
    if (calonTypeFilter === "ALL") return all;
    return all.filter((c) => c.type === calonTypeFilter);
  }, [calonList.data, calonTypeFilter]);

  /* ================= AUTH UI (render) ================= */

  if (status === "loading") return <LoadingSpinner />;

  if (status === "unauthenticated" && !showAuthDialog) {
    return (
      <DialogBox
        title="Unauthorized"
        message="You are not authenticated. Please log in to continue."
        onConfirm={() => (window.location.href = "/auth/login")}
        onCancel={() => (window.location.href = "/auth/login")}
      />
    );
  }

  if (isAuthed && !isAdmin) {
    return (
      <DialogBox
        title="Forbidden"
        message="Admin only."
        onConfirm={() => (window.location.href = "/")}
        onCancel={() => (window.location.href = "/")}
      />
    );
  }

  /* ================= Confirm Delete Dialog ================= */
  if (confirm?.kind === "eligible") {
    return (
      <DialogBox
        title="Delete Eligible Entry?"
        message={`Delete NIM ${confirm.nim}? This cannot be undone.`}
        onConfirm={() => {
          deleteEligible.mutate({ id: confirm.id });
          setConfirm(null);
        }}
        onCancel={() => setConfirm(null)}
      />
    );
  }

  if (confirm?.kind === "calon") {
    return (
      <DialogBox
        title="Delete Calon Detail?"
        message={`Delete calon detail "${confirm.id}"? This cannot be undone.`}
        onConfirm={() => {
          deleteCalon.mutate({ id: confirm.id });
          setConfirm(null);
        }}
        onCancel={() => setConfirm(null)}
      />
    );
  }

  /* ================= Main UI ================= */
  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6 text-white">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Admin Panel</h1>
        <p className="text-sm text-white/70">
          Manage feature flags, eligible voters, and calon details.
        </p>
      </div>

      {flash?.type === "ok" && <SuccessBox message={flash.msg} />}
      {flash?.type === "err" && <ErrorBox message={flash.msg} />}

      {/* Feature Flags */}
      <Card
        title="Feature Flags"
        subtitle="Toggle which pages/features are enabled."
        right={
          updateConfig.isPending ? (
            <span className="text-sm text-white/60">Saving…</span>
          ) : null
        }
      >
        {config.isLoading && <LoadingSpinner />}
        {config.error && <ErrorBox message={config.error.message} />}

        {config.data && (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {(["timeline", "calon", "coblos", "peraturan"] as const).map(
              (key) => (
                <TogglePill
                  key={key}
                  label={key.toUpperCase()}
                  value={config.data[key]}
                  disabled={updateConfig.isPending}
                  onToggle={() =>
                    updateConfig.mutate({ [key]: !config.data[key] })
                  }
                />
              ),
            )}
          </div>
        )}
      </Card>

      {/* Eligible */}
      <Card
        title="Eligible Voters"
        subtitle="Add, search, toggle eligibility, edit NIM, and delete entries."
        right={
          eligibleList.isFetching ? (
            <span className="text-sm text-white/60">Refreshing…</span>
          ) : null
        }
      >
        {/* Controls */}
        <div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-3">
          <input
            className="rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-white placeholder:text-white/40 focus:border-white/25 focus:outline-none"
            placeholder="Search NIM…"
            value={eligibleSearch}
            onChange={(e) => setEligibleSearch(e.target.value)}
          />

          <select
            className="rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-white focus:border-white/25 focus:outline-none"
            value={eligibleFilter}
            onChange={(e) => setEligibleFilter(e.target.value as any)}
          >
            <option value="ALL">All</option>
            <option value="ELIGIBLE">Eligible only</option>
            <option value="INELIGIBLE">Ineligible only</option>
          </select>

          <div className="flex items-center justify-end gap-2">
            <span className="text-sm text-white/60">
              Total: {eligibleList.data?.total ?? 0}
            </span>
          </div>
        </div>

        {/* Add form */}
        <div className="mb-5 grid grid-cols-1 gap-3 rounded-2xl border border-white/10 bg-black/20 p-4 md:grid-cols-3">
          <div className="md:col-span-2">
            <label className="mb-1 block text-xs text-white/60">NIM</label>
            <input
              className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-white placeholder:text-white/40 focus:border-white/25 focus:outline-none"
              placeholder="e.g. 13522001"
              value={newNim}
              onChange={(e) => setNewNim(e.target.value)}
            />
          </div>

          <div>
            <label className="mb-1 block text-xs text-white/60">Eligible</label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setNewEligible((v) => !v)}
                className={[
                  "flex w-full items-center justify-between rounded-xl border px-3 py-2 transition",
                  newEligible
                    ? "border-emerald-400/30 bg-emerald-500/10"
                    : "border-white/10 bg-black/30",
                ].join(" ")}
              >
                <span className="text-sm">{newEligible ? "Yes" : "No"}</span>
                <span className="text-xs text-white/60">toggle</span>
              </button>

              <button
                type="button"
                disabled={createEligible.isPending}
                className="rounded-xl border border-white/15 bg-white/10 px-4 py-2 text-sm transition hover:bg-white/15 disabled:opacity-60"
                onClick={() => {
                  const nim = newNim.trim();
                  if (!nim) {
                    setFlash({ type: "err", msg: "NIM cannot be empty." });
                    setTimeout(() => setFlash(null), 2000);
                    return;
                  }
                  createEligible.mutate({ nim, eligible: newEligible });
                  setNewNim("");
                  setNewEligible(true);
                }}
              >
                {createEligible.isPending ? "Adding…" : "Add"}
              </button>
            </div>
          </div>
        </div>

        {/* List */}
        {eligibleList.isLoading && <LoadingSpinner />}
        {eligibleList.error && (
          <ErrorBox message={eligibleList.error.message} />
        )}

        <div className="overflow-hidden rounded-2xl border border-white/10">
          <table className="w-full text-left text-sm">
            <thead className="bg-white/5 text-white/70">
              <tr>
                <th className="px-4 py-3">NIM</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {(eligibleList.data?.items ?? []).map((row) => {
                const isEditing = editingEligibleId === row.id;
                return (
                  <tr key={row.id} className="bg-black/20">
                    <td className="px-4 py-3">
                      {isEditing ? (
                        <input
                          className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-white focus:border-white/25 focus:outline-none"
                          value={editingEligibleNim}
                          onChange={(e) =>
                            setEditingEligibleNim(e.target.value)
                          }
                        />
                      ) : (
                        <span className="font-medium">{row.nim}</span>
                      )}
                    </td>

                    <td className="px-4 py-3">
                      <Badge
                        ok={row.eligible}
                        text={row.eligible ? "Eligible" : "Ineligible"}
                      />
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <button
                          className="rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs transition hover:bg-white/10"
                          disabled={updateEligible.isPending}
                          onClick={() =>
                            updateEligible.mutate({
                              id: row.id,
                              eligible: !row.eligible,
                            })
                          }
                        >
                          Toggle
                        </button>

                        {isEditing ? (
                          <>
                            <button
                              className="rounded-xl border border-emerald-400/25 bg-emerald-500/10 px-3 py-2 text-xs transition hover:bg-emerald-500/15"
                              disabled={updateEligible.isPending}
                              onClick={() => {
                                const nim = editingEligibleNim.trim();
                                if (!nim) {
                                  setFlash({
                                    type: "err",
                                    msg: "NIM cannot be empty.",
                                  });
                                  setTimeout(() => setFlash(null), 2000);
                                  return;
                                }
                                updateEligible.mutate({ id: row.id, nim });
                                setEditingEligibleId(null);
                                setEditingEligibleNim("");
                              }}
                            >
                              Save
                            </button>
                            <button
                              className="rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs transition hover:bg-white/10"
                              onClick={() => {
                                setEditingEligibleId(null);
                                setEditingEligibleNim("");
                              }}
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <button
                            className="rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs transition hover:bg-white/10"
                            onClick={() => {
                              setEditingEligibleId(row.id);
                              setEditingEligibleNim(row.nim);
                            }}
                          >
                            Edit
                          </button>
                        )}

                        <button
                          className="rounded-xl border border-red-400/25 bg-red-500/10 px-3 py-2 text-xs text-red-200 transition hover:bg-red-500/15"
                          onClick={() =>
                            setConfirm({
                              kind: "eligible",
                              id: row.id,
                              nim: row.nim,
                            })
                          }
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {(eligibleList.data?.items?.length ?? 0) === 0 && (
                <tr className="bg-black/20">
                  <td
                    className="px-4 py-6 text-center text-white/60"
                    colSpan={3}
                  >
                    No eligible entries found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Calon Detail */}
      <Card
        title="Calon Detail"
        subtitle="Upsert by ID (edit existing or create new). Image/document are public URLs."
        right={
          <select
            className="rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white focus:border-white/25 focus:outline-none"
            value={calonTypeFilter}
            onChange={(e) => setCalonTypeFilter(e.target.value as any)}
          >
            <option value="ALL">All types</option>
            <option value={CalonType.KAHIM}>KAHIM</option>
            <option value={CalonType.SENAT}>SENAT</option>
          </select>
        }
      >
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {/* Form */}
          <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-base font-semibold">Editor</h3>
              <div className="flex gap-2">
                <button
                  className="rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs transition hover:bg-white/10"
                  type="button"
                  onClick={() =>
                    setCalonForm({
                      id: null,
                      name: "",
                      angkatan: "",
                      number: 0,
                      type: CalonType.KAHIM,
                      image: "",
                      vision: "",
                      mision: "",
                      document: "",
                    })
                  }
                >
                  Reset
                </button>
                <button
                  className="rounded-xl border border-emerald-400/25 bg-emerald-500/10 px-3 py-2 text-xs transition hover:bg-emerald-500/15 disabled:opacity-60"
                  disabled={createCalon.isPending || updateCalon.isPending}
                  type="button"
                  onClick={() => {
                    const payload = {
                      name: calonForm.name.trim(),
                      angkatan: calonForm.angkatan.trim(),
                      number: calonForm.number,
                      type: calonForm.type,
                      image: calonForm.image.trim() || null,
                      vision: calonForm.vision.trim() || null,
                      mision: calonForm.mision.trim() || null,
                      document: calonForm.document.trim() || null,
                    };

                    if (!payload.name || !payload.angkatan) {
                      setFlash({
                        type: "err",
                        msg: "Name and angkatan are required.",
                      });
                      setTimeout(() => setFlash(null), 2000);
                      return;
                    }

                    if (calonForm.id == null) {
                      createCalon.mutate(payload);
                    } else {
                      updateCalon.mutate({ id: calonForm.id, ...payload });
                    }
                  }}
                >
                  {createCalon.isPending || updateCalon.isPending
                    ? "Saving…"
                    : calonForm.id == null
                      ? "Create"
                      : "Save"}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs text-white/60">
                    Name
                  </label>
                  <input
                    className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-white focus:border-white/25 focus:outline-none"
                    value={calonForm.name}
                    onChange={(e) =>
                      setCalonForm({ ...calonForm, name: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs text-white/60">
                    Angkatan
                  </label>
                  <input
                    className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-white focus:border-white/25 focus:outline-none"
                    placeholder="e.g. 2022"
                    value={calonForm.angkatan}
                    onChange={(e) =>
                      setCalonForm({ ...calonForm, angkatan: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs text-white/60">
                    Number{" "}
                    {calonForm.id != null
                      ? `(editing id: ${calonForm.id})`
                      : ""}
                  </label>
                  <input
                    type="number"
                    className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-white focus:border-white/25 focus:outline-none"
                    value={calonForm.number}
                    onChange={(e) =>
                      setCalonForm({
                        ...calonForm,
                        number: Number(e.target.value),
                      })
                    }
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs text-white/60">
                    Type
                  </label>
                  <select
                    className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-white focus:border-white/25 focus:outline-none"
                    value={calonForm.type}
                    onChange={(e) =>
                      setCalonForm({
                        ...calonForm,
                        type: e.target.value as CalonType,
                      })
                    }
                  >
                    <option value={CalonType.KAHIM}>KAHIM</option>
                    <option value={CalonType.SENAT}>SENAT</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs text-white/60">
                  Image URL
                </label>
                <input
                  className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-white focus:border-white/25 focus:outline-none"
                  placeholder="/assets/calon/a.png or https://…"
                  value={calonForm.image}
                  onChange={(e) =>
                    setCalonForm({ ...calonForm, image: e.target.value })
                  }
                />
                {calonForm.image.trim() && (
                  <div className="mt-3 overflow-hidden rounded-xl border border-white/10 bg-black/30">
                    {/* preview */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={calonForm.image}
                      alt="preview"
                      className="h-40 w-full object-cover"
                      onError={(e) => {
                        // hide broken images visually
                        (e.currentTarget.style.display as any) = "none";
                      }}
                    />
                    <div className="px-3 py-2 text-xs text-white/60">
                      Preview (if URL is valid)
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="mb-1 block text-xs text-white/60">
                  Document URL
                </label>
                <input
                  className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-white focus:border-white/25 focus:outline-none"
                  placeholder="/docs/calon/a.pdf or https://…"
                  value={calonForm.document}
                  onChange={(e) =>
                    setCalonForm({ ...calonForm, document: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="mb-1 block text-xs text-white/60">
                  Vision
                </label>
                <textarea
                  className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-white focus:border-white/25 focus:outline-none"
                  rows={4}
                  value={calonForm.vision}
                  onChange={(e) =>
                    setCalonForm({ ...calonForm, vision: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="mb-1 block text-xs text-white/60">
                  Mission
                </label>
                <textarea
                  className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-white focus:border-white/25 focus:outline-none"
                  rows={4}
                  value={calonForm.mision}
                  onChange={(e) =>
                    setCalonForm({ ...calonForm, mision: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          {/* List */}
          <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-base font-semibold">Existing Calon</h3>
              {calonList.isFetching && (
                <span className="text-xs text-white/60">Refreshing…</span>
              )}
            </div>

            {calonList.isLoading && <LoadingSpinner />}
            {calonList.error && <ErrorBox message={calonList.error.message} />}

            <div className="overflow-hidden rounded-2xl border border-white/10">
              <table className="w-full text-left text-sm">
                <thead className="bg-white/5 text-white/70">
                  <tr>
                    <th className="px-4 py-3">ID</th>
                    <th className="px-4 py-3">Type</th>
                    <th className="px-4 py-3">Links</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {filteredCalon.map((c) => (
                    <tr key={c.id} className="bg-black/20">
                      <td className="px-4 py-3">
                        <div className="font-medium">{c.id}</div>
                        {c.image ? (
                          <div className="mt-2 overflow-hidden rounded-xl border border-white/10">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={c.image}
                              alt={c.id.toString()}
                              className="h-20 w-full object-cover"
                              onError={(e) => {
                                (e.currentTarget.style.display as any) = "none";
                              }}
                            />
                          </div>
                        ) : (
                          <div className="mt-1 text-xs text-white/50">
                            No image
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <Badge ok={true} text={c.type} />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col gap-1 text-xs">
                          {c.image ? (
                            <a
                              className="text-white/80 underline"
                              href={c.image}
                              target="_blank"
                            >
                              image
                            </a>
                          ) : (
                            <span className="text-white/40">image: —</span>
                          )}
                          {c.document ? (
                            <a
                              className="text-white/80 underline"
                              href={c.document}
                              target="_blank"
                            >
                              document
                            </a>
                          ) : (
                            <span className="text-white/40">document: —</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          <button
                            className="rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs transition hover:bg-white/10"
                            type="button"
                            onClick={() =>
                              setCalonForm({
                                id: c.id,
                                name: c.name ?? "",
                                angkatan: c.angkatan ?? "",
                                number: c.number ?? 0,
                                type: c.type,
                                image: c.image ?? "",
                                vision: c.vision ?? "",
                                mision: c.mision ?? "",
                                document: c.document ?? "",
                              })
                            }
                          >
                            Edit
                          </button>
                          <button
                            className="rounded-xl border border-red-400/25 bg-red-500/10 px-3 py-2 text-xs text-red-200 transition hover:bg-red-500/15"
                            type="button"
                            onClick={() =>
                              setConfirm({ kind: "calon", id: c.id })
                            }
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {filteredCalon.length === 0 && (
                    <tr className="bg-black/20">
                      <td
                        className="px-4 py-6 text-center text-white/60"
                        colSpan={4}
                      >
                        No calon details found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <p className="mt-3 text-xs text-white/50">
              Tip: click <span className="text-white/80">Edit</span> to load an
              entry into the form, change fields, then{" "}
              <span className="text-white/80">Save</span>.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
