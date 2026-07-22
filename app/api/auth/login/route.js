import { prisma } from "@/app/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    const body = await req.json();

    const errors = {};

    // Email Validation
    if (!body.email || body.email.trim() === "") {
      errors.email = ["Email is required"];
    }

    // Password Validation
    if (!body.password || body.password.trim() === "") {
      errors.password = ["Password is required"];
    }

    // Return Validation Errors
    if (Object.keys(errors).length > 0) {
      return Response.json(
        {
          status: false,
          message: "Validation Error",
          errors,
          data: null,
        },
        {
          status: 422,
        }
      );
    }

    // Find Employee
    const employee = await prisma.employee.findUnique({
      where: {
        email: String(body.email),
      },
      include: {
        role: true,
      },
    });

    // Email not found
    if (!employee) {
      return Response.json(
        {
          status: false,
          message: "Invalid email or password",
          data: null,
        },
        {
          status: 401,
        }
      );
    }

    // Compare Password
    const passwordMatched = await bcrypt.compare(
      body.password,
      employee.passwordHash
    );

    if (!passwordMatched) {
      return Response.json(
        {
          status: false,
          message: "Invalid email or password",
          data: null,
        },
        {
          status: 401,
        }
      );
    }

    // Check JWT Secret
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not configured");
    }

    // Generate JWT Token
    const token = jwt.sign(
      {
        id: employee.id,
        email: employee.email,
        roleId: employee.roleId,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN || "7d",
      }
    );

    // Success Response
    return Response.json(
      {
        status: true,
        message: "Login Successful",
        data: {
          token,
          user: {
            id: employee.id,
            username: employee.username,
            email: employee.email,
            phoneNumber: employee.phoneNumber,
            role: employee.role,
          },
        },
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        status: false,
        message: "Internal Server Error",
        error: error.message,
        data: null,
      },
      {
        status: 500,
      }
    );
  }
}