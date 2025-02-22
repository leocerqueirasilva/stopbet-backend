/*
  Warnings:

  - You are about to drop the column `progress` on the `achievements` table. All the data in the column will be lost.
  - Added the required column `days` to the `achievements` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `achievements` table without a default value. This is not possible if the table is not empty.
  - Added the required column `icon` to the `achievements` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `achievements` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "achievements" DROP COLUMN "progress",
ADD COLUMN     "days" INTEGER NOT NULL,
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "icon" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL;
