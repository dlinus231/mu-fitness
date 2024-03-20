const fs = require("fs");
const csv = require("csv-parser");
const { PrismaClient } = require("@prisma/client");

const filePath = "exercises_final_normalized.csv";

const equipmentMap = new Map([["other", "other equipment"]]);
const tagIdMap = new Map([]);
const muscleIdMap = new Map([]);

const prisma = new PrismaClient();

// parses the embedding column into a list of floats
function parseEmbedding(embeddingString) {
    return embeddingString
        .slice(1, -1) // Remove square brackets
        .split(',')
        .map(parseFloat); // Parse each value as a float
}

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
      let equipment = row.equipment.toLowerCase() || "none";
      const muscle = row.muscle;
      const description = row.instructions || "";
      const difficulty = row.difficulty;
      const tags = [];
      const embedding = parseEmbedding(row.embedding);
      const video_path = row.video_path || ""; 
      const log_search_results = parseFloat(row.log_search_results); 

      if (equipmentMap.has(equipment)) {
        equipment = equipmentMap.get(equipment);
      }
      if (equipment != "none") {
        tags.push(tagIdMap.get(equipment));
      }
      tags.push(tagIdMap.get(type));
      const muscleId = muscleIdMap.get(muscle);

      const result = await prisma.exercise.create({
        data: {
          name,
          difficulty,
          description,
          video_path, 
          embedding, 
          log_search_results, 
          muscles: { connect: { id: muscleId } },
          tags: {
            connect: tags.map((tag) => ({
              id: tag,
            })),
          },
        },
      });
      console.log(result);
    })
    .on("end", () => {});
}

main();
