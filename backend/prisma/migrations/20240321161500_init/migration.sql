-- DropForeignKey
ALTER TABLE "UserSavedExercises" DROP CONSTRAINT "UserSavedExercises_exerciseId_fkey";

-- DropForeignKey
ALTER TABLE "UserSavedExercises" DROP CONSTRAINT "UserSavedExercises_userId_fkey";

-- AddForeignKey
ALTER TABLE "UserSavedExercises" ADD CONSTRAINT "UserSavedExercises_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSavedExercises" ADD CONSTRAINT "UserSavedExercises_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "Exercise"("id") ON DELETE CASCADE ON UPDATE CASCADE;
