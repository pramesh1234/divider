-- AlterTable
ALTER TABLE "Broadcast" ALTER COLUMN "b_location" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "location" DROP NOT NULL;
