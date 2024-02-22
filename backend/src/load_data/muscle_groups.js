const fs = require("fs");
const csv = require("csv-parser");
const { PrismaClient } = require("@prisma/client");

const filePath = "exercises.csv";

const distinctMuscles = [];
const bodyParts = ["core", "legs", "arms", "chest", "back", "neck"];
const muscleBodyPartMap = new Map([
  ["abdominals", "core"],
  ["abductors", "legs"],
  ["adductors", "legs"],
  ["biceps", "arms"],
  ["calves", "legs"],
  ["chest", "chest"],
  ["forearms", "arms"],
  ["glutes", "legs"],
  ["hamstrings", "legs"],
  ["lats", "back"],
  ["lower_back", "back"],
  ["middle_back", "back"],
  ["neck", "neck"],
  ["quadriceps", "legs"],
  ["traps", "back"],
  ["triceps", "arms"],
]);
const bodyPartIdMap = new Map([]);

const prisma = new PrismaClient();

async function main() {
  try {
    bodyParts.forEach(async (name) => {
      const result = await prisma.bodyPart.create({ data: { name } });
      console.log(result);
    });
  } catch (error) {
    console.error(error);
    return;
  }

  try {
    const result = await prisma.bodyPart.findMany();

    result.forEach((bodyPart) => {
      bodyPartIdMap.set(bodyPart.name, bodyPart.id);
    });
  } catch (error) {
    console.error(error);
    return;
  }

  fs.createReadStream(filePath)
    .pipe(csv())
    .on("data", (row) => {
      const muscle = row.muscle;
      if (!distinctMuscles.includes(muscle)) {
        distinctMuscles.push(muscle);
      }
    })
    .on("end", () => {
      try {
        distinctMuscles.forEach(async (name) => {
          const bodyPart = muscleBodyPartMap.get(name);
          const bodyPartId = bodyPartIdMap.get(bodyPart);
          const result = await prisma.muscle.create({
            data: { name, bodyPart_id: bodyPartId },
          });
          console.log(result);
        });
      } catch (error) {
        console.error(error);
      }
    });
}

main();
