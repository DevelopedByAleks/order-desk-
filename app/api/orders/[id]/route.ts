import { prisma } from "@/lib/prisma";
import { orderIdSchema, updateOrderSchema } from "@/lib/validations/orders";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const orderId = orderIdSchema.safeParse(Number(id));
  if (!orderId.success || String(orderId.data) !== id) {
    return Response.json({ error: "Некорректный ID заказа." }, { status: 400 });
  }

  const body: unknown = await request.json().catch(() => null);
  const input = updateOrderSchema.safeParse(body);
  if (!input.success) {
    return Response.json({ error: "Выберите допустимый статус." }, { status: 400 });
  }

  try {
    const { count } = await prisma.order.updateMany({
      where: { id: orderId.data },
      data: input.data,
    });
    if (count === 0) {
      return Response.json({ error: "Заказ не найден." }, { status: 404 });
    }

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Не удалось сохранить статус." }, { status: 500 });
  }
}
