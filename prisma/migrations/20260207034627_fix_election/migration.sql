/*
  Warnings:

  - You are about to drop the column `endsAt` on the `Election` table. All the data in the column will be lost.
  - You are about to drop the column `startsAt` on the `Election` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Election` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Election_type_idx";

-- AlterTable
ALTER TABLE "Election" DROP COLUMN "endsAt",
DROP COLUMN "startsAt",
DROP COLUMN "type";
