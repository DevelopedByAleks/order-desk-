import { listOrders } from "@/lib/orders";
import { prisma } from "@/lib/prisma";
import { createOrderSchema } from "@/lib/validations/orders";

export async function GET() {
  try {
    return Response.json(await listOrders());
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Не удалось загрузить заказы." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const body: unknown = await request.json().catch(() => null);
  const input = createOrderSchema.safeParse(body);
  if (!input.success) {
    return Response.json({ error: "Выберите допустимый статус." }, { status: 400 });
  }

  try {
    const order = await prisma.order.create({ data: input.data });
    return Response.json(order, { status: 201 });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Не удалось создать заказ." }, { status: 500 });
  }
}
