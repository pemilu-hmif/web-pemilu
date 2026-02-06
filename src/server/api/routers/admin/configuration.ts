import { z } from "zod";
import { TRPCError } from "@trpc/server";
import {
  createTRPCRouter,
  adminProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import { CalonType } from "@prisma/client";

const DEFAULT_CONFIG = {
  id: 1,
  timeline: false,
  calon: false,
  coblos: false,
  peraturan: false,
} as const;

const eligibleListInput = z.object({
  page: z.number().int().min(0).default(0),
  pageSize: z.number().int().min(1).max(200).default(20),
  search: z.string().trim().max(64).optional(), // search by nim
  eligible: z.boolean().optional(), // filter
});

const eligibleCreateInput = z.object({
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

const configUpdateInput = z.object({
  timeline: z.boolean().optional(),
  calon: z.boolean().optional(),
  coblos: z.boolean().optional(),
  peraturan: z.boolean().optional(),
});

const calonListInput = z.object({
  type: z.nativeEnum(CalonType).optional(),
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
});

const calonDeleteInput = z.object({
  id: z.number().int().positive(),
});

export const adminConfigurationRouter = createTRPCRouter({
  eligible: createTRPCRouter({
    list: protectedProcedure
      .input(eligibleListInput)
      .query(async ({ ctx, input }) => {
        const { page, pageSize, search, eligible } = input;

        const where = {
          ...(typeof eligible === "boolean" ? { eligible } : {}),
          ...(search
            ? {
                nim: {
                  contains: search,
                  mode: "insensitive" as const,
                },
              }
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
        const exists = await ctx.db.eligible.findFirst({
          where: { nim: input.nim },
        });
        if (exists) {
          throw new TRPCError({
            code: "CONFLICT",
            message: `NIM already exists in Eligible: ${input.nim}`,
          });
        }

        return ctx.db.eligible.create({
          data: {
            nim: input.nim,
            eligible: input.eligible,
          },
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
          const dup = await ctx.db.eligible.findFirst({
            where: { nim: input.nim },
          });
          if (dup) {
            throw new TRPCError({
              code: "CONFLICT",
              message: `NIM already exists in Eligible: ${input.nim}`,
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
      const nim = ctx.session.user.email.split("@")[0];

      const row = await ctx.db.eligible.findFirst({
        where: {
          nim,
          eligible: true,
        },
      });

      return {
        eligible: !!row,
      };
    }),
  }),

  config: createTRPCRouter({
    get: protectedProcedure.query(async ({ ctx }) => {
      // Ensure singleton exists
      return ctx.db.config.upsert({
        where: { id: 1 },
        create: { ...DEFAULT_CONFIG },
        update: {},
      });
    }),

    update: adminProcedure
      .input(configUpdateInput)
      .mutation(async ({ ctx, input }) => {
        return ctx.db.config.upsert({
          where: { id: 1 },
          create: {
            ...DEFAULT_CONFIG,
            ...input,
          },
          update: {
            ...input,
          },
        });
      }),
  }),

  calonDetail: createTRPCRouter({
    list: protectedProcedure
      .input(calonListInput)
      .query(async ({ ctx, input }) => {
        return ctx.db.calon_Detail.findMany({
          where: input.type ? { type: input.type } : undefined,
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
            message: "Calon detail not found.",
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
          },
        });
      }),

    update: adminProcedure
      .input(calonUpdateInput)
      .mutation(async ({ ctx, input }) => {
        const found = await ctx.db.calon_Detail.findUnique({
          where: { id: input.id },
        });

        if (!found) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Calon not found.",
          });
        }

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
          },
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
            message: "Calon detail not found.",
          });
        return ctx.db.calon_Detail.delete({ where: { id: input.id } });
      }),
  }),
});
