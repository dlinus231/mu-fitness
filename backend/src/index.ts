import { Prisma, PrismaClient, Routine } from "@prisma/client";
import express, { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { env } from "process";
const cors = require("cors");
const nodemailer = require("nodemailer");

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
  if (!validateEmail(email)) {
    res.sendStatus(400);
  }

  const password_hashed = await hashPassword(password);

  try {
    const result = await prisma.user.create({
      data: {
        email,
        username,
        password_hashed,
        last_login: new Date(),
        active: false,
      },
    });
    const returnData = {
      id: result.id,
      email: result.email,
      username: result.username,
      last_login: result.last_login,
      active: result.active,
    };

    res.status(201).json(returnData);
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

  if (!validateEmail(email)) {
    res.sendStatus(400);
    return;
  }

  console.log("login request by " + email);

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
          active: result.active,
        };

        res.status(200).send(returnData);
      } else {
        res.sendStatus(401);
      }
    }
  } catch (e) {
    console.log(e);

    res.sendStatus(400);
  }
});

//Create email validation code
app.post("/user/createauth", async (req, res) => {
  const { user_id } = req.body;

  const value = Math.floor(Math.random() * 1000000);
  try {
    const user = await prisma.user.findUnique({ where: { id: user_id } });

    if (!user || !validateEmail(user.email)) {
      res.sendStatus(401);
      return;
    }

    const prevAuthCode = await prisma.authCode.findUnique({
      where: { user_id },
    });

    let authCode;

    if (!prevAuthCode) {
      authCode = await prisma.authCode.create({
        data: {
          user_id,
          value,
          valid_until: new Date(new Date().getTime() + 15 * 60000),
        },
      });
    } else {
      authCode = await prisma.authCode.update({
        where: {
          user_id,
        },
        data: {
          value,
          valid_until: new Date(new Date().getTime() + 15 * 60000),
        },
      });
    }

    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "mufitnessnoreply@gmail.com",
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    var mailOptions = {
      from: "mufitnessnoreply@gmail.com",
      to: user.email,
      subject: "Mu Fitness App: Validate your email",
      html: `
    <p>Dear ${user.username},</p>
    
    <p>Thank you for registering with the Mu Fitness App. To complete your registration process, please use the following validation code:</p>
    
    <p><strong>Validation Code:</strong> ${value}</p>
    
    <p>Please enter this code on the registration page to verify your email address and activate your account. Your validation code is valid for the next 15 minutes.</p>
    
    <p>If you did not register with Mu Fitness, please disregard this email.</p>
    
    <p>Best Wishes,<br>
    Mu Fitness</p>`,
    };
    transporter.sendMail(mailOptions, function (error: any, info: any) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
        res.sendStatus(200);
      }
    });
  } catch (e) {
    console.log(e);
    res.sendStatus(400);
  }
});

//Validate user authentication code
app.post("/user/validateauth", async (req, res) => {
  const { user_id, code } = req.body;

  try {
    const result = await prisma.authCode.findUnique({ where: { user_id } });

    if (!result) {
      res.sendStatus(400);
    } else if (new Date() > new Date(result.valid_until)) {
      res.status(401).json({ message: "Authentication token expired" });
    } else if (code != result.value) {
      res.status(401).json({ message: "Invalid authentication token" });
    } else {
      const activateUser = await prisma.user.update({
        where: { id: user_id },
        data: {
          active: true,
        },
      });
      const deleteAuth = await prisma.authCode.delete({ where: { user_id } });
      res.sendStatus(200);
    }
  } catch (e) {
    console.error(e);
    res.sendStatus(400);
  }
});

//Delete user by email
app.delete("/user/delete", async (req, res) => {
  const { email } = req.body;
  try {
    const result = await prisma.user.delete({
      where: {
        email,
      },
    });
    res.sendStatus(200);
  } catch (error) {
    res.sendStatus(400);
  }
});

// get all users
app.get("/users", async (req, res) => {
  try {
    let result = await prisma.user.findMany();

    // only keep the fields that we need
    let parsedResult = result.map((user) => {
      return {
        id: user.id,
        username: user.username,
        email: user.email,
        active: user.active,
      };
    });

    res.status(200).json(parsedResult);
  } catch (error) {
    res.sendStatus(400);
  }
});

// get user by id
app.get("/user/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    let result = await prisma.user
      .findUnique({
        where: {
          id: parseInt(userId),
        },
        include: {
          followers: true,
          following: true,
        },
      })
      .then((user) => {
        if (user == null) {
          res.sendStatus(404);
          return;
        }
        return {
          id: user.id,
          username: user.username,
          email: user.email,
          active: user.active,
          // followers: user.followers.map((follower) => follower.followerId),
          // following: user.following.map((following) => following.followingId),
          followers: user.followers,
          following: user.following,
        };
      });

    res.status(200).json(result);
  } catch (error) {
    res.sendStatus(400);
  }
});

// follow user
app.post("/user/follow/:followedUserId", async (req, res) => {
  // userId is following followedUserId
  // userId is the currently logged in user
  const { userId } = req.body;
  const { followedUserId } = req.params;

  // check that the user is not trying to follow themselves
  // and that the accounts exist
  if (userId == followedUserId) {
    console.log("You can't follow yourself dum dum");
    res.sendStatus(400);
    return;
  } else if (userId == null || followedUserId == null) {
    res.sendStatus(400);
    return;
  }

  // check if the user is already following the other user
  const alreadyFollowing = await prisma.follow.findFirst({
    // TODO do I need to do this the other way like in the unfollow endpoint?
    where: {
      followerId: userId,
      followingId: parseInt(followedUserId),
    },
  });
  if (alreadyFollowing) {
    console.log("You are already following this user");
    res.sendStatus(400);
    return;
  }

  // create the new following relationship (adds row to Follow table (which is a join table))
  try {
    const result = await prisma.follow.create({
      data: {
        followerId: userId,
        followingId: parseInt(followedUserId),
      },
    });
    console.log("User followed successfully");
    res.status(201).json(result);
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
});

// unfollow user
app.delete("/user/unfollow/:unfollowedUserId", async (req, res) => {
  const { userId } = req.body;
  const { unfollowedUserId } = req.params;

  if (userId == unfollowedUserId) {
    console.log("You can't unfollow yourself dum dum");
    res.sendStatus(400);
    return;
  }
  if (userId == null || unfollowedUserId == null) {
    res.sendStatus(400);
    return;
  }

  try {
    const result = await prisma.follow.delete({
      where: {
        followerId_followingId: {
          followerId: userId,
          followingId: parseInt(unfollowedUserId),
        },
      },
    });
    console.log("User unfollowed successfully");
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
});

// get all followers of a user
app.get("/user/followers/:userId", async (req, res) => {
  const { userId } = req.params;
  if (userId == null) {
    res.sendStatus(400);
    return;
  }

  try {
    const result = await prisma.follow.findMany({
      where: {
        followingId: parseInt(userId),
      },
      include: {
        follower: true,
      },
    });
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.sendStatus(400);
  }
});

// get all users that a user is following
app.get("/user/following/:userId", async (req, res) => {
  const { userId } = req.params;
  if (userId == null) {
    res.sendStatus(400);
    return;
  }

  try {
    const result = await prisma.follow.findMany({
      where: {
        followerId: parseInt(userId),
      },
      include: {
        following: true,
      },
    });
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.sendStatus(400);
  }
});

// Get all exercise names
// FOR NOW: IT RETURNS THE FIRST 100 EXERCISES
app.get(`/exercises/names`, async (req, res) => {
  try {
    const exerciseNames = await prisma.exercise.findMany({
      select: {
        id: true,
        name: true,
      },
    });
    //const first100ExerciseNames = exerciseNames.slice(0, 100);
    res.status(200).json(exerciseNames);
  } catch (error) {
    console.error("Error fetching exercises:", error);
    res.sendStatus(500);
  }
});

app.get(`/exercises/one/:exerciseId`, async (req, res) => {
  const { exerciseId } = req.params;

  if (exerciseId == null) {
    res.sendStatus(400);
    return;
  }
  try {
    const result = await prisma.exercise.findUniqueOrThrow({
      where: {
        id: parseInt(exerciseId),
      },
    });
    res.status(200).json(result);
  } catch (e) {
    console.error(e);
    res.sendStatus(400);
  }
});

app.get(`/exercises/saved/:userId/:exerciseId`, async (req, res) => {
  const { userId, exerciseId } = req.params;
  try {
    const result = await prisma.userSavedExercises.findMany({
      where: { userId: parseInt(userId), exerciseId: parseInt(exerciseId) },
    });
    if (result.length == 0) {
      res.status(200).json({ saved: false });
    } else {
      res.status(200).json({ saved: true });
    }
  } catch (error) {
    res.sendStatus(400);
  }
});

//Save Exercise
app.post(`/exercises/save`, async (req, res) => {
  const { userId, exerciseId } = req.body;

  try {
    const result = await prisma.userSavedExercises.create({
      data: {
        userId: parseInt(userId),
        exerciseId: parseInt(exerciseId),
        saved: new Date(),
      },
    });

    res.sendStatus(200);
  } catch (error) {
    console.error(error);

    res.sendStatus(400);
  }
});

//Unsave Exercise
app.post(`/exercises/unsave`, async (req, res) => {
  const { userId, exerciseId } = req.body;

  try {
    const result = await prisma.userSavedExercises.deleteMany({
      where: {
        userId: parseInt(userId),
        exerciseId: parseInt(exerciseId),
      },
    });
    res.sendStatus(200);
  } catch (error) {
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
      include: {
        routines: true,
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

// add new routine
app.post(`/workout/routine/add`, async (req, res) => {
  const { workout_id, exercise_id, reps, rest, weight } = req.body;
  try {
    const result = await prisma.routine.create({
      data: {
        workout_id,
        exercise_id,
        repetitions: parseInt(reps),
        rest: parseInt(rest),
        weight_lbs: parseInt(weight),
      },
    });
    res.status(201).json(result);
  } catch (e) {
    console.log(e);
  }
});

// update a routine
app.patch("/workout/routine/update/:routineId", async (req, res) => {
  const { routineId } = req.params;

  const { repetitions, rest, weight_lbs } = req.body;

  try {
    const result = await prisma.routine.update({
      where: {
        id: parseInt(routineId),
      },
      data: {
        repetitions: parseInt(repetitions),
        rest: parseInt(rest),
        weight_lbs: parseInt(weight_lbs),
      },
    });
    res.status(201).json(result);
  } catch (e) {
    console.log(e);
    res.sendStatus(400);
  }
});

// delete a routine
app.delete("/workout/routine/delete/:routineId", async (req, res) => {
  const { routineId } = req.params;
  try {
    const result = await prisma.routine.delete({
      where: {
        id: parseInt(routineId),
      },
    });
    res.status(200).json(result);
  } catch (e) {
    console.log(e);
    res.sendStatus(400);
  }
});

// update workout plan
app.post(`/workout/edit`, async (req, res) => {
  // TOOD add ability to update associated routineId? (might not be needed though)
  const { workoutId, name, difficulty, description } = req.body;
  if (workoutId == null) {
    res.sendStatus(400);
    return;
  }

  try {
    const result = await prisma.workout.update({
      where: {
        id: workoutId,
      },
      data: {
        name,
        difficulty,
        description,
        // routines: {
        //   connect: routineIds.map((routineId: number) => ({ id: routineId })),
        // },
      },
      include: {
        routines: true,
      },
    });

    res.sendStatus(200);
  } catch (e) {
    console.error(e);
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
      include: {
        routines: true,
      },
    });
    res.sendStatus(200);
  } catch (e) {
    console.error(e);
    res.sendStatus(400);
  }
});

app.get(`/search/:query`, async (req, res) => {
  const { query } = req.params;
  interface Data {
    exercises: any[];
    workouts: any[];
    users: any[];
  }

  const returnData: Data = {
    exercises: [],
    workouts: [],
    users: [],
  };

  try {
    const exerciseResult = await prisma.exercise.findMany({
      where: {
        name: {
          contains: query,
          mode: "insensitive",
        },
      },
      take: 5,
    });
    returnData.exercises = exerciseResult;

    const workoutResult = await prisma.workout.findMany({
      where: {
        name: {
          contains: query,
          mode: "insensitive",
        },
      },
      take: 5,
    });
    returnData.workouts = workoutResult;

    const userResult = await prisma.user.findMany({
      where: {
        username: {
          contains: query,
          mode: "insensitive",
        },
      },
      take: 5,
    });
    returnData.users = userResult;

    res.status(200).json(returnData);
  } catch (error) {
    res.sendStatus(404);
  }
});

//Hash and salt password
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

//Check if is valid email
function validateEmail(email: string): boolean {
  // Regular expression for basic email validation
  const emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return emailRegex.test(email);
}
