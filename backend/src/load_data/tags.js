const fs = require("fs");
const csv = require("csv-parser");
const { PrismaClient } = require("@prisma/client");

const filePath = "exercises.csv";

const distinctTags = [];
const equipmentMap = new Map([["other", "other equipment"]]);

const prisma = new PrismaClient();

async function main() {
  fs.createReadStream(filePath)
    .pipe(csv())
    .on("data", (row) => {
      const type = row.type.toLowerCase();
      const equipment = row.equipment.toLowerCase();
      if (!distinctTags.includes(type)) {
        distinctTags.push(type);
      }
      if (!distinctTags.includes(equipment)) {
        distinctTags.push(equipment);
      }
    })
    .on("end", () => {
      distinctTags.forEach(async (name) => {
        if (name == "none") {
          return;
        }
        if (equipmentMap.has(name)) {
          name = equipmentMap.get(name);
        }
        const result = await prisma.tag.create({
          data: {
            name,
          },
        });
        console.log(result);
      });
    });
}

main();
