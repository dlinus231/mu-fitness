//clears body parts and muscle groups

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  try {
    const result = await prisma.bodyPart.deleteMany();
    // console.log(await prisma.muscle.findMany());
    console.log("Body parts and muscle groups deleted");
  } catch (error) {
    console.error(error);
  }
}

main();
