-- DropForeignKey
ALTER TABLE "Vote" DROP CONSTRAINT "Vote_kahimId_fkey";

-- DropForeignKey
ALTER TABLE "Vote" DROP CONSTRAINT "Vote_senatId_fkey";

-- AlterTable
ALTER TABLE "Vote" ALTER COLUMN "kahimId" DROP NOT NULL,
ALTER COLUMN "senatId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_kahimId_fkey" FOREIGN KEY ("kahimId") REFERENCES "Calon_Detail"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_senatId_fkey" FOREIGN KEY ("senatId") REFERENCES "Calon_Detail"("id") ON DELETE SET NULL ON UPDATE CASCADE;
