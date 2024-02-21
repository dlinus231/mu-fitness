/*
  Warnings:

  - Added the required column `weight_lbs` to the `Routine` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Routine" ADD COLUMN     "weight_lbs" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "last_login" DROP DEFAULT;

-- CreateTable
CREATE TABLE "Muscle" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "bodyPart_id" INTEGER NOT NULL,

    CONSTRAINT "Muscle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BodyPart" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,

    CONSTRAINT "BodyPart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ExerciseToMuscle" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_TagToWorkout" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_MuscleToWorkout" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ExerciseToMuscle_AB_unique" ON "_ExerciseToMuscle"("A", "B");

-- CreateIndex
CREATE INDEX "_ExerciseToMuscle_B_index" ON "_ExerciseToMuscle"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_TagToWorkout_AB_unique" ON "_TagToWorkout"("A", "B");

-- CreateIndex
CREATE INDEX "_TagToWorkout_B_index" ON "_TagToWorkout"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_MuscleToWorkout_AB_unique" ON "_MuscleToWorkout"("A", "B");

-- CreateIndex
CREATE INDEX "_MuscleToWorkout_B_index" ON "_MuscleToWorkout"("B");

-- AddForeignKey
ALTER TABLE "Muscle" ADD CONSTRAINT "Muscle_bodyPart_id_fkey" FOREIGN KEY ("bodyPart_id") REFERENCES "BodyPart"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ExerciseToMuscle" ADD CONSTRAINT "_ExerciseToMuscle_A_fkey" FOREIGN KEY ("A") REFERENCES "Exercise"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ExerciseToMuscle" ADD CONSTRAINT "_ExerciseToMuscle_B_fkey" FOREIGN KEY ("B") REFERENCES "Muscle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TagToWorkout" ADD CONSTRAINT "_TagToWorkout_A_fkey" FOREIGN KEY ("A") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TagToWorkout" ADD CONSTRAINT "_TagToWorkout_B_fkey" FOREIGN KEY ("B") REFERENCES "Workout"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MuscleToWorkout" ADD CONSTRAINT "_MuscleToWorkout_A_fkey" FOREIGN KEY ("A") REFERENCES "Muscle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MuscleToWorkout" ADD CONSTRAINT "_MuscleToWorkout_B_fkey" FOREIGN KEY ("B") REFERENCES "Workout"("id") ON DELETE CASCADE ON UPDATE CASCADE;
