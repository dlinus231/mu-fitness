-- DropForeignKey
ALTER TABLE "Routine" DROP CONSTRAINT "Routine_workout_id_fkey";

-- AddForeignKey
ALTER TABLE "Routine" ADD CONSTRAINT "Routine_workout_id_fkey" FOREIGN KEY ("workout_id") REFERENCES "Workout"("id") ON DELETE CASCADE ON UPDATE CASCADE;
