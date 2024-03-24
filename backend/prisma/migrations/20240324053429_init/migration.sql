-- DropForeignKey
ALTER TABLE "DefaultSet" DROP CONSTRAINT "DefaultSet_routine_id_fkey";

-- AddForeignKey
ALTER TABLE "DefaultSet" ADD CONSTRAINT "DefaultSet_routine_id_fkey" FOREIGN KEY ("routine_id") REFERENCES "Routine"("id") ON DELETE CASCADE ON UPDATE CASCADE;
