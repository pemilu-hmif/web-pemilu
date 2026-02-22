import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

const DEFAULT_CONFIG = {
  id: 1,
  timeline: false,
  calon: false,
  coblos: false,
  peraturan: false,
} as const;

function deriveNim(
  dbNim: string | null | undefined,
  email: string | null | undefined,
) {
  if (dbNim && dbNim.trim().length > 0) return dbNim.trim();

  if (typeof email === "string") {
    const at = email.indexOf("@");
    if (at > 0) return email.slice(0, at);
  }
  return null;
}

function getJurusanFromNim(nim: string | null) {
  if (!nim || nim.length < 3) return "Unknown";
  const kodeJurusan = nim.slice(0, 3);
  switch (kodeJurusan) {
    case "135":
      return "IF";
    case "182":
      return "STI";
    default:
      return "Unknown";
  }
}

function getAngkatanFromNim(nim: string | null) {
  if (!nim || nim.length < 5) return null;
  const yy = nim.slice(3, 5);
  return `20${yy}`;
}

function normalizeDisplayName(name: string | null | undefined) {
  if (!name) return "User";
  const idx = name.search(/[a-zA-Z]/);
  return idx >= 0 ? name.slice(idx) : name;
}

export const userRouter = createTRPCRouter({
  me: protectedProcedure.query(async ({ ctx }) => {
    const sessionUserId = ctx.session.user.id;

    const [user, config] = await ctx.db.$transaction([
      ctx.db.user.findUnique({
        where: { id: sessionUserId },
        select: {
          id: true,
          name: true,
          email: true,
          nim: true,
          role: true,
        },
      }),
      ctx.db.config.upsert({
        where: { id: 1 },
        create: { ...DEFAULT_CONFIG },
        update: {},
      }),
    ]);

    if (!user) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User not found.",
      });
    }

    const activeElectionId = config.activeElectionId;

    const nim = deriveNim(user.nim, user.email);

    const isEligible =
      nim == null || !activeElectionId
        ? false
        : !!(await ctx.db.eligible.findFirst({
            where: {
              nim,
              electionId: activeElectionId,
              eligible: true,
            },
            select: { id: true },
          }));

    const hasVoted = !activeElectionId
      ? false
      : !!(await ctx.db.vote.findUnique({
          where: {
            userId_electionId: {
              userId: user.id,
              electionId: activeElectionId,
            },
          },
        }));

    const coblosEnabled = !!config.coblos;

    return {
      id: user.id,
      email: user.email,
      name: normalizeDisplayName(user.name),
      nim,
      jurusan: getJurusanFromNim(nim),
      angkatan: getAngkatanFromNim(nim),
      role: user.role,
      isEligible,
      coblosEnabled,
      hasVoted: hasVoted,
    };
  }),
});
