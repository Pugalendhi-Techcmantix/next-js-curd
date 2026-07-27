import { prisma } from "@/app/lib/prisma";

export async function GET() {
  try {
    const roles = await prisma.role.findMany({
      where: {
        id: {
          not: 1,
        },
      },
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        id: "asc",
      },
    });

    return Response.json({
      status: true,
      roles,
    });
  } catch (error) {
    return Response.json(
      {
        status: false,
        message: error.message,
      },
      { status: 500 }
    );
  }
}