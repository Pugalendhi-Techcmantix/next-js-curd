import { prisma } from "@/app/lib/prisma";

export async function GET() {
  const roles = await prisma.role.findMany({
    select: {
      id: true,
      name: true,
    },
    orderBy: {
      id: "asc",
    },
  });

  return Response.json({ roles });
}
