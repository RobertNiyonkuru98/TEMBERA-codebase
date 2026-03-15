import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

async function testConnection() {
  const connectionString = process.env.DATABASE_URL;
  const pool = new pg.Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  try {
    console.log("🔍 Testing database connection...");
    
    // Test connection
    await prisma.$connect();
    console.log("✅ Database connected successfully!");

    // Test query
    const userCount = await prisma.user.count();
    console.log(`📊 Users in database: ${userCount}`);

    // List all tables
    const tables = await prisma.$queryRaw<Array<{ tablename: string }>>`
      SELECT tablename FROM pg_tables WHERE schemaname='public' ORDER BY tablename;
    `;
    console.log(`📋 Tables in database:`);
    tables.forEach(t => console.log(`   - ${t.tablename}`));

    await prisma.$disconnect();
    console.log("✅ All tests passed!");
  } catch (error) {
    console.error("❌ Error:", error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

testConnection();
