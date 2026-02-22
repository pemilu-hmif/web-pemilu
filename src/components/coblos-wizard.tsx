"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { api } from "~/trpc/react";
import DialogBox from "~/components/DialogBox";
import Step1 from "./coblos-steps/step-1";
import Step2 from "./coblos-steps/step-2";
import Step3 from "./coblos-steps/step-3";
import Step4 from "./coblos-steps/step-4";
import SubmittedPage from "./coblos-steps/submitted";

type Candidate = {
  id: number;
  name: string;
  angkatan: string;
  number: number;
  image: string | null;
  type: "KAHIM" | "SENAT";
};

type Props = {
  kahimCandidates: Candidate[];
  senatCandidates: Candidate[];
  hasVoted: boolean;
  existingVote: {
    kahimId: number | null;
    senatId: number | null;
    createdAt: Date;
    kahim?: { id: number; name: string; number: number } | null;
    senat?: { id: number; name: string; number: number } | null;
  } | null;
};

// IMPORTANT:
// undefined = user has NOT chosen yet
// null = user chose "blank paper"
// number = chose candidate id
type Choice = number | null | undefined;

export default function Onboarding({
  kahimCandidates,
  senatCandidates,
  hasVoted,
  existingVote,
}: Props) {
  const utils = api.useUtils();

  // Rule: blank option ONLY if total candidates for that type is exactly 1
  const allowBlankKahim = kahimCandidates.length === 1;
  const allowBlankSenat = senatCandidates.length === 1;
  console.log("allowed blank kahim: ", allowBlankKahim);
  console.log("allowed blank senat: ", allowBlankSenat);

  const [isChecked, setIsChecked] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);

  // If already voted -> start at submitted page
  const [step, setStep] = useState(() => (hasVoted ? 4 : 0));

  const [kahimId, setKahimId] = useState<Choice>(undefined);
  const [senatId, setSenatId] = useState<Choice>(undefined);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const cast = api.vote.cast.useMutation({
    onSuccess: async () => {
      await utils.vote.myStatus.invalidate();
      setStep(4);
    },
    onError: async (err: any) => {
      // If user already voted, move to submitted page
      if (err?.data?.code === "CONFLICT") {
        await utils.vote.myStatus.invalidate();
        setStep(4);
        return;
      }
      setErrorMsg(err?.message ?? "Gagal mencoblos.");
    },
  });

  const kahimSelectedLabel = useMemo(() => {
    if (kahimId === undefined) return null;
    if (kahimId === null) return "Kertas Kosong";
    const c = kahimCandidates.find((x) => x.id === kahimId);
    return c ? `${c.number}. ${c.name}` : `Calon #${kahimId}`;
  }, [kahimId, kahimCandidates]);

  const senatSelectedLabel = useMemo(() => {
    if (senatId === undefined) return null;
    if (senatId === null) return "Kertas Kosong";
    const c = senatCandidates.find((x) => x.id === senatId);
    return c ? `${c.number}. ${c.name}` : `Calon #${senatId}`;
  }, [senatId, senatCandidates]);

  const handleNext = () => setStep((s) => Math.min(s + 1, 4));
  const handlePrev = () => setStep((s) => Math.max(s - 1, 0));

  const canNextStep0 = isChecked;
  const canNextStep1 =
    kahimCandidates.length === 0 ? true : kahimId !== undefined; // require explicit choice if candidates exist
  const canNextStep2 =
    senatCandidates.length === 0 ? true : senatId !== undefined; // require explicit choice if candidates exist
  const canSubmit = isConfirmed && !cast.isPending;

  const submit = async () => {
    // If candidates exist, require explicit choice.
    if (kahimCandidates.length > 0 && kahimId === undefined) {
      setErrorMsg(
        "Kamu belum memilih KAHIM (atau Kertas Kosong jika tersedia).",
      );
      return;
    }
    if (senatCandidates.length > 0 && senatId === undefined) {
      setErrorMsg(
        "Kamu belum memilih SENAT (atau Kertas Kosong jika tersedia).",
      );
      return;
    }

    // Enforce your rule (no blank when > 1 candidates)
    if (kahimCandidates.length > 1 && kahimId === null) {
      setErrorMsg(
        "Kertas Kosong tidak tersedia untuk KAHIM jika calonnya lebih dari satu.",
      );
      return;
    }
    if (senatCandidates.length > 1 && senatId === null) {
      setErrorMsg(
        "Kertas Kosong tidak tersedia untuk SENAT jika calonnya lebih dari satu.",
      );
      return;
    }

    await cast.mutateAsync({
      kahimId: kahimId === undefined ? null : kahimId,
      senatId: senatId === undefined ? null : senatId,
    });
  };

  if (errorMsg) {
    return (
      <DialogBox
        title="Error"
        message={errorMsg}
        onConfirm={() => setErrorMsg(null)}
        onCancel={() => setErrorMsg(null)}
      />
    );
  }

  return (
    <div className="mt-8 items-center px-4">
      {step === 0 && (
        <Step1 onChange={(v) => setIsChecked(v)} isChecked={isChecked} />
      )}

      {step === 0 && (
        <div className="mt-[84px] flex items-center justify-center gap-8">
          <button
            className="font-['Satoshi Variable'] flex h-[55px] w-[175px] items-center justify-center rounded-2xl border-4 border-[#ffbb00] bg-[#156e3c] px-8 py-3 text-2xl font-bold text-[#ffbb00] opacity-0"
            disabled
          >
            Sebelum
          </button>

          <button
            className={`${canNextStep0 ? "" : "opacity-50"} font-['Satoshi Variable'] flex h-[55px] w-[175px] items-center justify-center rounded-2xl bg-[#ffbb00] px-8 py-3 text-2xl font-bold text-[#156e3c]`}
            disabled={!canNextStep0}
            onClick={handleNext}
          >
            Lanjut
          </button>
        </div>
      )}

      {step === 1 && (
        <Step2
          candidates={kahimCandidates}
          value={kahimId}
          allowBlank={allowBlankKahim}
          onChange={setKahimId}
        />
      )}

      {step === 1 && (
        <div className="mt-[100px] flex items-center justify-center gap-8">
          <button
            className="font-['Satoshi Variable'] flex h-[55px] w-[175px] items-center justify-center rounded-2xl border-4 border-[#ffbb00] bg-[#156e3c] px-8 py-3 text-2xl font-bold text-[#ffbb00]"
            onClick={handlePrev}
          >
            Sebelum
          </button>

          <button
            className={`${canNextStep1 ? "" : "opacity-50"} font-['Satoshi Variable'] flex h-[55px] w-[175px] items-center justify-center rounded-2xl bg-[#ffbb00] px-8 py-3 text-2xl font-bold text-[#156e3c]`}
            disabled={!canNextStep1}
            onClick={handleNext}
          >
            Lanjut
          </button>
        </div>
      )}

      {step === 2 && (
        <Step3
          candidates={senatCandidates}
          value={senatId}
          allowBlank={allowBlankSenat}
          onChange={setSenatId}
        />
      )}

      {step === 2 && (
        <div className="mt-[100px] flex items-center justify-center gap-8">
          <button
            className="font-['Satoshi Variable'] flex h-[55px] w-[175px] items-center justify-center rounded-2xl border-4 border-[#ffbb00] bg-[#156e3c] px-8 py-3 text-2xl font-bold text-[#ffbb00]"
            onClick={handlePrev}
          >
            Sebelum
          </button>

          <button
            className={`${canNextStep2 ? "" : "opacity-50"} font-['Satoshi Variable'] flex h-[55px] w-[175px] items-center justify-center rounded-2xl bg-[#ffbb00] px-8 py-3 text-2xl font-bold text-[#156e3c]`}
            disabled={!canNextStep2}
            onClick={handleNext}
          >
            Lanjut
          </button>
        </div>
      )}

      {step === 3 && (
        <Step4
          isConfirmed={isConfirmed}
          onChange={setIsConfirmed}
          summary={{
            kahim: kahimSelectedLabel ?? "-",
            senat: senatSelectedLabel ?? "-",
          }}
        />
      )}

      {step === 3 && (
        <div className="mt-[84px] flex items-center justify-center gap-8">
          <button
            className="font-['Satoshi Variable'] flex h-[55px] w-[175px] items-center justify-center rounded-2xl border-4 border-[#ffbb00] bg-[#156e3c] px-8 py-3 text-2xl font-bold text-[#ffbb00]"
            onClick={handlePrev}
          >
            Sebelum
          </button>

          <button
            className={`${canSubmit ? "" : "opacity-50"} font-['Satoshi Variable'] flex h-[55px] w-[175px] items-center justify-center rounded-2xl bg-[#ffbb00] px-8 py-3 text-2xl font-bold text-[#156e3c]`}
            disabled={!canSubmit}
            onClick={submit}
          >
            {cast.isPending ? "Submitting..." : "Submit"}
          </button>
        </div>
      )}

      {step === 4 && <SubmittedPage existingVote={existingVote} />}

      {step === 4 && (
        <div className="mt-[84px] flex items-center justify-center gap-8">
          <Link href="/">
            <button className="font-['Satoshi Variable'] flex h-[55px] w-[175px] items-center justify-center rounded-2xl border-4 border-[#ffbb00] bg-[#156e3c] px-8 py-3 text-2xl font-bold text-[#ffbb00]">
              Beranda
            </button>
          </Link>

          <Link href="https://forms.gle/MgFXABwpVvbnCDMo9">
            <button className="font-['Satoshi Variable'] flex h-[55px] w-[175px] items-center justify-center rounded-2xl bg-[#ffbb00] px-8 py-3 text-2xl font-bold text-[#156e3c] opacity-50">
              Feedback
            </button>
          </Link>
        </div>
      )}

      {step < 4 ? (
        <div className="mt-4 flex items-center justify-center gap-3">
          {Array.from({ length: 4 }, (_, index) => (
            <div
              key={index}
              className={`mb-12 mt-10 h-3 w-3 rounded-full ${
                index === step ? "bg-[#ffbb00]" : "bg-white"
              } border border-[#ffbb00]`}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
