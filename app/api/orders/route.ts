import { z } from "zod"
import { toOrderDTO } from "@/features/orders/mappers/order.mapper"
import { CreateOrderSchema } from "@/features/orders/schemas/order.schema"
import { getOrders } from "@/features/orders/server/orders.queries"
import { createNewOrder } from "@/features/orders/services/orders.service"
import { invalidOrder, orderRequestError } from "./response"

const createRequest = CreateOrderSchema.omit({ imageFile: true }).extend({ image: z.never().optional() })

export async function GET() {
  try {
    const orders = await getOrders()
    return Response.json(orders.map(toOrderDTO))
  } catch (cause) {
    return orderRequestError(cause)
  }
}

export async function POST(request: Request) {
  const body: unknown = await request.json().catch(() => null)
  const input = createRequest.safeParse(body)
  if (!input.success) return invalidOrder(z.flattenError(input.error).fieldErrors)

  try {
    const order = await createNewOrder(input.data)
    return Response.json({ success: true, data: toOrderDTO(order) }, { status: 201 })
  } catch (cause) {
    return orderRequestError(cause)
  }
}
