/*
  Warnings:

  - The primary key for the `Calon_Detail` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Calon_Detail` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Calon_Detail" DROP CONSTRAINT "Calon_Detail_pkey",
ADD COLUMN     "number" INTEGER NOT NULL DEFAULT 0,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Calon_Detail_pkey" PRIMARY KEY ("id");
