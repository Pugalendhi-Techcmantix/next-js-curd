import { prisma } from '@/app/lib/prisma';

export async function PUT(req, context) {
  try {
    const params = await context.params; // ✅ await here
    const id = Number(params.id); // convert to number

    const body = await req.json();

    const student = await prisma.student.update({
      where: { id },
      data: {
        name: body.name,
        email: body.email,
        age: Number(body.age),
        number: String(body.number),
      },
    });

    return Response.json(student);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(req, context) {
  try {
    const params = await context.params;
    const id = Number(params.id);
    // 🔍 check first
    const existing = await prisma.student.findUnique({
      where: { id },
    });

    if (!existing) {
      return Response.json({ error: 'Student not found' }, { status: 404 });
    }
    const student = await prisma.student.findFirst({
      where: { id },
    });
    return Response.json({ data: student });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req, context) {
  try {
    const params = await context.params; // ✅ await here
    const id = Number(params.id); // convert to number
    // 🔍 check first
    const existing = await prisma.student.findUnique({
      where: { id },
    });

    if (!existing) {
      return Response.json({ error: 'Student not found' }, { status: 404 });
    }

    await prisma.student.delete({
      where: { id },
    });

    return Response.json({ message: 'Deleted' });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
