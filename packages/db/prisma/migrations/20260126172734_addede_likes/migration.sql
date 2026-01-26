/*
  Warnings:

  - You are about to drop the column `description` on the `Image` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Image" DROP COLUMN "description",
ADD COLUMN     "like" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "prompt" TEXT;
