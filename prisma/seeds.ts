import { prisma } from "@/app/lib/prisma";
import { roleSeeder } from "./seeds/role.seed";

async function main() {
  await roleSeeder();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
