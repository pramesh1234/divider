/*
  Warnings:

  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - Added the required column `d_count` to the `Broadcast` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tag` to the `Broadcast` table without a default value. This is not possible if the table is not empty.
  - Added the required column `viewed_count` to the `Broadcast` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Broadcast" ADD COLUMN     "d_count" INTEGER NOT NULL,
ADD COLUMN     "tag" TEXT NOT NULL,
ADD COLUMN     "viewed_count" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "name",
ADD COLUMN     "first_name" TEXT,
ADD COLUMN     "last_name" TEXT,
ADD COLUMN     "user_name" TEXT;
