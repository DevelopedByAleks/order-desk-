"use server"

import { revalidatePath } from "next/cache"
import { saveOrder } from "@/lib/orders"
import type { ActionResult, OrderDTO } from "@/lib/types/orders"
import { readOrderForm } from "@/lib/validations/orders"

export async function saveOrderFromForm(
  id: number | undefined,
  _previous: ActionResult<OrderDTO> | null,
  form: FormData,
) {
  const result = await saveOrder(readOrderForm(form), id, { allowImage: true })
  if (result.success) revalidatePath("/orders/v2")
  return result
}

export async function saveOrderFromFields(id: number | undefined, values: unknown) {
  const result = await saveOrder(values, id)
  if (result.success) revalidatePath("/orders/v3")
  return result
}
