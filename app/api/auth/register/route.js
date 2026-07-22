import bcrypt from "bcryptjs";
import { prisma } from "@/app/lib/prisma";

export async function POST(req) {
  try {
    const body = await req.json();
    // 📦 Collect validation errors
    const errors = {};

    // 1. Validate Username
    if (!body.username || body.username.trim() === "") {
      errors.username = ["Username is required"];
    }

    // 2. Validate Age
    if (body.age === undefined || body.age === null || body.age === "") {
      errors.age = ["Age is required"];
    }

    // 3. Validate Phone Number
    if (!body.phone_number || body.phone_number.trim() === "") {
      errors.phone_number = ["Phone number is required"];
    }

    // 4. Validate Password
    if (!body.password || body.password.trim() === "") {
      errors.password = ["Password is required"];
    }

    // 5. Validate Role
    // if (
    //   body.role_id === undefined ||
    //   body.role_id === null ||
    //   body.role_id === ""
    // ) {
    //   errors.role_id = ["Role is required"];
    // }

    // 6. Validate Email
    if (!body.email || body.email.trim() === "") {
      errors.email = ["Email is required"];
    } else {
      const existingEmail = await prisma.employee.findUnique({
        where: {
          email: String(body.email),
        },
      });

      if (existingEmail) {
        errors.email = ["Email already exists"];
      }
    }

    // ❌ Return Validation Errors
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
    const hashedPassword = await bcrypt.hash(body.password, 10);

    // ✅ Create Employee
    const employee = await prisma.employee.create({
      data: {
        username: String(body.username),

        age: Number(body.age),

        email: String(body.email),

        phoneNumber: String(body.phone_number),

        passwordHash: hashedPassword,

        fairPassword: body.password ? String(body.password) : null,

        profileImage: body.profile_image ? String(body.profile_image) : null,

        roleId: 3,
      },

      include: {
        role: true,
      },
    });

    return Response.json({
      status: true,
      message: "Employee created successfully",
      data: employee,
    });
  } catch (error) {
    return Response.json(
      {
        status: false,
        error: error.message,
      },
      { status: 500 },
    );
  }
}
