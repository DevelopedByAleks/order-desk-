import { toOrderDTO } from "@/features/orders/mappers/order.mapper"
import { parseOrderId } from "@/features/orders/schemas/order.schema"
import { readOrderImage } from "@/features/orders/server/order-image"
import { getOrderById } from "@/features/orders/server/orders.queries"
import { orderRequestError } from "../../response"

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const id = parseOrderId((await params).id)
  if (id === null) return new Response(null, { status: 400 })

  try {
    const order = await getOrderById(id)
    const name = order ? toOrderDTO(order).imageFile : null
    const image = name ? await readOrderImage(name) : null
    if (!image) return new Response(null, { status: 404 })

    return new Response(Uint8Array.from(image.bytes), {
      headers: {
        "Content-Type": image.contentType,
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
      },
    })
  } catch (cause) {
    return orderRequestError(cause)
  }
}
