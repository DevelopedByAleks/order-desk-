import type { OrderStatus } from "@/generated/prisma/enums"

export type OrderDTO = {
  id: number
  status: OrderStatus
  comment: string | null
  imageFile: string | null
  imageUrl: string | null
  createdAt: string
}
