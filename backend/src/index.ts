import "dotenv/config";
import express, { type Request, type Response } from "express";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const app = express();

const connectionString = process.env.DATABASE_URL;
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const PORT = process.env.PORT || 3000;

app.use(express.json());

// Test Route
app.get("/users", async (req: Request, res: Response) => {
  const users = await prisma.testUser.findMany();
  res.json(users);
});

// Create User Route
app.post("/users", async (req: Request, res: Response) => {
  const { email, name } = req.body;
  try {
    const newUser = await prisma.testUser.create({
      data: { email, name },
    });
    res.json(newUser);
  } catch (error) {
    res.status(400).json({ error: "User already exists or invalid data" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server ready at: http://localhost:${PORT}`);
});
