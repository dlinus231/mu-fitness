/*
  Warnings:

  - You are about to drop the `_ExerciseToUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_ExerciseToUser" DROP CONSTRAINT "_ExerciseToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_ExerciseToUser" DROP CONSTRAINT "_ExerciseToUser_B_fkey";

-- DropTable
DROP TABLE "_ExerciseToUser";

-- CreateTable
CREATE TABLE "UserSavedExercises" (
    "userId" INTEGER NOT NULL,
    "exerciseId" INTEGER NOT NULL,
    "saved" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserSavedExercises_pkey" PRIMARY KEY ("userId","exerciseId")
);

-- AddForeignKey
ALTER TABLE "UserSavedExercises" ADD CONSTRAINT "UserSavedExercises_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSavedExercises" ADD CONSTRAINT "UserSavedExercises_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "Exercise"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
