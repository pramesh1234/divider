/*
  Warnings:

  - The primary key for the `Broadcast` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `broadcastId` on the `Broadcast` table. All the data in the column will be lost.
  - You are about to drop the column `latitude` on the `Broadcast` table. All the data in the column will be lost.
  - You are about to drop the column `longitude` on the `Broadcast` table. All the data in the column will be lost.
  - You are about to drop the column `senderUid` on the `Broadcast` table. All the data in the column will be lost.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `countryCode` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `latitude` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `longitude` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `phoneNumber` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[phone_number]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `b_location` to the `Broadcast` table without a default value. This is not possible if the table is not empty.
  - The required column `broadcast_id` was added to the `Broadcast` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `sender_id` to the `Broadcast` table without a default value. This is not possible if the table is not empty.
  - Added the required column `location` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone_number` to the `User` table without a default value. This is not possible if the table is not empty.
  - The required column `user_id` was added to the `User` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropIndex
DROP INDEX "User_phoneNumber_key";

-- AlterTable
ALTER TABLE "Broadcast" DROP CONSTRAINT "Broadcast_pkey",
DROP COLUMN "broadcastId",
DROP COLUMN "latitude",
DROP COLUMN "longitude",
DROP COLUMN "senderUid",
ADD COLUMN     "b_location" point NOT NULL,
ADD COLUMN     "broadcast_id" UUID NOT NULL,
ADD COLUMN     "sender_id" TEXT NOT NULL,
ADD CONSTRAINT "Broadcast_pkey" PRIMARY KEY ("broadcast_id");

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "countryCode",
DROP COLUMN "latitude",
DROP COLUMN "longitude",
DROP COLUMN "phoneNumber",
DROP COLUMN "userId",
ADD COLUMN     "country_code" TEXT,
ADD COLUMN     "location" point NOT NULL,
ADD COLUMN     "phone_number" TEXT NOT NULL,
ADD COLUMN     "user_id" UUID NOT NULL,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_number_key" ON "User"("phone_number");
