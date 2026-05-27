import { prisma } from "@/app/lib/prisma";

export async function roleSeeder() {
  await prisma.role.createMany({
    data: [
      { name: "Superadmin", status: 1 },
      { name: "Admin", status: 1 },
      { name: "Employee", status: 1 },
    ],
    skipDuplicates: true,
  });

  console.log("Role Seeder Done");
}

