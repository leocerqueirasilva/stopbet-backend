/*
  Warnings:

  - You are about to drop the column `mood` on the `diary_entries` table. All the data in the column will be lost.
  - You are about to drop the column `triggers` on the `diary_entries` table. All the data in the column will be lost.
  - Added the required column `status` to the `diary_entries` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "diary_entries" DROP COLUMN "mood",
DROP COLUMN "triggers",
ADD COLUMN     "status" TEXT NOT NULL;
