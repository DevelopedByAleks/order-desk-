import type { OrderStatus } from "@/generated/prisma/enums"

export type OrderDTO = {
  id: number
  status: OrderStatus
  createdAt: string
  comment: string | null
  imageUrl: string | null
}

export type FormError = {
  message: string
  fieldErrors?: Record<string, string[]>
}

export type OrderError = FormError & {
  kind: "validation" | "not_found" | "infrastructure" | "unknown"
}

export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: OrderError }
