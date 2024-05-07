/*
  Warnings:

  - You are about to drop the column `brocastedTime` on the `Circle` table. All the data in the column will be lost.
  - You are about to drop the column `isExpired` on the `Circle` table. All the data in the column will be lost.
  - Added the required column `created_at` to the `Circle` table without a default value. This is not possible if the table is not empty.
  - Added the required column `is_expired` to the `Circle` table without a default value. This is not possible if the table is not empty.
  - Added the required column `created_at` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Circle" DROP COLUMN "brocastedTime",
DROP COLUMN "isExpired",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "is_expired" BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL;
