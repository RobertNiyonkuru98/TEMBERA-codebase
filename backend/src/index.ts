import "dotenv/config";
import express, { type Request, type Response } from "express";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const connectionString = process.env.DATABASE_URL;
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const PORT = process.env.PORT || 3000;

// Swagger setup from YAML
const swaggerDocument = YAML.load(path.join(__dirname, "swagger.yml"));
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(express.json());

const router = express.Router();

// Get Users
router.get("/users", async (req: Request, res: Response) => {
  const users = await prisma.testUser.findMany();
  res.json(users);
});

// Create User
router.post("/users", async (req: Request, res: Response) => {
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

app.use("/api", router);

app.listen(PORT, () => {
  console.log(`The server is running on: http://localhost:${PORT}/api`);
  console.log(`The server documentation is accessible on: http://localhost:${PORT}/api/docs`);
});
