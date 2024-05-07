/*
  Warnings:

  - The primary key for the `Broadcast` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[broadcast_id]` on the table `Broadcast` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `created_at` to the `Broadcast` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Broadcast" DROP CONSTRAINT "Broadcast_pkey",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "broadcast_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Broadcast_pkey" PRIMARY KEY ("broadcast_id");

-- CreateTable
CREATE TABLE "Circle" (
    "circle_id" TEXT NOT NULL,
    "broadcast_id" TEXT NOT NULL,
    "receiver_id" TEXT NOT NULL,
    "isExpired" BOOLEAN NOT NULL,
    "brocastedTime" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Circle_pkey" PRIMARY KEY ("circle_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Circle_circle_id_key" ON "Circle"("circle_id");

-- CreateIndex
CREATE UNIQUE INDEX "Broadcast_broadcast_id_key" ON "Broadcast"("broadcast_id");
