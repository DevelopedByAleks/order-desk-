import { z } from "zod"
import { toOrderDTO } from "@/features/orders/mappers/order.mapper"
import { ChangeOrderStatusSchema, parseOrderId } from "@/features/orders/schemas/order.schema"
import { changeOrderStatus } from "@/features/orders/services/orders.service"
import { invalidOrder, orderRequestError } from "../response"

const updateRequest = ChangeOrderStatusSchema.omit({ id: true }).extend({ image: z.never().optional() })

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const orderId = parseOrderId(id)
  if (orderId === null) {
    return invalidOrder({ id: ["Некорректный ID заказа."] })
  }

  const body: unknown = await request.json().catch(() => null)
  const input = updateRequest.safeParse(body)
  if (!input.success) return invalidOrder(z.flattenError(input.error).fieldErrors)

  try {
    const order = await changeOrderStatus({ id: orderId, ...input.data })
    return Response.json({ success: true, data: toOrderDTO(order) })
  } catch (cause) {
    return orderRequestError(cause)
  }
}
