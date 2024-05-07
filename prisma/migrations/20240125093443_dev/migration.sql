/*
  Warnings:

  - You are about to drop the column `countryCode` on the `Broadcast` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Broadcast` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Broadcast" DROP COLUMN "countryCode",
DROP COLUMN "name";
