const fs = require("fs");
const csv = require("csv-parser");
const { PrismaClient } = require("@prisma/client");

const filePath = "exercises.csv";

const equipmentMap = new Map([["other", "other equipment"]]);
const tagIdMap = new Map([]);
const muscleIdMap = new Map([]);

const prisma = new PrismaClient();

async function main() {
  try {
    const result = await prisma.muscle.findMany();

    result.forEach((muscle) => {
      muscleIdMap.set(muscle.name, muscle.id);
    });
  } catch (error) {
    console.error(error);
    return;
  }

  try {
    const result = await prisma.tag.findMany();

    result.forEach((tag) => {
      tagIdMap.set(tag.name, tag.id);
    });
  } catch (error) {
    console.error(error);
    return;
  }

  fs.createReadStream(filePath)
    .pipe(csv())
    .on("data", async (row) => {
      const name = row.name.toLowerCase();
      const type = row.type;
      let equipment = row.equipment.toLowerCase();
      const muscle = row.muscle;
      const description = row.instructions;
      const difficulty = row.difficulty;
      const tags = [];
      if (equipmentMap.has(equipment)) {
        equipment = equipmentMap.get(equipment);
      }
      if (equipment != "none") {
        tags.push(tagIdMap.get(equipment));
      }
      tags.push(tagIdMap.get(type));
      const muscleId = muscleIdMap.get(muscle);
      const data = {
        name,
        muscleId,
        description,
        tags,
      };
      const result = await prisma.exercise.create({
        data: {
          name,
          difficulty,
          description,
          muscles: { connect: { id: muscleId } },
          tags: {
            connect: tags.map((tag) => ({
              id: tag,
            })),
          },
          video_path: "",
        },
      });
      console.log(result);
    })
    .on("end", () => {});
}

main();
