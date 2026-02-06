/*
  Warnings:

  - You are about to drop the column `document_url` on the `Calon_Detail` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `kahim_email` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `senat_email` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Session` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `VerificationToken` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `nim` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `voted` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_createdById_fkey";

-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_userId_fkey";

-- AlterTable
ALTER TABLE "Calon_Detail" DROP COLUMN "document_url",
ADD COLUMN     "document" TEXT,
ADD COLUMN     "image" TEXT,
ADD COLUMN     "mision" TEXT,
ADD COLUMN     "vision" TEXT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "image",
DROP COLUMN "kahim_email",
DROP COLUMN "senat_email",
ADD COLUMN     "nim" TEXT NOT NULL,
ADD COLUMN     "voted" BOOLEAN NOT NULL;

-- DropTable
DROP TABLE "Post";

-- DropTable
DROP TABLE "Session";

-- DropTable
DROP TABLE "VerificationToken";

-- CreateTable
CREATE TABLE "Eligible" (
    "id" SERIAL NOT NULL,
    "nim" TEXT NOT NULL,
    "eligible" BOOLEAN NOT NULL,

    CONSTRAINT "Eligible_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Config" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "timeline" BOOLEAN NOT NULL,
    "calon" BOOLEAN NOT NULL,
    "coblos" BOOLEAN NOT NULL,
    "peraturan" BOOLEAN NOT NULL,

    CONSTRAINT "Config_pkey" PRIMARY KEY ("id")
);
