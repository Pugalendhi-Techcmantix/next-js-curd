import bcrypt from "bcryptjs";
import { prisma } from "@/app/lib/prisma";

// =========================
// GET Single Employee
// =========================
export async function GET(req, context) {
  try {
    const { id } = await context.params;

    const employee = await prisma.employee.findUnique({
      where: {
        id: Number(id),
      },
      select: {
        id: true,
        username: true,
        email: true,
        phoneNumber: true,
        age: true,
        profileImage: true,
        status: true,
        createdAt: true,
        updatedAt: true,

        role: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!employee) {
      return Response.json(
        {
          status: false,
          message: "Employee not found",
        },
        { status: 404 },
      );
    }

    return Response.json({
      status: true,
      data: employee,
    });
  } catch (error) {
    return Response.json(
      {
        status: false,
        message: error.message,
      },
      { status: 500 },
    );
  }
}

// =========================
// UPDATE Employee
// =========================
export async function PUT(req, context) {
  try {
    const { id } = await context.params;
    const body = await req.json();

    const employee = await prisma.employee.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!employee) {
      return Response.json(
        {
          status: false,
          message: "Employee not found",
        },
        { status: 404 },
      );
    }

    const errors = {};

    if (!body.username?.trim()) {
      errors.username = ["Username is required"];
    }

    if (!body.email?.trim()) {
      errors.email = ["Email is required"];
    }

    if (!body.phone_number?.trim()) {
      errors.phone_number = ["Phone number is required"];
    }

    if (!body.age) {
      errors.age = ["Age is required"];
    }

    if (!body.role_id) {
      errors.role_id = ["Role is required"];
    }

    // Check duplicate email
    const emailExists = await prisma.employee.findFirst({
      where: {
        email: body.email,
        NOT: {
          id: Number(id),
        },
      },
    });

    if (emailExists) {
      errors.email = ["Email already exists"];
    }

    if (Object.keys(errors).length > 0) {
      return Response.json(
        {
          status: false,
          message: "Validation Error",
          errors,
        },
        { status: 422 },
      );
    }

    const updateData = {
      username: body.username,
      email: body.email,
      phoneNumber: body.phone_number,
      age: Number(body.age),
      profileImage: body.profile_image || null,
      roleId: Number(body.role_id),
    };

    // Update password only if provided
    if (body.password && body.password.trim() !== "") {
      const hashedPassword = await bcrypt.hash(body.password, 10);

      updateData.passwordHash = hashedPassword;
      updateData.fairPassword = body.password;
    }

    const updatedEmployee = await prisma.employee.update({
      where: {
        id: Number(id),
      },
      data: updateData,
      include: {
        role: true,
      },
    });

    return Response.json({
      status: true,
      message: "Employee updated successfully",
      data: updatedEmployee,
    });
  } catch (error) {
    return Response.json(
      {
        status: false,
        message: error.message,
      },
      { status: 500 },
    );
  }
}

// =========================
// DELETE Employee
// =========================
export async function DELETE(req, context) {
  try {
    const { id } = await context.params;
    const employee = await prisma.employee.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!employee) {
      return Response.json(
        {
          status: false,
          message: "Employee not found",
        },
        { status: 404 },
      );
    }

    await prisma.employee.delete({
      where: {
        id: Number(id),
      },
    });

    return Response.json({
      status: true,
      message: "Employee deleted successfully",
    });
  } catch (error) {
    return Response.json(
      {
        status: false,
        message: error.message,
      },
      { status: 500 },
    );
  }
}
