import { prisma } from "../../../lib/prisma";

export async function GET(req, { params }) {
  try {
    const { id } = await params;
    const roleId = Number(id);

    if (!id || isNaN(roleId)) {
      return Response.json(
        { error: "A valid Role ID is required" },
        { status: 400 },
      );
    }

    const role = await prisma.role.findUnique({
      where: { id: roleId },
    });

    if (!role) {
      return Response.json({ error: "Role not found" }, { status: 404 });
    }

    return Response.json({ data: role });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    const resolvedParams = await params;
    const id = Number(resolvedParams.id);

    if (isNaN(id)) {
      return Response.json(
        { error: "Invalid Role ID format" },
        { status: 400 },
      );
    }

    const body = await req.json();

    // 📦 This object will collect all errors
    const errors = {};

    // 1. Validate Name Field
    if (!body.name || body.name.trim() === "") {
      errors.name = ["Role name is required"];
    }

    // 2. Validate Status Field
    if (
      body.status === undefined ||
      body.status === null ||
      body.status === ""
    ) {
      errors.status = ["Role status is required"];
    } else {
      const statusNumber = Number(body.status);
      if (statusNumber !== 1 && statusNumber !== 2) {
        errors.status = ["Role status must be 1 or 2"];
      }
    }

    // 🛑 If there are any input errors, stop here and return ALL of them
    if (Object.keys(errors).length > 0) {
      return Response.json({ errors }, { status: 400 });
    }

    // 3. Database Exists Check
    const existingRole = await prisma.role.findUnique({
      where: { id },
    });

    if (!existingRole) {
      return Response.json({ error: "Role not found" }, { status: 404 });
    }

    // 4. Database Unique Name Check
    const duplicateRole = await prisma.role.findFirst({
      where: {
        name: body.name,
        id: { not: id },
      },
    });

    if (duplicateRole) {
      errors.name = ["Role name already exists"];
      return Response.json({ errors }, { status: 400 });
    }

    // 5. Execute Update if everything is perfectly clear
    const updatedRole = await prisma.role.update({
      where: { id },
      data: {
        name: body.name,
        status: Number(body.status),
      },
    });

    return Response.json(updatedRole);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
