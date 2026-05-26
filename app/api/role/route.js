import { prisma } from "../../lib/prisma";

export async function GET() {
  const roles = await prisma.role.findMany();
  return Response.json({ data: roles });
}

export async function POST(req) {
  try {
    const body = await req.json();

    // 1. VALIDATION FIRST: Check if name is missing or empty string
    if (!body.name || body.name.trim() === "") {
      return Response.json(
        { error: "Role name is required" },
        { status: 400 }
      );
    }

    // 2. DB CHECK: Check if a role with this name already exists
    const existingRole = await prisma.role.findFirst({
      where: {
        name: body.name,
      },
    });

    // 3. DUPLICATE CHECK: If it exists, return an error response
    if (existingRole) {
      return Response.json(
        { error: "Role already exists" },
        { status: 400 }
      );
    }

    // 4. CREATE: If passes all checks, create the new role
    const role = await prisma.role.create({
      data: {
        name: body.name,
      },
    });

    return Response.json(role, { status: 201 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}