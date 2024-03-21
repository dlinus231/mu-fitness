/*
  Warnings:

  - Added the required column `equipment` to the `Exercise` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Exercise` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Exercise" ADD COLUMN     "equipment" TEXT NOT NULL,
ADD COLUMN     "type" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "_ExerciseToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ExerciseToUser_AB_unique" ON "_ExerciseToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_ExerciseToUser_B_index" ON "_ExerciseToUser"("B");

-- AddForeignKey
ALTER TABLE "_ExerciseToUser" ADD CONSTRAINT "_ExerciseToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Exercise"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ExerciseToUser" ADD CONSTRAINT "_ExerciseToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
