import { PrismaClient } from "@prisma/client";
import { seedAdminUser, seedWorldCup2026, seedBrasileiraoTest } from "../src/lib/seed";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is required");
}

const SEED_MODE = process.env.SEED_MODE ?? "worldcup";
const DEFAULT_TEST_ADMIN_PASSWORD = "admin123";

const adminPassword = process.env.ADMIN_PASS;
const adminPasswordValue = adminPassword ?? (SEED_MODE === "brasileirao-test" ? DEFAULT_TEST_ADMIN_PASSWORD : "");

if (!adminPasswordValue) {
  throw new Error("ADMIN_PASS environment variable is required");
}

async function main() {
  if (SEED_MODE === "brasileirao-test") {
    const result = await seedBrasileiraoTest(adminPasswordValue);
    if (!result.success) throw new Error(result.error);
    console.log(result.message);
    return;
  }

  if (SEED_MODE === "admin-only") {
    const result = await seedAdminUser(adminPasswordValue);
    if (!result.success) throw new Error(result.error);
    console.log(result.message);
    return;
  }

  const result = await seedWorldCup2026(adminPasswordValue);
  if (!result.success) throw new Error(result.error);
  console.log(result.message);
}

const prisma = new PrismaClient();

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
