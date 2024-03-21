-- DropForeignKey
ALTER TABLE "Muscle" DROP CONSTRAINT "Muscle_bodyPart_id_fkey";

-- AddForeignKey
ALTER TABLE "Muscle" ADD CONSTRAINT "Muscle_bodyPart_id_fkey" FOREIGN KEY ("bodyPart_id") REFERENCES "BodyPart"("id") ON DELETE CASCADE ON UPDATE CASCADE;
