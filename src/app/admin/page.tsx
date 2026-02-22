"use client";

import { useMemo, useState, useEffect } from "react";
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

function yyyyMmDd(d: Date | null | undefined) {
  if (!d) return "";
  return d.toISOString().slice(0, 10);
}

function dateFromInputToUTCDate(dateStr: string) {
  // date-only stability: treat as UTC midnight
  return new Date(`${dateStr}T00:00:00.000Z`);
}

function TabsBar<T extends string>(props: {
  value: T;
  onChange: (v: T) => void;
  tabs: Array<{ id: T; label: string; badge?: string }>;
}) {
  return (
    <div className="flex flex-wrap gap-2 rounded-2xl border border-white/10 bg-black/20 p-2">
      {props.tabs.map((t) => {
        const active = props.value === t.id;
        return (
          <button
            key={t.id}
            type="button"
            onClick={() => props.onChange(t.id)}
            className={[
              "rounded-xl border px-3 py-2 text-sm transition",
              active
                ? "border-white/25 bg-white/15 text-white"
                : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white",
            ].join(" ")}
          >
            <span>{t.label}</span>
            {t.badge ? (
              <span className="ml-2 rounded-full border border-white/15 bg-black/30 px-2 py-0.5 text-xs text-white/70">
                {t.badge}
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
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
    | { kind: "timeline"; id: string; title: string }
    | { kind: "election"; id: string; name: string }
  >(null);
  const [calonPage, setCalonPage] = useState(0);

  const [flash, setFlash] = useState<null | {
    type: "ok" | "err";
    msg: string;
  }>(null);
  type AdminTab = "FLAGS" | "ELIGIBLE" | "CALON" | "TIMELINE" | "ELECTIONS";
  const [activeTab, setActiveTab] = useState<AdminTab>("FLAGS");

  const isAuthed = status === "authenticated";
  const isAdmin = isAuthed && session?.user?.role === "ADMIN";

  const config = api.admin.configuration.config.get.useQuery(undefined, {
    enabled: isAdmin,
  });

  const eligibleSearchState = useState("");
  const [eligibleSearch, setEligibleSearch] = eligibleSearchState;

  const [eligibleFilter, setEligibleFilter] = useState<
    "ALL" | "ELIGIBLE" | "INELIGIBLE"
  >("ALL");
  const [eligiblePage, setEligiblePage] = useState(0);
  const ELIGIBLE_PAGE_SIZE = 5;

  const activeElectionId = config.data?.activeElectionId ?? null;

  const eligibleList = api.admin.configuration.eligible.list.useQuery(
    {
      electionId: activeElectionId ?? undefined, // ✅ pass electionId
      page: eligiblePage,
      pageSize: ELIGIBLE_PAGE_SIZE,
      search: eligibleSearch.trim() ? eligibleSearch.trim() : undefined,
      eligible:
        eligibleFilter === "ALL"
          ? undefined
          : eligibleFilter === "ELIGIBLE"
            ? true
            : false,
    },
    { enabled: isAdmin && !!activeElectionId },
  );

  const calonList = api.admin.configuration.calonDetail.list.useQuery(
    {},
    { enabled: isAdmin },
  );

  const [timelineSearch, setTimelineSearch] = useState("");
  const timelineList = api.admin.configuration.timeline.list.useQuery(
    {
      electionId: activeElectionId ?? undefined,
      search: timelineSearch.trim() ? timelineSearch.trim() : undefined,
    },
    { enabled: isAdmin && !!activeElectionId },
  );

  const [electionTypeFilter, setElectionTypeFilter] = useState<
    "ALL" | CalonType
  >("ALL");
  const [electionActiveFilter, setElectionActiveFilter] = useState<
    "ALL" | "ACTIVE" | "INACTIVE"
  >("ALL");

  const electionList = api.admin.configuration.election.list.useQuery(
    {
      isActive:
        electionActiveFilter === "ALL"
          ? undefined
          : electionActiveFilter === "ACTIVE"
            ? true
            : false,
    },
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

  const setActiveElection =
    api.admin.configuration.config.setActiveElection.useMutation({
      onSuccess: async () => {
        await config.refetch();
        setFlash({ type: "ok", msg: "Active election updated." });
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

  const toggleCalonActive =
    api.admin.configuration.calonDetail.toggleActive.useMutation({
      onSuccess: async () => {
        await calonList.refetch();
        setFlash({ type: "ok", msg: "Calon active status updated." });
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

  const createTimeline = api.admin.configuration.timeline.create.useMutation({
    onSuccess: async () => {
      await timelineList.refetch();
      setFlash({ type: "ok", msg: "Timeline created." });
      setTimeout(() => setFlash(null), 1800);
      setTimelineForm({ id: null, title: "", dateFrom: "", dateTo: "" });
    },
    onError: (e) => {
      setFlash({ type: "err", msg: e.message });
      setTimeout(() => setFlash(null), 2500);
    },
  });

  const updateTimeline = api.admin.configuration.timeline.update.useMutation({
    onSuccess: async () => {
      await timelineList.refetch();
      setFlash({ type: "ok", msg: "Timeline updated." });
      setTimeout(() => setFlash(null), 1800);
    },
    onError: (e) => {
      setFlash({ type: "err", msg: e.message });
      setTimeout(() => setFlash(null), 2500);
    },
  });

  const deleteTimeline = api.admin.configuration.timeline.delete.useMutation({
    onSuccess: async () => {
      await timelineList.refetch();
      setFlash({ type: "ok", msg: "Timeline deleted." });
      setTimeout(() => setFlash(null), 1800);
    },
    onError: (e) => {
      setFlash({ type: "err", msg: e.message });
      setTimeout(() => setFlash(null), 2500);
    },
  });

  const createElection = api.admin.configuration.election.create.useMutation({
    onSuccess: async () => {
      await electionList.refetch();
      setFlash({ type: "ok", msg: "Election created." });
      setTimeout(() => setFlash(null), 1800);
      setElectionForm({
        id: null,
        name: "",
        isActive: false,
      });
    },
    onError: (e) => {
      setFlash({ type: "err", msg: e.message });
      setTimeout(() => setFlash(null), 2500);
    },
  });

  const updateElection = api.admin.configuration.election.update.useMutation({
    onSuccess: async () => {
      await electionList.refetch();
      await config.refetch();
      setFlash({ type: "ok", msg: "Election updated." });
      setTimeout(() => setFlash(null), 1800);
    },
    onError: (e) => {
      setFlash({ type: "err", msg: e.message });
      setTimeout(() => setFlash(null), 2500);
    },
  });

  const deleteElection = api.admin.configuration.election.delete.useMutation({
    onSuccess: async () => {
      await electionList.refetch();
      await config.refetch();
      setFlash({ type: "ok", msg: "Election deleted." });
      setTimeout(() => setFlash(null), 1800);
    },
    onError: (e) => {
      setFlash({ type: "err", msg: e.message });
      setTimeout(() => setFlash(null), 2500);
    },
  });

  const addCalonToElection =
    api.admin.configuration.election.addCalon.useMutation({
      onSuccess: async () => {
        await electionList.refetch();
        setFlash({ type: "ok", msg: "Calon added to election." });
        setTimeout(() => setFlash(null), 1800);
      },
      onError: (e) => {
        setFlash({ type: "err", msg: e.message });
        setTimeout(() => setFlash(null), 2500);
      },
    });

  const removeCalonFromElection =
    api.admin.configuration.election.removeCalon.useMutation({
      onSuccess: async () => {
        await electionList.refetch();
        setFlash({ type: "ok", msg: "Calon removed from election." });
        setTimeout(() => setFlash(null), 1800);
      },
      onError: (e) => {
        setFlash({ type: "err", msg: e.message });
        setTimeout(() => setFlash(null), 2500);
      },
    });

  const toggleElectionCalon =
    api.admin.configuration.election.toggleElectionCalon.useMutation({
      onSuccess: async () => {
        await electionList.refetch();
        setFlash({ type: "ok", msg: "Election calon status updated." });
        setTimeout(() => setFlash(null), 1800);
      },
      onError: (e) => {
        setFlash({ type: "err", msg: e.message });
        setTimeout(() => setFlash(null), 2500);
      },
    });
  useEffect(() => {
    setEligiblePage(0);
  }, [eligibleSearch, eligibleFilter, activeElectionId]);
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

  type TimelineFormState = {
    id: string | null;
    title: string;
    dateFrom: string; // yyyy-mm-dd
    dateTo: string; // yyyy-mm-dd or ""
  };

  const [timelineForm, setTimelineForm] = useState<TimelineFormState>({
    id: null,
    title: "",
    dateFrom: "",
    dateTo: "",
  });

  type ElectionFormState = {
    id: string | null;
    name: string;
    isActive: boolean;
  };

  const [electionForm, setElectionForm] = useState<ElectionFormState>({
    id: null,
    name: "",
    isActive: false,
  });

  const [addCalonId, setAddCalonId] = useState<number | null>(null);

  const filteredCalon = useMemo(() => {
    const all = calonList.data ?? [];
    if (calonTypeFilter === "ALL") return all;
    return all.filter((c) => c.type === calonTypeFilter);
  }, [calonList.data, calonTypeFilter]);

  useEffect(() => {
    setCalonPage(0);
  }, [filteredCalon.length]);

  const currentEditingElection = useMemo(() => {
    if (!electionForm.id) return null;
    return (
      (electionList.data ?? []).find((e) => e.id === electionForm.id) ?? null
    );
  }, [electionForm.id, electionList.data]);

  const calonOptionsForElection = useMemo(() => {
    const all = calonList.data ?? [];
    return all.sort((a, b) => (a.number ?? 0) - (b.number ?? 0));
  }, [calonList.data]);

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

  if (confirm?.kind === "timeline") {
    return (
      <DialogBox
        title="Delete Timeline?"
        message={`Delete timeline "${confirm.title}"? This cannot be undone.`}
        onConfirm={() => {
          deleteTimeline.mutate({ id: confirm.id });
          setConfirm(null);
        }}
        onCancel={() => setConfirm(null)}
      />
    );
  }

  if (confirm?.kind === "election") {
    return (
      <DialogBox
        title="Delete Election?"
        message={`Delete election "${confirm.name}"? This cannot be undone.`}
        onConfirm={() => {
          deleteElection.mutate({ id: confirm.id });
          setConfirm(null);
        }}
        onCancel={() => setConfirm(null)}
      />
    );
  }
  const total = eligibleList.data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / ELIGIBLE_PAGE_SIZE));
  const canPrev = eligiblePage > 0;
  const canNext = eligiblePage + 1 < totalPages;
  const CALON_PAGE_SIZE = 3;

  const totalCalon = filteredCalon.length;
  const totalCalonPages = Math.max(1, Math.ceil(totalCalon / CALON_PAGE_SIZE));

  const calonStart = calonPage * CALON_PAGE_SIZE;
  const calonEnd = calonStart + CALON_PAGE_SIZE;

  const paginatedCalon = filteredCalon.slice(calonStart, calonEnd);

  const calonCanPrev = calonPage > 0;
  const calonCanNext = calonPage + 1 < totalCalonPages;

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6 pt-40 text-white">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Admin Panel</h1>
        <p className="text-sm text-white/70">
          Manage feature flags, eligible voters, and calon details.
        </p>
      </div>
      <TabsBar
        value={activeTab}
        onChange={setActiveTab}
        tabs={[
          { id: "FLAGS", label: "Feature Flags" },
          {
            id: "ELIGIBLE",
            label: "Eligible",
            badge: String(eligibleList.data?.total ?? 0),
          },
          {
            id: "CALON",
            label: "Calon",
            badge: String((calonList.data ?? []).length),
          },
          {
            id: "TIMELINE",
            label: "Timeline",
            badge: String(timelineList.data?.length ?? 0),
          },
          {
            id: "ELECTIONS",
            label: "Elections",
            badge: String(electionList.data?.length ?? 0),
          },
        ]}
      />
      {flash?.type === "ok" && <SuccessBox message={flash.msg} />}
      {flash?.type === "err" && <ErrorBox message={flash.msg} />}

      {activeTab === "FLAGS" && (
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
            <>
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

              {/* NEW: Active election config */}
              <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <div className="text-sm font-medium">
                    Active Election (Config)
                  </div>
                  {setActiveElection.isPending ? (
                    <span className="text-xs text-white/60">Saving…</span>
                  ) : null}
                </div>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                  <select
                    className="rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white focus:border-white/25 focus:outline-none md:col-span-2"
                    value={activeElectionId ?? ""}
                    onChange={(e) => {
                      const v = e.target.value;
                      setActiveElection.mutate({
                        electionId: v ? v : null,
                      });
                    }}
                    disabled={
                      setActiveElection.isPending || electionList.isLoading
                    }
                  >
                    <option value="">(none)</option>
                    {(electionList.data ?? []).map((e) => (
                      <option key={e.id} value={e.id}>
                        {e.name}
                      </option>
                    ))}
                  </select>

                  <button
                    type="button"
                    className="rounded-xl border border-white/15 bg-white/10 px-4 py-2 text-sm transition hover:bg-white/15 disabled:opacity-60"
                    disabled={setActiveElection.isPending}
                    onClick={() =>
                      setActiveElection.mutate({ electionId: null })
                    }
                  >
                    Clear
                  </button>
                </div>

                <div className="mt-2 text-xs text-white/60">
                  Currently:{" "}
                  {config.data.activeElection ? (
                    <span className="text-white/90">
                      {config.data.activeElection.name} (
                    </span>
                  ) : (
                    <span>(none)</span>
                  )}
                </div>
              </div>
            </>
          )}
        </Card>
      )}

      {activeTab === "ELIGIBLE" && (
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
              <label className="mb-1 block text-xs text-white/60">
                Eligible
              </label>
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
                    if (!activeElectionId) {
                      setFlash({
                        type: "err",
                        msg: "Set an Active Election first.",
                      });
                      setTimeout(() => setFlash(null), 2000);
                      return;
                    }

                    createEligible.mutate({
                      electionId: activeElectionId ?? undefined,
                      nim,
                      eligible: newEligible,
                    });

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
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
            <div className="text-sm text-white/60">
              Page <span className="text-white">{eligiblePage + 1}</span> of{" "}
              <span className="text-white">{totalPages}</span> • Total{" "}
              <span className="text-white">{total}</span>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                className="rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs transition hover:bg-white/10 disabled:opacity-50"
                disabled={!canPrev || eligibleList.isFetching}
                onClick={() => setEligiblePage((p) => Math.max(0, p - 1))}
              >
                Prev
              </button>

              <button
                type="button"
                className="rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs transition hover:bg-white/10 disabled:opacity-50"
                disabled={!canNext || eligibleList.isFetching}
                onClick={() => setEligiblePage((p) => p + 1)}
              >
                Next
              </button>
            </div>
          </div>
        </Card>
      )}

      {activeTab === "CALON" && (
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
              {calonList.error && (
                <ErrorBox message={calonList.error.message} />
              )}

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
                    {paginatedCalon.map((c) => (
                      <tr key={c.id} className="bg-black/20">
                        <td className="px-4 py-3">
                          <div className="font-medium">{c.id}</div>
                          <div className="mt-1 text-xs text-white/60">
                            #{c.number} • {c.name}
                          </div>
                          <div className="mt-2">
                            <Badge
                              ok={!!c.isActive}
                              text={c.isActive ? "Active" : "Inactive"}
                            />
                          </div>
                          {c.image ? (
                            <div className="mt-2 overflow-hidden rounded-xl border border-white/10">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={c.image}
                                alt={c.id.toString()}
                                className="h-20 w-full object-cover"
                                onError={(e) => {
                                  (e.currentTarget.style.display as any) =
                                    "none";
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
                                toggleCalonActive.mutate({
                                  id: c.id,
                                  isActive: !c.isActive,
                                })
                              }
                              disabled={toggleCalonActive.isPending}
                            >
                              {c.isActive ? "Deactivate" : "Activate"}
                            </button>
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

                    {totalCalon === 0 && (
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
              <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                <div className="text-sm text-white/60">
                  Page <span className="text-white">{calonPage + 1}</span> of{" "}
                  <span className="text-white">{totalCalonPages}</span> • Total{" "}
                  <span className="text-white">{totalCalon}</span>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    className="rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs transition hover:bg-white/10 disabled:opacity-50"
                    disabled={!calonCanPrev}
                    onClick={() => setCalonPage((p) => Math.max(0, p - 1))}
                  >
                    Prev
                  </button>

                  <button
                    type="button"
                    className="rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs transition hover:bg-white/10 disabled:opacity-50"
                    disabled={!calonCanNext}
                    onClick={() => setCalonPage((p) => p + 1)}
                  >
                    Next
                  </button>
                </div>
              </div>
              <p className="mt-3 text-xs text-white/50">
                Tip: click <span className="text-white/80">Edit</span> to load
                an entry into the form, change fields, then{" "}
                <span className="text-white/80">Save</span>.
              </p>
            </div>
          </div>
        </Card>
      )}

      {activeTab === "TIMELINE" && (
        <Card
          title="Timeline"
          subtitle="Create events that are a date or a date range (dateTo optional)."
          right={
            timelineList.isFetching ? (
              <span className="text-sm text-white/60">Refreshing…</span>
            ) : null
          }
        >
          <div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-3">
            <input
              className="rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-white placeholder:text-white/40 focus:border-white/25 focus:outline-none"
              placeholder="Search title…"
              value={timelineSearch}
              onChange={(e) => setTimelineSearch(e.target.value)}
            />

            <div className="flex items-center gap-2 md:col-span-2">
              <span className="text-sm text-white/60">
                Total: {timelineList.data?.length ?? 0}
              </span>
              {!config.data?.timeline && (
                <span className="ml-auto text-xs text-white/50">
                  (Feature flag TIMELINE is currently OFF)
                </span>
              )}
            </div>
          </div>

          {/* Editor */}
          <div className="mb-5 rounded-2xl border border-white/10 bg-black/20 p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-base font-semibold">Editor</h3>
              <div className="flex gap-2">
                <button
                  className="rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs transition hover:bg-white/10"
                  type="button"
                  onClick={() =>
                    setTimelineForm({
                      id: null,
                      title: "",
                      dateFrom: "",
                      dateTo: "",
                    })
                  }
                >
                  Reset
                </button>

                <button
                  className="rounded-xl border border-emerald-400/25 bg-emerald-500/10 px-3 py-2 text-xs transition hover:bg-emerald-500/15 disabled:opacity-60"
                  type="button"
                  disabled={
                    createTimeline.isPending || updateTimeline.isPending
                  }
                  onClick={() => {
                    const title = timelineForm.title.trim();
                    const df = timelineForm.dateFrom.trim();
                    const dt = timelineForm.dateTo.trim();

                    if (!title || !df) {
                      setFlash({
                        type: "err",
                        msg: "Title and dateFrom are required.",
                      });
                      setTimeout(() => setFlash(null), 2000);
                      return;
                    }

                    const payload = {
                      title,
                      dateFrom: dateFromInputToUTCDate(df),
                      dateTo: dt ? dateFromInputToUTCDate(dt) : null,
                    };

                    if (!activeElectionId) {
                      setFlash({
                        type: "err",
                        msg: "Set an Active Election first.",
                      });
                      setTimeout(() => setFlash(null), 2000);
                      return;
                    }

                    if (timelineForm.id == null) {
                      createTimeline.mutate({
                        electionId: activeElectionId,
                        ...payload,
                      });
                    } else {
                      updateTimeline.mutate({
                        id: timelineForm.id,
                        ...payload,
                      });
                    }
                  }}
                >
                  {createTimeline.isPending || updateTimeline.isPending
                    ? "Saving…"
                    : timelineForm.id == null
                      ? "Create"
                      : "Save"}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              <div className="md:col-span-2">
                <label className="mb-1 block text-xs text-white/60">
                  Title
                </label>
                <input
                  className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-white focus:border-white/25 focus:outline-none"
                  value={timelineForm.title}
                  onChange={(e) =>
                    setTimelineForm({ ...timelineForm, title: e.target.value })
                  }
                />
              </div>

              <div className="flex items-end gap-2">
                <div className="w-full">
                  <label className="mb-1 block text-xs text-white/60">
                    Date From
                  </label>
                  <input
                    type="date"
                    className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-white focus:border-white/25 focus:outline-none"
                    value={timelineForm.dateFrom}
                    onChange={(e) =>
                      setTimelineForm({
                        ...timelineForm,
                        dateFrom: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="w-full">
                  <label className="mb-1 block text-xs text-white/60">
                    Date To (optional)
                  </label>
                  <input
                    type="date"
                    className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-white focus:border-white/25 focus:outline-none"
                    value={timelineForm.dateTo}
                    onChange={(e) =>
                      setTimelineForm({
                        ...timelineForm,
                        dateTo: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          {/* List */}
          {timelineList.isLoading && <LoadingSpinner />}
          {timelineList.error && (
            <ErrorBox message={timelineList.error.message} />
          )}

          <div className="overflow-hidden rounded-2xl border border-white/10">
            <table className="w-full text-left text-sm">
              <thead className="bg-white/5 text-white/70">
                <tr>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {(timelineList.data ?? []).map((t) => {
                  const from = yyyyMmDd(t.dateFrom);
                  const to = t.dateTo ? yyyyMmDd(t.dateTo) : "";
                  return (
                    <tr key={t.id} className="bg-black/20">
                      <td className="px-4 py-3">
                        <div className="font-medium">
                          {to ? `${from} → ${to}` : from}
                        </div>
                      </td>
                      <td className="px-4 py-3">{t.title}</td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          <button
                            className="rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs transition hover:bg-white/10"
                            type="button"
                            onClick={() =>
                              setTimelineForm({
                                id: t.id,
                                title: t.title ?? "",
                                dateFrom: yyyyMmDd(t.dateFrom),
                                dateTo: t.dateTo ? yyyyMmDd(t.dateTo) : "",
                              })
                            }
                          >
                            Edit
                          </button>
                          <button
                            className="rounded-xl border border-red-400/25 bg-red-500/10 px-3 py-2 text-xs text-red-200 transition hover:bg-red-500/15"
                            type="button"
                            onClick={() =>
                              setConfirm({
                                kind: "timeline",
                                id: t.id,
                                title: t.title,
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

                {(timelineList.data?.length ?? 0) === 0 && (
                  <tr className="bg-black/20">
                    <td
                      className="px-4 py-6 text-center text-white/60"
                      colSpan={3}
                    >
                      No timeline entries found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {activeTab === "ELECTIONS" && (
        <Card
          title="Elections"
          subtitle="CRUD elections, attach/remove calon, and manage active election via Config."
          right={
            electionList.isFetching ? (
              <span className="text-sm text-white/60">Refreshing…</span>
            ) : null
          }
        >
          {/* Filters */}
          <div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-3">
            <select
              className="rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-white focus:border-white/25 focus:outline-none"
              value={electionTypeFilter}
              onChange={(e) => setElectionTypeFilter(e.target.value as any)}
            >
              <option value="ALL">All types</option>
              <option value={CalonType.KAHIM}>KAHIM</option>
              <option value={CalonType.SENAT}>SENAT</option>
            </select>

            <select
              className="rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-white focus:border-white/25 focus:outline-none"
              value={electionActiveFilter}
              onChange={(e) => setElectionActiveFilter(e.target.value as any)}
            >
              <option value="ALL">All</option>
              <option value="ACTIVE">Active only</option>
              <option value="INACTIVE">Inactive only</option>
            </select>

            <div className="flex items-center justify-end gap-2">
              <span className="text-sm text-white/60">
                Total: {electionList.data?.length ?? 0}
              </span>
            </div>
          </div>

          {/* Election editor */}
          <div className="mb-5 rounded-2xl border border-white/10 bg-black/20 p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-base font-semibold">Election Editor</h3>
              <div className="flex gap-2">
                <button
                  className="rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs transition hover:bg-white/10"
                  type="button"
                  onClick={() => {
                    setElectionForm({
                      id: null,
                      name: "",
                      isActive: false,
                    });
                    setAddCalonId(null);
                  }}
                >
                  Reset
                </button>

                <button
                  className="rounded-xl border border-emerald-400/25 bg-emerald-500/10 px-3 py-2 text-xs transition hover:bg-emerald-500/15 disabled:opacity-60"
                  type="button"
                  disabled={
                    createElection.isPending || updateElection.isPending
                  }
                  onClick={() => {
                    const name = electionForm.name.trim();
                    const payload = {
                      name,
                      isActive: electionForm.isActive,
                    };

                    if (electionForm.id == null) {
                      createElection.mutate(payload);
                    } else {
                      updateElection.mutate({
                        id: electionForm.id,
                        ...payload,
                      });
                    }
                  }}
                >
                  {createElection.isPending || updateElection.isPending
                    ? "Saving…"
                    : electionForm.id == null
                      ? "Create"
                      : "Save"}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
              <div className="md:col-span-2">
                <label className="mb-1 block text-xs text-white/60">Name</label>
                <input
                  className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-white focus:border-white/25 focus:outline-none"
                  value={electionForm.name}
                  onChange={(e) =>
                    setElectionForm({ ...electionForm, name: e.target.value })
                  }
                />
              </div>
              <div className="flex items-end">
                <TogglePill
                  label="isActive (Election)"
                  value={electionForm.isActive}
                  disabled={
                    createElection.isPending || updateElection.isPending
                  }
                  onToggle={() =>
                    setElectionForm({
                      ...electionForm,
                      isActive: !electionForm.isActive,
                    })
                  }
                />
              </div>
              <div className="flex items-end gap-2 md:col-span-2">
                <button
                  type="button"
                  className="rounded-xl border border-white/15 bg-white/10 px-4 py-2 text-sm transition hover:bg-white/15 disabled:opacity-60"
                  disabled={!electionForm.id || setActiveElection.isPending}
                  onClick={() => {
                    if (!electionForm.id) return;
                    setActiveElection.mutate({ electionId: electionForm.id });
                  }}
                >
                  Set as Active (Config)
                </button>

                <button
                  type="button"
                  className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm transition hover:bg-white/10 disabled:opacity-60"
                  disabled={!electionForm.id}
                  onClick={() => {
                    if (!electionForm.id) return;
                    setConfirm({
                      kind: "election",
                      id: electionForm.id,
                      name: electionForm.name || "(untitled)",
                    });
                  }}
                >
                  Delete Election
                </button>
              </div>
            </div>

            {/* Manage calons in election */}
            <div className="mt-4 rounded-2xl border border-white/10 bg-black/15 p-4">
              <div className="mb-2 flex items-center justify-between">
                <div className="text-sm font-medium">
                  Calons in this Election
                </div>
                {!electionForm.id ? (
                  <span className="text-xs text-white/60">
                    Save/create election to manage calons.
                  </span>
                ) : null}
              </div>

              {electionForm.id && (
                <>
                  <div className="mb-3 grid grid-cols-1 gap-3 md:grid-cols-3">
                    <select
                      className="rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white focus:border-white/25 focus:outline-none md:col-span-2"
                      value={addCalonId ?? ""}
                      onChange={(e) => {
                        const v = e.target.value;
                        setAddCalonId(v ? Number(v) : null);
                      }}
                    >
                      <option value="">Select calon to add…</option>
                      {calonOptionsForElection.map((c) => (
                        <option key={c.id} value={c.id}>
                          #{c.number} • {c.name} • {c.angkatan} •{" "}
                          {c.isActive ? "ACTIVE" : "INACTIVE"}
                        </option>
                      ))}
                    </select>

                    <button
                      type="button"
                      className="rounded-xl border border-emerald-400/25 bg-emerald-500/10 px-4 py-2 text-sm transition hover:bg-emerald-500/15 disabled:opacity-60"
                      disabled={!addCalonId || addCalonToElection.isPending}
                      onClick={() => {
                        if (!electionForm.id || !addCalonId) return;
                        addCalonToElection.mutate({
                          electionId: electionForm.id,
                          calonId: addCalonId,
                        });
                      }}
                    >
                      Add Calon
                    </button>
                  </div>

                  <div className="overflow-hidden rounded-2xl border border-white/10">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-white/5 text-white/70">
                        <tr>
                          <th className="px-4 py-3">Calon</th>
                          <th className="px-4 py-3">Status</th>
                          <th className="px-4 py-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/10">
                        {(currentEditingElection?.calons ?? []).map((ec) => (
                          <tr key={ec.id} className="bg-black/20">
                            <td className="px-4 py-3">
                              <div className="font-medium">
                                #{ec.calon.number} • {ec.calon.name}
                              </div>
                              <div className="text-xs text-white/60">
                                {ec.calon.type} • {ec.calon.angkatan} • calon:
                                {ec.calon.isActive ? "active" : "inactive"}
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <Badge
                                  ok={ec.isActive}
                                  text={
                                    ec.isActive
                                      ? "In Election (Active)"
                                      : "In Election (Inactive)"
                                  }
                                />
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex justify-end gap-2">
                                <button
                                  type="button"
                                  className="rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs transition hover:bg-white/10 disabled:opacity-60"
                                  disabled={toggleElectionCalon.isPending}
                                  onClick={() =>
                                    toggleElectionCalon.mutate({
                                      electionCalonId: ec.id,
                                      isActive: !ec.isActive,
                                    })
                                  }
                                >
                                  {ec.isActive ? "Disable" : "Enable"}
                                </button>

                                <button
                                  type="button"
                                  className="rounded-xl border border-red-400/25 bg-red-500/10 px-3 py-2 text-xs text-red-200 transition hover:bg-red-500/15 disabled:opacity-60"
                                  disabled={removeCalonFromElection.isPending}
                                  onClick={() => {
                                    if (!electionForm.id) return;
                                    removeCalonFromElection.mutate({
                                      electionId: electionForm.id,
                                      calonId: ec.calonId,
                                    });
                                  }}
                                >
                                  Remove
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}

                        {(currentEditingElection?.calons?.length ?? 0) ===
                          0 && (
                          <tr className="bg-black/20">
                            <td
                              className="px-4 py-6 text-center text-white/60"
                              colSpan={3}
                            >
                              No calons attached yet.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  <div className="mt-2 text-xs text-white/60">
                    Note: Ordering in election list uses{" "}
                    <span className="text-white/80">calon.number ASC</span>.
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Election list */}
          {electionList.isLoading && <LoadingSpinner />}
          {electionList.error && (
            <ErrorBox message={electionList.error.message} />
          )}

          <div className="overflow-hidden rounded-2xl border border-white/10">
            <table className="w-full text-left text-sm">
              <thead className="bg-white/5 text-white/70">
                <tr>
                  <th className="px-4 py-3">Election</th>
                  <th className="px-4 py-3">Flags</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {(electionList.data ?? []).map((e) => {
                  const isCfgActive = activeElectionId === e.id;
                  return (
                    <tr key={e.id} className="bg-black/20">
                      <td className="px-4 py-3">
                        <div className="font-medium">{e.name}</div>
                        <div className="mt-2 text-xs text-white/60">
                          Calons: {e.calons?.length ?? 0}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-2">
                          <Badge
                            ok={e.isActive}
                            text={
                              e.isActive
                                ? "Election Active"
                                : "Election Inactive"
                            }
                          />
                          <Badge
                            ok={isCfgActive}
                            text={isCfgActive ? "Config Active" : "—"}
                          />
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          <button
                            className="rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs transition hover:bg-white/10"
                            type="button"
                            onClick={() => {
                              setElectionForm({
                                id: e.id,
                                name: e.name,
                                isActive: !!e.isActive,
                              });
                              setAddCalonId(null);
                            }}
                          >
                            Edit
                          </button>

                          <button
                            className="rounded-xl border border-emerald-400/25 bg-emerald-500/10 px-3 py-2 text-xs transition hover:bg-emerald-500/15 disabled:opacity-60"
                            type="button"
                            disabled={setActiveElection.isPending}
                            onClick={() =>
                              setActiveElection.mutate({ electionId: e.id })
                            }
                          >
                            Set Active
                          </button>

                          <button
                            className="rounded-xl border border-red-400/25 bg-red-500/10 px-3 py-2 text-xs text-red-200 transition hover:bg-red-500/15"
                            type="button"
                            onClick={() =>
                              setConfirm({
                                kind: "election",
                                id: e.id,
                                name: e.name,
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

                {(electionList.data?.length ?? 0) === 0 && (
                  <tr className="bg-black/20">
                    <td
                      className="px-4 py-6 text-center text-white/60"
                      colSpan={4}
                    >
                      No elections found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
