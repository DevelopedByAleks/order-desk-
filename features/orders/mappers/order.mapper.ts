import type { Order } from "@/generated/prisma/client"
import type { OrderDTO } from "@/features/orders/types/order.dto"
import { storedOrderImageName } from "@/features/orders/server/order-image"

export function toOrderDTO(order: Order): OrderDTO {
  const raw = order.metadata
  const metadata: Record<string, unknown> =
    raw !== null &&
    typeof raw === "object" &&
    !Array.isArray(raw)
      ? raw
      : {};
  const imageFile = typeof metadata.imageFile === "string" ? metadata.imageFile : null
  let imageUrl: string | null = null
  if (imageFile && storedOrderImageName.test(imageFile)) {
    imageUrl = `/api/orders/${order.id}/image?v=${imageFile}`
  } else if (imageFile && /^https?:\/\//i.test(imageFile) && URL.canParse(imageFile)) {
    imageUrl = imageFile
  }

  return {
    id: order.id,
    status: order.status,
    comment:
      typeof metadata.comment === "string" ?
      metadata.comment :
      null,
    imageFile,
    imageUrl,
    createdAt: order.createdAt.toISOString()
  }
}
