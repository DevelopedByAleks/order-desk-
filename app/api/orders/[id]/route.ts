import { errorStatus, saveOrder } from "@/lib/orders"
import { invalidFields, parseOrderId } from "@/lib/validations/orders"

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const orderId = parseOrderId(id)
  if (orderId === null) {
    return Response.json(invalidFields({ id: ["Некорректный ID заказа."] }), { status: 400 })
  }

  const body: unknown = await request.json().catch(() => null)
  const result = await saveOrder(body, orderId)
  if (!result.success) {
    return Response.json(result, { status: errorStatus[result.error.kind] })
  }
  return Response.json(result)
}
