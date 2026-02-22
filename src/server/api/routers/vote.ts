import { TRPCError } from "@trpc/server";
import {
  adminProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";
import { z } from "zod";

const ACTIVE_CONFIG_ID = 1;

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

async function assertEligibleForElection(
  ctx: any,
  userId: string,
  electionId: string,
) {
  const user = await ctx.db.user.findUnique({
    where: { id: userId },
    select: { nim: true, email: true },
  });

  const nim = deriveNim(user?.nim, user?.email);

  if (!nim) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Cannot determine NIM for eligibility check.",
    });
  }

  const eligible = await ctx.db.eligible.findFirst({
    where: { electionId, nim, eligible: true },
    select: { id: true },
  });

  if (!eligible) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "You are not eligible to vote in this election.",
    });
  }

  return { nim };
}

export const voteRouter = createTRPCRouter({
  /**
   * Submit ONE ballot: kahimId + senatId for the active election.
   */
  cast: protectedProcedure
    .input(
      z.object({
        kahimId: z.number().int().optional().nullable(),
        senatId: z.number().int().optional().nullable(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      // 1️⃣ Get global config
      const config = await ctx.db.config.findUnique({
        where: { id: ACTIVE_CONFIG_ID },
        select: { coblos: true, activeElectionId: true },
      });

      if (!config?.activeElectionId) {
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message: "No active election is set in config.",
        });
      }

      if (!config.coblos) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Voting (coblos) is currently disabled in config.",
        });
      }

      const electionId = config.activeElectionId;

      // 2️⃣ Verify election exists AND isActive = true
      const election = await ctx.db.election.findUnique({
        where: { id: electionId },
        select: { id: true, isActive: true },
      });

      if (!election) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Active election not found.",
        });
      }

      if (!election.isActive) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "This election is not currently active.",
        });
      }

      // 3️⃣ Check eligibility
      await assertEligibleForElection(ctx, userId, electionId);

      const selectedIds = [input.kahimId, input.senatId].filter(
        (id): id is number => id !== null && id !== undefined,
      );

      if (selectedIds.length > 0) {
        const candidates = await ctx.db.calon_Detail.findMany({
          where: { id: { in: selectedIds } },
          select: { id: true, type: true, isActive: true },
        });

        if (candidates.length !== selectedIds.length) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "One or more selected candidates not found.",
          });
        }

        for (const c of candidates) {
          if (!c.isActive) {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: `Candidate ${c.id} is not active.`,
            });
          }

          if (c.id === input.kahimId && c.type !== "KAHIM") {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: "Invalid KAHIM selection.",
            });
          }

          if (c.id === input.senatId && c.type !== "SENAT") {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: "Invalid SENAT selection.",
            });
          }
        }

        const linked = await ctx.db.electionCalon.findMany({
          where: {
            electionId,
            calonId: { in: selectedIds },
            isActive: true,
          },
        });

        if (linked.length !== selectedIds.length) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message:
              "Selected candidates are not registered/active in this election.",
          });
        }
      }

      // 4️⃣ Create vote
      try {
        const vote = await ctx.db.vote.create({
          data: {
            userId,
            electionId,
            kahimId: input.kahimId ?? null,
            senatId: input.senatId ?? null,
          },
        });

        return { ok: true as const, vote };
      } catch (err: any) {
        if (err?.code === "P2002") {
          throw new TRPCError({
            code: "CONFLICT",
            message: "You have already voted in this election.",
          });
        }

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to cast vote.",
        });
      }
    }),

  /**
   * Status for active election.
   */
  myStatus: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    const config = await ctx.db.config.findUnique({
      where: { id: ACTIVE_CONFIG_ID },
      select: { activeElectionId: true },
    });

    if (!config?.activeElectionId) {
      throw new TRPCError({
        code: "PRECONDITION_FAILED",
        message: "No active election has been assigned in the global config.",
      });
    }

    const electionId = config.activeElectionId;

    let isEligible = false;
    try {
      await assertEligibleForElection(ctx, userId, electionId);
      isEligible = true;
    } catch {
      isEligible = false;
    }

    const vote = await ctx.db.vote.findUnique({
      where: { userId_electionId: { userId, electionId } },
      select: {
        id: true,
        kahimId: true,
        senatId: true,
        createdAt: true,
        kahim: { select: { id: true, name: true, number: true } },
        senat: { select: { id: true, name: true, number: true } },
      },
    });

    return {
      activeElectionId: electionId,
      isEligible,
      hasVoted: !!vote,
      vote,
    };
  }),

  /**
   * Laporan totals: returns BOTH KAHIM + SENAT totals for an election.
   * (Optional input.type filters which block you return.)
   */
  totalsByElection: adminProcedure.query(async ({ ctx }) => {
    const config = await ctx.db.config.findUnique({
      where: { id: ACTIVE_CONFIG_ID },
      select: { activeElectionId: true },
    });

    if (!config?.activeElectionId) {
      throw new TRPCError({
        code: "PRECONDITION_FAILED",
        message: "No active election is set in config.",
      });
    }

    const electionId = config.activeElectionId;

    const election = await ctx.db.election.findUnique({
      where: { id: electionId },
      select: { id: true, name: true },
    });

    if (!election) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Election not found.",
      });
    }

    // 🔹 Group votes by kahimId
    const kahimGrouped = await ctx.db.vote.groupBy({
      by: ["kahimId"],
      where: { electionId },
      _count: { _all: true },
    });

    // 🔹 Group votes by senatId
    const senatGrouped = await ctx.db.vote.groupBy({
      by: ["senatId"],
      where: { electionId },
      _count: { _all: true },
    });

    // 🔹 Remove null IDs (important!)
    const kahimIds = kahimGrouped
      .map((g) => g.kahimId)
      .filter((id): id is number => id !== null);

    const senatIds = senatGrouped
      .map((g) => g.senatId)
      .filter((id): id is number => id !== null);

    const [kahimCalons, senatCalons] = await Promise.all([
      kahimIds.length
        ? ctx.db.calon_Detail.findMany({
            where: { id: { in: kahimIds }, type: "KAHIM" },
            select: {
              id: true,
              name: true,
              number: true,
              angkatan: true,
              type: true,
            },
          })
        : [],
      senatIds.length
        ? ctx.db.calon_Detail.findMany({
            where: { id: { in: senatIds }, type: "SENAT" },
            select: {
              id: true,
              name: true,
              number: true,
              angkatan: true,
              type: true,
            },
          })
        : [],
    ]);

    const kahimCountMap = new Map<number, number>();
    for (const g of kahimGrouped) {
      if (g.kahimId !== null) {
        kahimCountMap.set(g.kahimId, g._count._all);
      }
    }

    const senatCountMap = new Map<number, number>();
    for (const g of senatGrouped) {
      if (g.senatId !== null) {
        senatCountMap.set(g.senatId, g._count._all);
      }
    }

    const kahimRows = kahimCalons
      .map((c) => ({
        calonId: c.id,
        name: c.name,
        number: c.number,
        angkatan: c.angkatan,
        type: c.type,
        count: kahimCountMap.get(c.id) ?? 0,
      }))
      .sort((a, b) => (a.number ?? 0) - (b.number ?? 0));

    const senatRows = senatCalons
      .map((c) => ({
        calonId: c.id,
        name: c.name,
        number: c.number,
        angkatan: c.angkatan,
        type: c.type,
        count: senatCountMap.get(c.id) ?? 0,
      }))
      .sort((a, b) => (a.number ?? 0) - (b.number ?? 0));

    const kahimTotalVotes = kahimRows.reduce((acc, r) => acc + r.count, 0);
    const senatTotalVotes = senatRows.reduce((acc, r) => acc + r.count, 0);

    return {
      election,
      kahim: { totalVotes: kahimTotalVotes, rows: kahimRows },
      senat: { totalVotes: senatTotalVotes, rows: senatRows },
    };
  }),
});
