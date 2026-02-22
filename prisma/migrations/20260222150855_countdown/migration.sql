-- AlterTable
ALTER TABLE "Config" ADD COLUMN     "countdown" BOOLEAN,
ADD COLUMN     "toEnd" TIMESTAMP(3),
ADD COLUMN     "toStart" TIMESTAMP(3);
