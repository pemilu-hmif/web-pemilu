/*
  Warnings:

  - A unique constraint covering the columns `[electionId,nim]` on the table `Eligible` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `electionId` to the `Eligible` table without a default value. This is not possible if the table is not empty.
  - Added the required column `electionId` to the `Timeline` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Eligible" ADD COLUMN     "electionId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Timeline" ADD COLUMN     "electionId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "ElectionCalon_calonId_idx" ON "ElectionCalon"("calonId");

-- CreateIndex
CREATE INDEX "Eligible_electionId_idx" ON "Eligible"("electionId");

-- CreateIndex
CREATE INDEX "Eligible_nim_idx" ON "Eligible"("nim");

-- CreateIndex
CREATE UNIQUE INDEX "Eligible_electionId_nim_key" ON "Eligible"("electionId", "nim");

-- CreateIndex
CREATE INDEX "Timeline_electionId_idx" ON "Timeline"("electionId");

-- CreateIndex
CREATE INDEX "Vote_electionId_idx" ON "Vote"("electionId");

-- AddForeignKey
ALTER TABLE "Eligible" ADD CONSTRAINT "Eligible_electionId_fkey" FOREIGN KEY ("electionId") REFERENCES "Election"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Timeline" ADD CONSTRAINT "Timeline_electionId_fkey" FOREIGN KEY ("electionId") REFERENCES "Election"("id") ON DELETE CASCADE ON UPDATE CASCADE;
