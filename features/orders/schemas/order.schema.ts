import { z } from "zod"
import { OrderStatus } from "@/generated/prisma/enums"

const commentSchema = z.string().trim()
    .refine(value => value === "" || Array.from(value).length >= 3, "Введите хотя бы 3 символа.")
    .refine(value => new TextEncoder().encode(value).length <= 250, "Комментарий должен занимать не больше 250 байт.")
    .nullish()

export const OrderIdSchema = z.int32().positive()

export const ChangeOrderStatusSchema = z.object({
    id: OrderIdSchema,
    status: z.enum(OrderStatus),
    comment: commentSchema,
})

export const CreateOrderSchema = z.object({
    status: z.enum(OrderStatus).optional(),
    comment: commentSchema,
    imageFile: z.string().trim().nullish(),
})

export function parseOrderId(id: string) {
    const parsed = OrderIdSchema.safeParse(Number(id))
    if (!parsed.success || String(parsed.data) !== id) return null
    return parsed.data
}
