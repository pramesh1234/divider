-- AlterTable
ALTER TABLE "Broadcast" ADD COLUMN     "image" TEXT,
ALTER COLUMN "text" DROP NOT NULL;

-- CreateTable
CREATE TABLE "CheckIn" (
    "id" TEXT NOT NULL,
    "broadcast_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "isCheckedIn" BOOLEAN NOT NULL,
    "checkin_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CheckIn_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CheckIn_id_key" ON "CheckIn"("id");
