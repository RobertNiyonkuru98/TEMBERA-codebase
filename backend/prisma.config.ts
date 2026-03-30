/// <reference types="node" />
import { defineConfig } from "prisma/config";

// Use placeholder URL during build, actual DATABASE_URL at runtime
const databaseUrl = process.env.DATABASE_URL || "postgresql://user:pass@localhost:5432/db";

export default defineConfig({
  schema: "src/prisma/schema.prisma",
  migrations: {
    path: "src/prisma/migrations",
  },
  datasource: {
    url: databaseUrl,
  },
});
