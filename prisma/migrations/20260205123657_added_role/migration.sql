/*
  Warnings:

  - The values [KAHIM,SENAT] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.
  - Changed the type of `type` on the `Calon_Detail` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `role` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- 1. Drop everything related to the old types to start fresh
DROP TYPE IF EXISTS "Role" CASCADE;
DROP TYPE IF EXISTS "CalonType" CASCADE;

-- 2. Create the new Enums
CREATE TYPE "Role" AS ENUM ('ADMIN', 'USER');
CREATE TYPE "CalonType" AS ENUM ('KAHIM', 'SENAT');

-- 3. Fix the User Table
-- We drop the old column first to avoid the "already exists" error
ALTER TABLE "User" DROP COLUMN IF EXISTS "role";
ALTER TABLE "User" ADD COLUMN "role" "Role" NOT NULL DEFAULT 'USER';
ALTER TABLE "User" ADD COLUMN "passwordHash" TEXT;

-- 4. Fix the Calon_Detail Table
ALTER TABLE "Calon_Detail" DROP COLUMN IF EXISTS "type";
ALTER TABLE "Calon_Detail" ADD COLUMN "type" "CalonType" NOT NULL;
