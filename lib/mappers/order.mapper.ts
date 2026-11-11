import type { Order } from "@/generated/prisma/client"
import type { OrderDTO } from "@/lib/types/orders"

export function toOrderDTO(order: Order): OrderDTO {
  return {
    id: order.id,
    status: order.status,
    createdAt: order.createdAt.toISOString(),
    comment: order.comment,
    imageUrl: order.imageFile ? `/api/orders/${order.id}/image?v=${order.imageFile}` : null,
  }
}
