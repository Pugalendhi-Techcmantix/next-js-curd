import { prisma } from '@/app/lib/prisma';

export async function GET() {
  const students = await prisma.student.findMany();
  return Response.json({ data: students });
}
export async function POST(req) {
  try {
    const body = await req.json();

    const student = await prisma.student.create({
      data: {
        name: body.name,
        email: body.email,
        age: Number(body.age),
        number: String(body.number), // ✅ FIX
      },
    });

    return Response.json(student);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
