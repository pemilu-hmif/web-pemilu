/*
  Warnings:

  - You are about to drop the column `calonId` on the `Vote` table. All the data in the column will be lost.
  - Added the required column `kahimId` to the `Vote` table without a default value. This is not possible if the table is not empty.
  - Added the required column `senatId` to the `Vote` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Vote" DROP CONSTRAINT "Vote_calonId_fkey";

-- DropIndex
DROP INDEX "Vote_calonId_idx";

-- DropIndex
DROP INDEX "Vote_electionId_idx";

-- AlterTable
ALTER TABLE "Vote" DROP COLUMN "calonId",
ADD COLUMN     "kahimId" INTEGER NOT NULL,
ADD COLUMN     "senatId" INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX "Vote_kahimId_idx" ON "Vote"("kahimId");

-- CreateIndex
CREATE INDEX "Vote_senatId_idx" ON "Vote"("senatId");

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_kahimId_fkey" FOREIGN KEY ("kahimId") REFERENCES "Calon_Detail"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_senatId_fkey" FOREIGN KEY ("senatId") REFERENCES "Calon_Detail"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
