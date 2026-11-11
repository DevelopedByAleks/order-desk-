import { z } from "zod"
import { OrderStatus } from "@/generated/prisma/enums"
import type { OrderError } from "@/lib/types/orders"

const orderSchema = z.object({
  status: z.enum(OrderStatus, { error: "Выберите допустимый статус." }).optional(),
  comment: z.string({ error: "Введите текст комментария." }).trim().nullish(),
  image: z.file({ error: "Выберите файл изображения." }).optional(),
})

export function invalidFields(fieldErrors: Record<string, string[]>): { success: false; error: OrderError } {
  return {
    success: false,
    error: { kind: "validation", message: "Проверьте данные заказа.", fieldErrors },
  }
}

export function validateOrderInput(input: unknown, editing = false) {
  const result = orderSchema.safeParse(input)
  if (!result.success) return invalidFields(z.flattenError(result.error).fieldErrors)

  const { status, comment, image } = result.data
  const fieldErrors: Record<string, string[]> = {}
  if (editing && !status) fieldErrors.status = ["Выберите допустимый статус."]
  if (comment && Array.from(comment).length < 3) {
    fieldErrors.comment = ["Введите хотя бы 3 символа."]
  }
  if (comment && new TextEncoder().encode(comment).length > 250) {
    fieldErrors.comment = ["Комментарий должен занимать не больше 250 байт."]
  }
  if (image?.size === 0) fieldErrors.image = ["Файл пуст."]
  if (image && image.size > 2 * 1024 * 1024) {
    fieldErrors.image = ["Изображение должно быть не больше 2 МБ."]
  }

  if (Object.keys(fieldErrors).length > 0) return invalidFields(fieldErrors)
  return { success: true as const, data: { status, comment: comment === "" ? null : comment, image } }
}

export function isOrderId(value: number) {
  return Number.isInteger(value) && value > 0 && value <= 2_147_483_647
}

export function parseOrderId(id: string) {
  const value = Number(id)
  return String(value) === id && isOrderId(value) ? value : null
}

export function readOrderForm(form: FormData) {
  return {
    status: form.get("status") ?? undefined,
    comment: form.get("comment") ?? undefined,
    image: readImageField(form),
  }
}

function readImageField(form: FormData) {
  const image = form.get("image")
  if (image instanceof File && image.size === 0 && image.type === "application/octet-stream") {
    if (image.name === "" || image.name === "undefined") return undefined
  }
  return image ?? undefined
}
