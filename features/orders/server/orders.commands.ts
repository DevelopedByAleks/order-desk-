import { prisma } from "@/features/prisma"
import type { OrderDTO } from "@/features/orders/types/order.dto"


export type TChangeStatusInput = Pick<
  OrderDTO,
  "id" | "status"
> & { comment?: string | null };

export type TCreateInput = Partial<Pick<OrderDTO, "status" | "comment" | "imageFile">>;

export async function createOrder(orderData: TCreateInput) {
    const newOrder = await prisma.order.create({
        data: {
            status: orderData.status,
            metadata: {
                comment: orderData.comment || null,
                imageFile: orderData.imageFile || null
            }
        }
    })
    return newOrder
}

export async function updateOrderStatus(input: TChangeStatusInput) {
    if (input.comment !== undefined) {
        return prisma.$transaction(async tx => {
            const { metadata } = await tx.order.findUniqueOrThrow({
                where: { id: input.id },
                select: { metadata: true },
            })
            const previous = metadata && typeof metadata === "object" && !Array.isArray(metadata) ? metadata : {}
            return tx.order.update({
                where: { id: input.id },
                data: {
                    status: input.status,
                    metadata: { ...previous, comment: input.comment || null },
                },
            })
        }, { isolationLevel: "Serializable" })
    }

    const orderById = await prisma.order.update({
        where: {
            id: input.id
        },
        data: {
            status: input.status
        }
    })
    return orderById
}
