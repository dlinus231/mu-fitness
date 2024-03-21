# Backend Setup

## Prisma Setup

- Set DATABASE_URL in .env file to Postgres connection url
- Create Prisma data models in prisma/schema.prisma
- Run command "npx prisma migrate dev --name init"
- Run command "npm install @prisma/client"
- Write API server code in src/index.ts
- Run command "npm run dev"

https://www.prisma.io/docs/getting-started/setup-prisma/start-from-scratch/relational-databases-typescript-postgresql

## Loading static data

- Loading static data for exercises, body parts, muscle groups etc in `/backend/src/load_data`. Please make sure to run the scripts in the order: tags.js, muscle_groups.js, and finally, exercises.js
  - run `node tags.js` in this directory to populate the database with `Tags`
  - run `node muscle_groups.js` in this directory to populate the database with `BodyParts` and `Muscles`
  - run `node exercises.js` in this directory to populate the database with `Exercises`
    - There are 3 new fields for an Exercise, contained within `exercises_final_normalized.csv`
      1. video_path: used for a YouTube embedding, it is of the format such that: `https://www.youtube.com/watch?v={video_path} `loads a YouTube tutorial for an exercise
      2. embedding: a 256 normalized vector of floats which encodes semantic meaning of the exercise. The string which was embedded includes the name, type, muscle, equipment, and difficulty of the exercise
      3. log_search_results: the number of search results an exercise has when looked up on Google, transformed using natural log. This is currently used as a surrogate for popularity of an exercise, but could be used as a weight in "intelligent" recommendations
  - run `node clear_exercises.js` in this directory to clear the exercises database for a variety of use cases

## Using the REST API Endpoints

You can access the REST API of the server using the following endpoints:

### `GET`

- `/workout/many/:userId`
  - Params:
    - `userId: Integer` (required): The user's id
  - Response:
    - `200`: Request successful. Returns an array of the workouts belonging to the user
    - `400`: Invalid request. Missing or invalid user id
- `/workout/one/:workoutId`
  - Params:
    - `workoutId: Integer` (required): The id of the workout requested
  - `200`: Request successful. Returns workout object as a json
  - `400`: Invalid request. Missing or invalid workout id

### `POST`

- `/user/create`: Create a new user
  - Body:
    - `username: String` (required): The user's username
    - `email: String` (required): The user's email, must be unique
    - `password: String` (required): The user's password
  - Response:
    - `201`: Account created successfully
    - `400`: Invalid request made
    - `409`: Duplicate email used
- `/user/login`: Sign into an existing user
  - Body:
    - `email: String` (required): The user's email
    - `password: String` (required): The user's password
  - Response:
    - `200`: Logged in successfully. Returns an object containing the user profile data.
    - `400`: Invalid request made
    - `401`: Invalid email or password given
- `/workout/create`: Create a new workout
  - Body:
    - `userId: Integer` (required): The id associated with the user creating the workout
    - `name: String` (required): The name of the workout
    - `difficulty: String` (required): The difficulty of the workout (beginner, intermediate, advanced)
    - `description: String` (required): A description of the workout
    - `tags: Array[Integer]` (required): An array of tag ids for the workout
  - Response:
    - `200`: Created successfully. Returns an object containing the workout data.
    - `400`: Invalid request made
- `/workout/edit`: Edit an existing workout
  - Body:
    - `workoutId: Integer` (required): The id associated with the workout
    - `name: String` (required): The updated name of the workout
    - `difficulty: String` (required): The updated difficulty of the workout
    - `description: String`: The updated description of the workout
  - Response:
    - `200`: Edited successfully
    - `400`: Invalid request made. Missing or invalid workout id

### `Delete`

- `/workout/delete/:workoutId`: Delete a workout
  - Params:
    - `workoutId: Integer` (required): The id of the workout to delete
  - Response:
    - `200`: Workout deleted successfully
    - `400`: Invalid request. Missing or invalid workout id
