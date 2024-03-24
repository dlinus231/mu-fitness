/*
  Warnings:

  - You are about to drop the column `repetitions` on the `Routine` table. All the data in the column will be lost.
  - You are about to drop the column `weight_lbs` on the `Routine` table. All the data in the column will be lost.
  - You are about to drop the `_MuscleToWorkout` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "RoutineType" AS ENUM ('default', 'duration');

-- DropForeignKey
ALTER TABLE "_MuscleToWorkout" DROP CONSTRAINT "_MuscleToWorkout_A_fkey";

-- DropForeignKey
ALTER TABLE "_MuscleToWorkout" DROP CONSTRAINT "_MuscleToWorkout_B_fkey";

-- AlterTable
ALTER TABLE "Routine" DROP COLUMN "repetitions",
DROP COLUMN "weight_lbs";

-- DropTable
DROP TABLE "_MuscleToWorkout";

-- CreateTable
CREATE TABLE "DefaultSet" (
    "id" SERIAL NOT NULL,
    "repetitions" INTEGER NOT NULL,
    "weight_lbs" INTEGER NOT NULL,
    "routine_id" INTEGER NOT NULL,

    CONSTRAINT "DefaultSet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DurationSet" (
    "id" SERIAL NOT NULL,
    "duration" INTEGER NOT NULL,
    "default_set_id" INTEGER NOT NULL,

    CONSTRAINT "DurationSet_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DurationSet_default_set_id_key" ON "DurationSet"("default_set_id");

-- AddForeignKey
ALTER TABLE "DefaultSet" ADD CONSTRAINT "DefaultSet_routine_id_fkey" FOREIGN KEY ("routine_id") REFERENCES "Routine"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DurationSet" ADD CONSTRAINT "DurationSet_default_set_id_fkey" FOREIGN KEY ("default_set_id") REFERENCES "DefaultSet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
