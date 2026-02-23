"use client";

import React from "react";
import type { api } from "~/trpc/react";

import LoadingSpinner from "~/components/LoadingSpinner";
import type { AppRouter } from "~/server/api/root";
import type { inferRouterOutputs } from "@trpc/server";
/* ------------------------------------------------------------ */
/*  Extract hook result types directly from api                */
/* ------------------------------------------------------------ */
type RouterOutputs = inferRouterOutputs<AppRouter>;

type ConfigData = RouterOutputs["admin"]["configuration"]["config"]["get"];

type ElectionListData =
  RouterOutputs["admin"]["configuration"]["election"]["list"];
type ConfigQuery = ReturnType<
  typeof api.admin.configuration.config.get.useQuery
>;

type ElectionListQuery = ReturnType<
  typeof api.admin.configuration.election.list.useQuery
>;

type UpdateConfigMutation = ReturnType<
  typeof api.admin.configuration.config.update.useMutation
>;

type SetActiveElectionMutation = ReturnType<
  typeof api.admin.configuration.config.setActiveElection.useMutation
>;

type Props = {
  config: {
    data: ConfigData | undefined;
    isLoading: boolean;
    errorMessage?: string;
  };

  electionList: {
    data: ElectionListData | undefined;
    isLoading: boolean;
  };

  updateConfig: ReturnType<
    typeof api.admin.configuration.config.update.useMutation
  >;

  setActiveElection: ReturnType<
    typeof api.admin.configuration.config.setActiveElection.useMutation
  >;

  activeElectionId: string | null;
};

/* ------------------------------------------------------------ */
/*  Small UI helpers (copied from your page to avoid guessing) */
/* ------------------------------------------------------------ */

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

/* ------------------------------------------------------------ */
/*  Component                                                    */
/* ------------------------------------------------------------ */

export function FeatureFlagsCard({
  config,
  electionList,
  updateConfig,
  setActiveElection,
  activeElectionId,
}: Props) {
  return (
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
      {config.errorMessage && <ErrorBox message={config.errorMessage} />}

      {config.data && (
        <>
          {/* Feature toggles */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {(["timeline", "calon", "coblos", "peraturan", "countdown"] as const).map(
              (key) => (
                <TogglePill
                  key={key}
                  label={key.toUpperCase()}
                  value={config.data?.[key] ?? false}
                  disabled={updateConfig.isPending}
                  onToggle={() =>
                    updateConfig.mutate({
                      [key]: !(config.data?.[key] ?? false),
                    })
                  }
                />
              ),
            )}
          </div>
          


          {/* Active election config */}
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
                    electionId: v || null,
                  });
                }}
                disabled={setActiveElection.isPending || electionList.isLoading}
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
                onClick={() => setActiveElection.mutate({ electionId: null })}
              >
                Clear
              </button>
            </div>

            <div className="mt-2 text-xs text-white/60">
              Currently:{" "}
              {config.data?.activeElection ? (
                <span className="text-white/90">
                  {config.data.activeElection.name}
                </span>
              ) : (
                <span>(none)</span>
              )}
            </div>
          </div>
        </>
      )}
    </Card>
  );
}
