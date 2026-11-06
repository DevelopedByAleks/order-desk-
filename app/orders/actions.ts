"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { orderIdSchema, orderStatusSchema } from "@/lib/validations/orders";

export async function createOrder(_: string | null, form: FormData) {
  const status = orderStatusSchema.safeParse(form.get("status") ?? "NEW");
  if (!status.success) return "Выберите допустимый статус.";

  try {
    await prisma.order.create({ data: { status: status.data } });
  } catch (error) {
    console.error(error);
    return "Не удалось создать заказ. Попробуйте ещё раз.";
  }

  revalidatePath("/orders");
  return null;
}

export async function updateOrder(id: number, _: string | null, form: FormData) {
  const orderId = orderIdSchema.safeParse(id);
  if (!orderId.success) return "Некорректный ID заказа.";

  const status = orderStatusSchema.safeParse(form.get("status"));
  if (!status.success) return "Выберите допустимый статус.";
  try {
    const { count } = await prisma.order.updateMany({
      where: { id: orderId.data },
      data: { status: status.data },
    });
    if (count === 0) return "Заказ не найден.";
  } catch (error) {
    console.error(error);
    return "Не удалось сохранить статус. Попробуйте ещё раз.";
  }

  revalidatePath("/orders");
  return null;
}
