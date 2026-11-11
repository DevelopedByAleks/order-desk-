import { toOrderDTO } from "@/lib/mappers/order.mapper"
import { errorStatus, listOrders, orderError, saveOrder } from "@/lib/orders"

export async function GET() {
  try {
    const orders = await listOrders()
    return Response.json(orders.map(toOrderDTO))
  } catch (cause) {
    const error = orderError(cause)
    return Response.json({ success: false, error }, { status: errorStatus[error.kind] })
  }
}

export async function POST(request: Request) {
  const body: unknown = await request.json().catch(() => null)
  const result = await saveOrder(body)
  if (!result.success) {
    return Response.json(result, { status: errorStatus[result.error.kind] })
  }
  return Response.json(result, { status: 201 })
}
