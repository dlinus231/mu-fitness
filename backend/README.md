# Backend Setup

## Prisma Setup

- Set DATABASE_URL in .env file to Postgres connection url
- Create Prisma data models in prisma/schema.prisma
- Run command "npx prisma migrate dev --name init"
- Run command "npm install @prisma/client"
- Write API server code in src/index.ts
- Run command "npm run dev"

https://www.prisma.io/docs/getting-started/setup-prisma/start-from-scratch/relational-databases-typescript-postgresql

## Using the REST API Endpoints

You can access the REST API of the server using the following endpoints:

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
- `/user/create`: Create a new user
  - Body:
    - `email: String` (required): The user's email
    - `password: String` (required): The user's password
  - Response:
    - `200`: Logged in successfully
    - `400`: Invalid request made
    - `401`: Invalid email or password given
