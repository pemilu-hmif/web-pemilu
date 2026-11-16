// Fake data for local development: a dev admin, one active election, candidates and a timeline.
// Idempotent: running it again resets these rows and leaves every other row alone.
// Run: npm run db:seed   (local database only)
import "dotenv/config";
import bcrypt from "bcrypt";
import { PrismaPg } from "@prisma/adapter-pg";
import { CalonType, PrismaClient, Role } from "../generated/prisma";

const url = process.env.DATABASE_URL ?? "";
if (!/@(127\.0\.0\.1|localhost)(:\d+)?\//.test(url)) {
  console.error("Refusing to seed: DATABASE_URL is not a local database.");
  process.exit(1);
}

const adminId = process.env.SEED_ADMIN_ID ?? "admin";
const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? "admin-dev-only";
// Optional: your own NIM, so you can vote locally with your ITB Google account.
const voterNim = process.env.SEED_VOTER_NIM;

const db = new PrismaClient({ adapter: new PrismaPg({ connectionString: url }) });

// The admin API validates election IDs as cuid, so the fixed ID must look like one.
const ELECTION_ID = "cseedelection000000000001";
const DAY = 24 * 60 * 60 * 1000;

const calons = [
  { id: 9001, name: "Calon Kahim Satu", number: 1, type: CalonType.KAHIM },
  { id: 9002, name: "Calon Kahim Dua", number: 2, type: CalonType.KAHIM },
  { id: 9003, name: "Calon Senator Satu", number: 1, type: CalonType.SENAT },
  { id: 9004, name: "Calon Senator Dua", number: 2, type: CalonType.SENAT },
];

async function main() {
  await db.user.upsert({
    where: { id: adminId },
    update: { role: Role.ADMIN, passwordHash: await bcrypt.hash(adminPassword, 10) },
    create: {
      id: adminId,
      name: "Dev Admin",
      role: Role.ADMIN,
      passwordHash: await bcrypt.hash(adminPassword, 10),
    },
  });

  await db.election.upsert({
    where: { id: ELECTION_ID },
    update: { name: "Pemilu HMIF", isActive: true },
    create: { id: ELECTION_ID, name: "Pemilu HMIF", isActive: true },
  });

  for (const c of calons) {
    const data = {
      name: c.name,
      angkatan: "2023",
      number: c.number,
      image: "/placeholder/image.png",
      vision: `Visi ${c.name}.`,
      mision: `Misi pertama ${c.name}.\nMisi kedua ${c.name}.`,
      type: c.type,
    };
    await db.calon_Detail.upsert({ where: { id: c.id }, update: data, create: { id: c.id, ...data } });
    await db.electionCalon.upsert({
      where: { electionId_calonId: { electionId: ELECTION_ID, calonId: c.id } },
      update: { isActive: true },
      create: { electionId: ELECTION_ID, calonId: c.id },
    });
  }

  const now = Date.now();
  await db.timeline.deleteMany({ where: { electionId: ELECTION_ID } });
  await db.timeline.createMany({
    data: [
      { electionId: ELECTION_ID, title: "Pendaftaran calon", dateFrom: new Date(now - 14 * DAY), dateTo: new Date(now - 7 * DAY) },
      { electionId: ELECTION_ID, title: "Kampanye", dateFrom: new Date(now - 6 * DAY), dateTo: new Date(now - 1 * DAY) },
      { electionId: ELECTION_ID, title: "Pemilihan", dateFrom: new Date(now), dateTo: new Date(now + 2 * DAY) },
      { electionId: ELECTION_ID, title: "Pengumuman", dateFrom: new Date(now + 5 * DAY) },
    ],
  });

  // Every page visible and voting open now, results revealed in 5 days.
  const config = {
    timeline: true,
    calon: true,
    coblos: true,
    peraturan: true,
    countdown: true,
    toStart: new Date(now - DAY),
    toEnd: new Date(now + 2 * DAY),
    toReveal: new Date(now + 5 * DAY),
    activeElectionId: ELECTION_ID,
  };
  await db.config.upsert({ where: { id: 1 }, update: config, create: { id: 1, ...config } });

  if (voterNim) {
    await db.eligible.upsert({
      where: { electionId_nim: { electionId: ELECTION_ID, nim: voterNim } },
      update: { eligible: true },
      create: { electionId: ELECTION_ID, nim: voterNim, eligible: true },
    });
  }

  console.log(`Seeded. Admin login at /admin-login: ID "${adminId}", password from SEED_ADMIN_PASSWORD.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
