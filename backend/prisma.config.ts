import "dotenv/config";

export default {
  schema: "src/prisma/schema.prisma",
  datasource: {
    url: process.env.DATABASE_URL,
  },
  migrations: {
    path: "src/prisma/migrations",
  },
};
