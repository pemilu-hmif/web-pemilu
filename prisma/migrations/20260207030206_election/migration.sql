-- AlterTable
ALTER TABLE "Calon_Detail" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Config" ADD COLUMN     "activeElectionId" TEXT;

-- CreateTable
CREATE TABLE "Timeline" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "dateFrom" DATE NOT NULL,
    "dateTo" DATE,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Timeline_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Election" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "CalonType" NOT NULL,
    "startsAt" DATE NOT NULL,
    "endsAt" DATE NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Election_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ElectionCalon" (
    "id" TEXT NOT NULL,
    "electionId" TEXT NOT NULL,
    "calonId" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "ElectionCalon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vote" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "electionId" TEXT NOT NULL,
    "calonId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Vote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Timeline_dateFrom_idx" ON "Timeline"("dateFrom");

-- CreateIndex
CREATE INDEX "Timeline_dateTo_idx" ON "Timeline"("dateTo");

-- CreateIndex
CREATE INDEX "Election_type_idx" ON "Election"("type");

-- CreateIndex
CREATE INDEX "ElectionCalon_electionId_idx" ON "ElectionCalon"("electionId");

-- CreateIndex
CREATE UNIQUE INDEX "ElectionCalon_electionId_calonId_key" ON "ElectionCalon"("electionId", "calonId");

-- CreateIndex
CREATE INDEX "Vote_calonId_idx" ON "Vote"("calonId");

-- CreateIndex
CREATE UNIQUE INDEX "Vote_userId_electionId_key" ON "Vote"("userId", "electionId");

-- CreateIndex
CREATE INDEX "Calon_Detail_type_idx" ON "Calon_Detail"("type");

-- AddForeignKey
ALTER TABLE "Config" ADD CONSTRAINT "Config_activeElectionId_fkey" FOREIGN KEY ("activeElectionId") REFERENCES "Election"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ElectionCalon" ADD CONSTRAINT "ElectionCalon_electionId_fkey" FOREIGN KEY ("electionId") REFERENCES "Election"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ElectionCalon" ADD CONSTRAINT "ElectionCalon_calonId_fkey" FOREIGN KEY ("calonId") REFERENCES "Calon_Detail"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_electionId_fkey" FOREIGN KEY ("electionId") REFERENCES "Election"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_calonId_fkey" FOREIGN KEY ("calonId") REFERENCES "Calon_Detail"("id") ON DELETE CASCADE ON UPDATE CASCADE;
