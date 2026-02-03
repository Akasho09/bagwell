-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('Male', 'Female', 'Unisex');

-- AlterTable
ALTER TABLE "Image" ADD COLUMN     "gender" "Gender" NOT NULL DEFAULT 'Male';
