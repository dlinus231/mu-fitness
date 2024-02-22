import { Prisma, PrismaClient } from "@prisma/client";
import express, { Request, Response } from "express";
import bcrypt from "bcryptjs";
const cors = require("cors");

const prisma = new PrismaClient();

const app = express();

app.use(express.json());
app.use(cors());

const server = app.listen(3000, () =>
  console.log(`
🚀 Server ready at: http://localhost:3000
⭐️ See sample requests: http://pris.ly/e/ts/rest-express#3-using-the-rest-api`)
);

app.get(`/test`, async (req, res) => {
  res.sendStatus(200);
});

//User signup
app.post(`/user/create`, async (req, res) => {
  const { username, email, password } = req.body;

  const password_hashed = await hashPassword(password);
  try {
    const result = await prisma.user.create({
      data: {
        email,
        username,
        password_hashed,
        last_login: new Date(),
      },
    });
    const returnData = {
      id: result.id,
      email: result.email,
      username: result.username,
      last_login: result.last_login,
    };
    res.status(201).send(returnData);
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      console.error(e);
      res.sendStatus(409);
    } else {
      res.sendStatus(400);
    }
  }
});

//User login
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
        result.last_login = new Date();
        const updatedResult = await prisma.user.update({
          where: {
            id: result.id,
          },
          data: result,
        });

        const returnData = {
          id: result.id,
          email: result.email,
          username: result.username,
          last_login: result.last_login,
        };

        res.status(200).send(returnData);
      } else {
        res.sendStatus(401);
      }
    }
  } catch (e) {
    res.sendStatus(400);
  }
});

//Get single workout by id
app.get(`/workout/one/:workoutId`, async (req, res) => {
  const { workoutId } = req.params;
  if (workoutId == null) {
    res.sendStatus(400);
    return;
  }
  try {
    const result = await prisma.workout.findUniqueOrThrow({
      where: {
        id: parseInt(workoutId),
      },
    });
    res.status(200).json(result);
  } catch (e) {
    console.error(e);
    res.sendStatus(400);
  }
});

//Get all workouts for a user
app.get(`/workout/many/:userId`, async (req, res) => {
  const { userId } = req.params;
  if (userId == null) {
    res.sendStatus(400);
    return;
  }
  try {
    const result = await prisma.workout.findMany({
      where: {
        user_id: parseInt(userId),
      },
    });
    res.status(200).json(result);
  } catch (e) {
    console.error(e);
    res.sendStatus(400);
  }
});

//Create workout
app.post(`/workout/create`, async (req, res) => {
  const { userId, name, difficulty, description, tags } = req.body;

  try {
    const result = await prisma.workout.create({
      data: {
        name,
        difficulty,
        description,
        tags: {
          connect: tags.map((tag: number) => ({
            id: tag,
          })),
        },
        user: { connect: { id: parseInt(userId) } },
      },
    });
    res.status(201).json(result);
  } catch (e) {
    console.log(e);
    res.sendStatus(400);
  }
});

//Delete a workout - TODO authenticate whether user has permissions to delete
app.delete(`/workout/delete/:workoutId`, async (req, res) => {
  const { workoutId } = req.params;
  if (workoutId == null) {
    res.sendStatus(400);
    return;
  }
  try {
    const result = await prisma.workout.delete({
      where: {
        id: parseInt(workoutId),
      },
    });
    res.sendStatus(200);
  } catch (e) {
    console.error(e);
    res.sendStatus(400);
  }
});

async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10); // 10 is the number of salt rounds

  const hashedPassword = await bcrypt.hash(password, salt);

  return hashedPassword;
}

//Use bcyrpt module to compare hashes of the password
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
