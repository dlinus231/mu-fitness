import { Prisma, PrismaClient } from "@prisma/client";
import express from "express";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();
const app = express();

app.use(express.json());

const server = app.listen(3000, () =>
  console.log(`
🚀 Server ready at: http://localhost:3000
⭐️ See sample requests: http://pris.ly/e/ts/rest-express#3-using-the-rest-api`)
);

app.post(`/user/create`, async (req, res) => {
  const { username, email, password } = req.body;
  const password_hashed = await hashPassword(password);
  try {
    const result = await prisma.user.create({
      data: {
        email,
        username,
        password_hashed,
        last_login: new Date().toISOString(),
      },
    });
    res.sendStatus(201);
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      console.error(e);
      res.sendStatus(409);
    } else {
      res.sendStatus(400);
    }
  }
});

app.post(`/user/login`, async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await prisma.user.findUnique({
      where: { email: email },
    });
    if (result == null) {
      res.sendStatus(401);
    } else {
      if (await comparePasswords(password, result.password_hashed)) {
        res.sendStatus(200);
      } else {
        res.sendStatus(401);
      }
    }
  } catch (e) {
    res.sendStatus(400);
  }
});

async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10); // 10 is the number of salt rounds

  const hashedPassword = await bcrypt.hash(password, salt);

  return hashedPassword;
}

async function comparePasswords(
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> {
  try {
    const match = await bcrypt.compare(plainPassword, hashedPassword);
    return match;
  } catch (error) {
    console.error("Error comparing passwords:", error);
    throw new Error("Error comparing passwords");
  }
}
