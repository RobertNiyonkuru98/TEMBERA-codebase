import "dotenv/config";
import express from "express";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import path from "path";
import { logger } from "./utils/logger";
import router from "./routes";

const __dirname = path.resolve();

const app = express();

const connectionString = process.env.DATABASE_URL;
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const PORT = process.env.PORT || 3000;

// Database connection verification function
async function verifyDatabaseConnection(): Promise<boolean> {
  try {
    await prisma.$connect();
    await prisma.$queryRaw`SELECT 1`;
    logger.info("Database connected successfully!");
    return true;
  } catch (error) {
    logger.error("Failed to connect to database:", error);
    return false;
  }
}

// Swagger setup from YAML
const swaggerDocument = YAML.load(path.join(__dirname, "src", "swagger.yml"));
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use("/api", router);

// Start server with database connection verification
async function startServer() {
  const isDbConnected = await verifyDatabaseConnection();

  if (!isDbConnected) {
    logger.error("Failed to connect to database");
    process.exit(1); // Exit if database connection fails
  }

  app.listen(PORT, () => {
    logger.info(`Server is running on: http://localhost:${PORT}/api`);
    logger.info(`API Documentation: http://localhost:${PORT}/api/docs`);
  });
}

startServer();
