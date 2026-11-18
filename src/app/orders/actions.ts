"use server";

import { revalidatePath } from "next/cache";
import { runAction } from "@/shared/action";
import * as orders from "@/modules/orders/service";
import type { OrderInput } from "@/modules/orders/schema";

// Action — публичный endpoint: вход проверяет сервис. Два action'а, а не один с опциональным id:
// у update другой контракт (может вернуть not_found).

export async function createOrderAction(input: OrderInput) {
  return runAction(async () => {
    const { id } = await orders.createOrder(input);
    revalidatePath("/orders", "layout");
    return { id };
  });
}

export async function updateOrderAction(id: number, input: OrderInput) {
  return runAction(async () => {
    await orders.updateOrder(id, input);
    revalidatePath("/orders", "layout");
    return { id };
  });
}
