-- CreateEnum
CREATE TYPE "Role" AS ENUM ('KAHIM', 'SENAT');

-- CreateTable
CREATE TABLE "Calon_Detail" (
    "id" TEXT NOT NULL,
    "document_url" TEXT,
    "type" "Role" NOT NULL,

    CONSTRAINT "Calon_Detail_pkey" PRIMARY KEY ("id")
);
