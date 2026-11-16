import { z } from "zod";
import { TRPCError } from "@trpc/server";
import {
  createTRPCRouter,
  adminProcedure,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { CalonType } from "../../../../../generated/prisma";

const DEFAULT_CONFIG = {
  id: 1,
  timeline: false,
  calon: false,
  coblos: false,
  peraturan: false,
  countdown: false,
  toStart: null,
  toEnd: null,
  toReveal: null,
  kahimResult: null,
  senatResult: null,
  activeElectionId: null as string | null,
} as const;

async function getOrCreateConfig(ctx: any) {
  return ctx.db.config.upsert({
    where: { id: 1 },
    create: { ...DEFAULT_CONFIG },
    update: {},
  });
}

async function requireElectionId(ctx: any, electionId?: string | null) {
  if (electionId) return electionId;

  const cfg = await getOrCreateConfig(ctx);
  if (!cfg.activeElectionId) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "No active election set in config.",
    });
  }
  return cfg.activeElectionId;
}

/* ----------------------------- Eligible ----------------------------- */

const eligibleListInput = z.object({
  electionId: z.string().cuid().optional(),
  page: z.number().int().min(0).default(0),
  pageSize: z.number().int().min(1).max(200).default(20),
  search: z.string().trim().max(64).optional(),
  eligible: z.boolean().optional(),
});

const eligibleCreateInput = z.object({
  electionId: z.string().cuid().optional(),
  nim: z.string().trim().min(1).max(32),
  eligible: z.boolean().default(true),
});

const eligibleUpdateInput = z.object({
  id: z.number().int().positive(),
  nim: z.string().trim().min(1).max(32).optional(),
  eligible: z.boolean().optional(),
});

const eligibleDeleteInput = z.object({
  id: z.number().int().positive(),
});

/* ----------------------------- Config ------------------------------ */

const configUpdateInput = z.object({
  timeline: z.boolean().optional(),
  calon: z.boolean().optional(),
  coblos: z.boolean().optional(),
  peraturan: z.boolean().optional(),
  countdown: z.boolean().optional(),
  toStart: z.coerce.date().optional().nullable(),
  toEnd: z.coerce.date().optional().nullable(),
  toReveal: z.coerce.date().optional().nullable(),
  kahimResult: z.string().trim().max(500).optional().nullable(),
  senatResult: z.string().trim().max(500).optional().nullable(),
  // activeElectionId is set via a dedicated mutation below
});

const configSetActiveElectionInput = z.object({
  electionId: z.string().cuid().nullable(), // null = clear active election
});

/* -------------------------- Calon_Detail --------------------------- */

const calonListInput = z.object({
  type: z.nativeEnum(CalonType).optional(),
  isActive: z.boolean().optional(),
});

const calonGetInput = z.object({
  id: z.number().int().positive(),
});

const calonCreateInput = z.object({
  name: z.string().trim().min(1).max(128),
  angkatan: z.string().trim().min(1).max(16),
  number: z.number().int().min(0),
  type: z.nativeEnum(CalonType),
  image: z.string().trim().max(500).optional().nullable(),
  vision: z.string().trim().max(5000).optional().nullable(),
  mision: z.string().trim().max(5000).optional().nullable(),
  document: z.string().trim().max(500).optional().nullable(),
});

const calonUpdateInput = z.object({
  id: z.number().int().positive(),
  name: z.string().trim().min(1).max(128).optional(),
  angkatan: z.string().trim().min(1).max(16).optional(),
  number: z.number().int().min(0).optional(),
  type: z.nativeEnum(CalonType).optional(),
  image: z.string().trim().max(500).optional().nullable(),
  vision: z.string().trim().max(5000).optional().nullable(),
  mision: z.string().trim().max(5000).optional().nullable(),
  document: z.string().trim().max(500).optional().nullable(),
  isActive: z.boolean().optional(),
});

const calonDeleteInput = z.object({
  id: z.number().int().positive(),
});

const calonToggleActiveInput = z.object({
  id: z.number().int().positive(),
  isActive: z.boolean(),
});

/* ----------------------------- Timeline ---------------------------- */

const timelineListInput = z.object({
  electionId: z.string().cuid().optional(),
  search: z.string().trim().max(128).optional(),
});

const timelineCreateInput = z.object({
  electionId: z.string().cuid().optional(),
  title: z.string().trim().min(1).max(200),
  dateFrom: z.coerce.date(),
  dateTo: z.coerce.date().optional().nullable(),
});

const timelineUpdateInput = z.object({
  id: z.string().cuid(),
  title: z.string().trim().min(1).max(200).optional(),
  dateFrom: z.coerce.date().optional(),
  dateTo: z.coerce.date().optional().nullable(),
});

const timelineDeleteInput = z.object({
  id: z.string().cuid(),
});

/* ----------------------------- Election ---------------------------- */

const electionListInput = z.object({
  isActive: z.boolean().optional(),
});

const electionGetInput = z.object({
  id: z.string().cuid(),
});

const electionCreateInput = z.object({
  name: z.string().trim().min(1).max(200),
  isActive: z.boolean().optional(),
});

const electionUpdateInput = z.object({
  id: z.string().cuid(),
  name: z.string().trim().min(1).max(200).optional(),
  isActive: z.boolean().optional(),
});

const electionDeleteInput = z.object({
  id: z.string().cuid(),
});

/* -------------------------- ElectionCalon -------------------------- */

const electionCalonAddInput = z.object({
  electionId: z.string().cuid(),
  calonId: z.number().int().positive(),
});

const electionCalonRemoveInput = z.object({
  electionId: z.string().cuid(),
  calonId: z.number().int().positive(),
});

const electionCalonToggleActiveInput = z.object({
  electionCalonId: z.string().cuid(),
  isActive: z.boolean(),
});

const configSetCountdownInput = z.object({
  countdown: z.boolean().optional(),
  toStart: z.coerce.date().optional().nullable(),
  toEnd: z.coerce.date().optional().nullable(),
  toReveal: z.coerce.date().optional().nullable(),
});

/* ============================ Router =============================== */

export const adminConfigurationRouter = createTRPCRouter({
  /* ----------------------------- Eligible ----------------------------- */
  eligible: createTRPCRouter({
    list: protectedProcedure
      .input(eligibleListInput)
      .query(async ({ ctx, input }) => {
        const { page, pageSize, search, eligible } = input;
        const electionId = await requireElectionId(ctx, input.electionId);

        const where = {
          electionId,
          ...(typeof eligible === "boolean" ? { eligible } : {}),
          ...(search
            ? { nim: { contains: search, mode: "insensitive" as const } }
            : {}),
        };

        const [items, total] = await ctx.db.$transaction([
          ctx.db.eligible.findMany({
            where,
            orderBy: { id: "desc" },
            skip: page * pageSize,
            take: pageSize,
          }),
          ctx.db.eligible.count({ where }),
        ]);

        return {
          items,
          total,
          page,
          pageSize,
          pageCount: Math.ceil(total / pageSize),
        };
      }),

    create: adminProcedure
      .input(eligibleCreateInput)
      .mutation(async ({ ctx, input }) => {
        const electionId = await requireElectionId(ctx, input.electionId);

        const exists =
          (await ctx.db.eligible
            .findUnique({
              where: { electionId_nim: { electionId, nim: input.nim } },
            })
            .catch(() => null)) ??
          (await ctx.db.eligible.findFirst({
            where: { electionId, nim: input.nim },
          }));

        if (exists) {
          throw new TRPCError({
            code: "CONFLICT",
            message: `NIM already exists for this election: ${input.nim}`,
          });
        }

        return ctx.db.eligible.create({
          data: { electionId, nim: input.nim, eligible: input.eligible },
        });
      }),

    update: adminProcedure
      .input(eligibleUpdateInput)
      .mutation(async ({ ctx, input }) => {
        const found = await ctx.db.eligible.findUnique({
          where: { id: input.id },
        });
        if (!found) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Eligible record not found.",
          });
        }

        if (input.nim && input.nim !== found.nim) {
          const dup =
            (await ctx.db.eligible
              .findUnique({
                where: {
                  electionId_nim: {
                    electionId: found.electionId,
                    nim: input.nim,
                  },
                },
              })
              .catch(() => null)) ??
            (await ctx.db.eligible.findFirst({
              where: { electionId: found.electionId, nim: input.nim },
            }));

          if (dup) {
            throw new TRPCError({
              code: "CONFLICT",
              message: `NIM already exists for this election: ${input.nim}`,
            });
          }
        }

        return ctx.db.eligible.update({
          where: { id: input.id },
          data: {
            ...(input.nim !== undefined ? { nim: input.nim } : {}),
            ...(input.eligible !== undefined
              ? { eligible: input.eligible }
              : {}),
          },
        });
      }),

    delete: adminProcedure
      .input(eligibleDeleteInput)
      .mutation(async ({ ctx, input }) => {
        const found = await ctx.db.eligible.findUnique({
          where: { id: input.id },
        });
        if (!found) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Eligible record not found.",
          });
        }
        return ctx.db.eligible.delete({ where: { id: input.id } });
      }),

    me: protectedProcedure.query(async ({ ctx }) => {
      const email = ctx.session.user.email;
      if (!email) return { eligible: false };

      const cfg = await getOrCreateConfig(ctx);
      if (!cfg.activeElectionId) return { eligible: false };

      const nim = email.includes("@") ? email.split("@")[0] : email;

      const row = await ctx.db.eligible.findFirst({
        where: { electionId: cfg.activeElectionId, nim, eligible: true },
        select: { id: true },
      });

      return { eligible: !!row };
    }),
  }),

  /* ----------------------------- Config ------------------------------ */
  config: createTRPCRouter({
    get: protectedProcedure.query(async ({ ctx }) => {
      const config = await ctx.db.config.upsert({
        where: { id: 1 },
        create: { ...DEFAULT_CONFIG },
        update: {},
        include: { activeElection: true },
      });

      // SECURE THE RESULTS: Strip fields from standard fetch if not authorized
      const isAdmin = ctx.session.user.role === "ADMIN";
      const now = new Date();
      const isRevealed = config.toReveal && now >= config.toReveal;

      if (!isAdmin && !isRevealed) {
        config.kahimResult = null;
        config.senatResult = null;
      }

      return config;
    }),

    // NEW ENDPOINT TO FETCH RESULTS SAFELY
    getResults: protectedProcedure.query(async ({ ctx }) => {
      const config = await ctx.db.config.findUnique({ where: { id: 1 } });
      if (!config) throw new TRPCError({ code: "NOT_FOUND" });

      const isAdmin = ctx.session.user.role === "ADMIN";
      const now = new Date();
      const isRevealed = config.toReveal && now >= config.toReveal;

      // Error boundary validating datetime limit to prevent early access
      if (!isAdmin && !isRevealed) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Belum waktunya pengumuman hasil pemilu! Sabar ya :)",
        });
      }

      return {
        kahimResult: config.kahimResult,
        senatResult: config.senatResult,
      };
    }),

    update: adminProcedure
      .input(configUpdateInput)
      .mutation(async ({ ctx, input }) => {
        return ctx.db.config.upsert({
          where: { id: 1 },
          create: { ...DEFAULT_CONFIG, ...input },
          update: { ...input },
          include: { activeElection: true },
        });
      }),

    setActiveElection: adminProcedure
      .input(configSetActiveElectionInput)
      .mutation(async ({ ctx, input }) => {
        if (input.electionId) {
          const exists = await ctx.db.election.findUnique({
            where: { id: input.electionId },
          });
          if (!exists)
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "Election not found.",
            });
        }

        return ctx.db.config.upsert({
          where: { id: 1 },
          create: { ...DEFAULT_CONFIG, activeElectionId: input.electionId },
          update: { activeElectionId: input.electionId },
          include: { activeElection: true },
        });
      }),

    setCountdown: adminProcedure
      .input(configSetCountdownInput)
      .mutation(async ({ ctx, input }) => {
        return ctx.db.config.upsert({
          where: { id: 1 },
          create: { ...DEFAULT_CONFIG, ...input },
          update: { ...input },
          include: { activeElection: true },
        });
      }),
  }),

  /* -------------------------- Calon Detail --------------------------- */
  calonDetail: createTRPCRouter({
    list: protectedProcedure
      .input(calonListInput)
      .query(async ({ ctx, input }) => {
        const where = {
          ...(input.type ? { type: input.type } : {}),
          ...(typeof input.isActive === "boolean"
            ? { isActive: input.isActive }
            : {}),
        };

        return ctx.db.calon_Detail.findMany({
          where,
          orderBy: [{ type: "asc" }, { number: "asc" }, { id: "asc" }],
        });
      }),

    get: protectedProcedure
      .input(calonGetInput)
      .query(async ({ ctx, input }) => {
        const row = await ctx.db.calon_Detail.findUnique({
          where: { id: input.id },
        });
        if (!row)
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Calon not found.",
          });
        return row;
      }),

    create: adminProcedure
      .input(calonCreateInput)
      .mutation(async ({ ctx, input }) => {
        return ctx.db.calon_Detail.create({
          data: {
            name: input.name,
            angkatan: input.angkatan,
            number: input.number,
            type: input.type,
            image: input.image ?? null,
            vision: input.vision ?? null,
            mision: input.mision ?? null,
            document: input.document ?? null,
            isActive: true,
          },
        });
      }),

    update: adminProcedure
      .input(calonUpdateInput)
      .mutation(async ({ ctx, input }) => {
        const found = await ctx.db.calon_Detail.findUnique({
          where: { id: input.id },
        });
        if (!found)
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Calon not found.",
          });

        return ctx.db.calon_Detail.update({
          where: { id: input.id },
          data: {
            ...(input.name !== undefined ? { name: input.name } : {}),
            ...(input.angkatan !== undefined
              ? { angkatan: input.angkatan }
              : {}),
            ...(input.number !== undefined ? { number: input.number } : {}),
            ...(input.type !== undefined ? { type: input.type } : {}),
            ...(input.image !== undefined
              ? { image: input.image ?? null }
              : {}),
            ...(input.vision !== undefined
              ? { vision: input.vision ?? null }
              : {}),
            ...(input.mision !== undefined
              ? { mision: input.mision ?? null }
              : {}),
            ...(input.document !== undefined
              ? { document: input.document ?? null }
              : {}),
            ...(input.isActive !== undefined
              ? { isActive: input.isActive }
              : {}),
          },
        });
      }),

    toggleActive: adminProcedure
      .input(calonToggleActiveInput)
      .mutation(async ({ ctx, input }) => {
        const found = await ctx.db.calon_Detail.findUnique({
          where: { id: input.id },
        });
        if (!found)
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Calon not found.",
          });

        return ctx.db.calon_Detail.update({
          where: { id: input.id },
          data: { isActive: input.isActive },
        });
      }),

    delete: adminProcedure
      .input(calonDeleteInput)
      .mutation(async ({ ctx, input }) => {
        const found = await ctx.db.calon_Detail.findUnique({
          where: { id: input.id },
        });
        if (!found)
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Calon not found.",
          });
        return ctx.db.calon_Detail.delete({ where: { id: input.id } });
      }),
  }),

  /* ---------------------------- Timeline ----------------------------- */
  timeline: createTRPCRouter({
    list: protectedProcedure
      .input(timelineListInput)
      .query(async ({ ctx, input }) => {
        const electionId = await requireElectionId(ctx, input.electionId);

        const where = {
          electionId,
          ...(input.search
            ? {
                title: { contains: input.search, mode: "insensitive" as const },
              }
            : {}),
        };

        return ctx.db.timeline.findMany({
          where,
          orderBy: [
            { dateFrom: "asc" },
            { dateTo: "asc" },
            { createdAt: "asc" },
          ],
        });
      }),

    create: adminProcedure
      .input(timelineCreateInput)
      .mutation(async ({ ctx, input }) => {
        const electionId = await requireElectionId(ctx, input.electionId);

        if (input.dateTo && input.dateTo < input.dateFrom) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "dateTo must be >= dateFrom.",
          });
        }

        return ctx.db.timeline.create({
          data: {
            electionId,
            title: input.title,
            dateFrom: input.dateFrom,
            dateTo: input.dateTo ?? null,
          },
        });
      }),

    update: adminProcedure
      .input(timelineUpdateInput)
      .mutation(async ({ ctx, input }) => {
        const found = await ctx.db.timeline.findUnique({
          where: { id: input.id },
        });
        if (!found) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Timeline not found.",
          });
        }

        if (input.dateFrom && input.dateTo && input.dateTo < input.dateFrom) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "dateTo must be >= dateFrom.",
          });
        }

        return ctx.db.timeline.update({
          where: { id: input.id },
          data: {
            ...(input.title !== undefined ? { title: input.title } : {}),
            ...(input.dateFrom !== undefined
              ? { dateFrom: input.dateFrom }
              : {}),
            ...(input.dateTo !== undefined
              ? { dateTo: input.dateTo ?? null }
              : {}),
          },
        });
      }),

    delete: adminProcedure
      .input(timelineDeleteInput)
      .mutation(async ({ ctx, input }) => {
        const found = await ctx.db.timeline.findUnique({
          where: { id: input.id },
        });
        if (!found) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Timeline not found.",
          });
        }
        return ctx.db.timeline.delete({ where: { id: input.id } });
      }),
  }),

  /* ---------------------------- Election ----------------------------- */
  election: createTRPCRouter({
    list: protectedProcedure
      .input(electionListInput)
      .query(async ({ ctx, input }) => {
        const where = {
          ...(typeof input.isActive === "boolean"
            ? { isActive: input.isActive }
            : {}),
        };

        return ctx.db.election.findMany({
          where,
          orderBy: { createdAt: "desc" },
          include: {
            calons: {
              include: { calon: true },
              orderBy: { calon: { number: "asc" } },
            },
          },
        });
      }),

    getActive: publicProcedure.query(async ({ ctx }) => {
      const row = await ctx.db.config.findFirst();
      if (!row)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Global config doesn't exist.",
        });

      if (!row.activeElectionId) {
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message: "No active election has been assigned in the global config.",
        });
      }

      return await ctx.db.election.findFirst({
        where: {
          id: row.activeElectionId,
          isActive: true,
        },
      });
    }),

    get: protectedProcedure
      .input(electionGetInput)
      .query(async ({ ctx, input }) => {
        const row = await ctx.db.election.findUnique({
          where: { id: input.id },
          include: {
            calons: { include: { calon: true } },
          },
        });
        if (!row)
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Election not found.",
          });
        return row;
      }),

    create: adminProcedure
      .input(electionCreateInput)
      .mutation(async ({ ctx, input }) => {
        return ctx.db.election.create({
          data: {
            name: input.name,
            isActive: input.isActive ?? false,
          },
        });
      }),

    update: adminProcedure
      .input(electionUpdateInput)
      .mutation(async ({ ctx, input }) => {
        const found = await ctx.db.election.findUnique({
          where: { id: input.id },
        });
        if (!found) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Election not found.",
          });
        }

        return ctx.db.election.update({
          where: { id: input.id },
          data: {
            ...(input.name !== undefined ? { name: input.name } : {}),
            ...(input.isActive !== undefined
              ? { isActive: input.isActive }
              : {}),
          },
        });
      }),

    delete: adminProcedure
      .input(electionDeleteInput)
      .mutation(async ({ ctx, input }) => {
        const found = await ctx.db.election.findUnique({
          where: { id: input.id },
        });
        if (!found)
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Election not found.",
          });

        const cfg = await ctx.db.config.findUnique({ where: { id: 1 } });
        if (cfg?.activeElectionId === input.id) {
          await ctx.db.config.update({
            where: { id: 1 },
            data: { activeElectionId: null },
          });
        }

        return ctx.db.election.delete({ where: { id: input.id } });
      }),

    addCalon: adminProcedure
      .input(electionCalonAddInput)
      .mutation(async ({ ctx, input }) => {
        const [election, calon] = await ctx.db.$transaction([
          ctx.db.election.findUnique({ where: { id: input.electionId } }),
          ctx.db.calon_Detail.findUnique({ where: { id: input.calonId } }),
        ]);
        if (!election)
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Election not found.",
          });
        if (!calon)
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Calon not found.",
          });

        try {
          return await ctx.db.electionCalon.create({
            data: {
              electionId: input.electionId,
              calonId: input.calonId,
              isActive: true,
            },
          });
        } catch (e: any) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "Calon already added to this election.",
          });
        }
      }),

    removeCalon: adminProcedure
      .input(electionCalonRemoveInput)
      .mutation(async ({ ctx, input }) => {
        const link = await ctx.db.electionCalon.findFirst({
          where: { electionId: input.electionId, calonId: input.calonId },
        });
        if (!link) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Calon is not in this election.",
          });
        }

        return ctx.db.electionCalon.delete({ where: { id: link.id } });
      }),

    toggleElectionCalon: adminProcedure
      .input(electionCalonToggleActiveInput)
      .mutation(async ({ ctx, input }) => {
        const found = await ctx.db.electionCalon.findUnique({
          where: { id: input.electionCalonId },
        });
        if (!found)
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "ElectionCalon not found.",
          });

        return ctx.db.electionCalon.update({
          where: { id: input.electionCalonId },
          data: { isActive: input.isActive },
        });
      }),
  }),
});
