/*
  Warnings:

  - You are about to drop the column `kahim_id` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `senat_id` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "kahim_id",
DROP COLUMN "senat_id",
ADD COLUMN     "kahim_email" TEXT,
ADD COLUMN     "senat_email" TEXT;
