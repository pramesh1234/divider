/*
  Warnings:

  - You are about to drop the column `isCheckedIn` on the `CheckIn` table. All the data in the column will be lost.
  - Added the required column `is_checked_in` to the `CheckIn` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CheckIn" DROP COLUMN "isCheckedIn",
ADD COLUMN     "is_checked_in" BOOLEAN NOT NULL;
