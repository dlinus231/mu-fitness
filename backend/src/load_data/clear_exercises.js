//run this if you need to clear the exercises db for a variety of reasons

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  try {
    const result = await prisma.exercise.deleteMany();
    console.log("Successfully cleared exercises table");
  } catch (error) {
    console.error(error);
  }
}

main();
