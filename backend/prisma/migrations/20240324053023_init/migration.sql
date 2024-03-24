/*
  Warnings:

  - You are about to drop the `DurationSet` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "DurationSet" DROP CONSTRAINT "DurationSet_default_set_id_fkey";

-- AlterTable
ALTER TABLE "DefaultSet" ALTER COLUMN "repetitions" SET DEFAULT 8,
ALTER COLUMN "weight_lbs" SET DEFAULT 45;

-- AlterTable
ALTER TABLE "Routine" ALTER COLUMN "rest" SET DEFAULT 60;

-- DropTable
DROP TABLE "DurationSet";
