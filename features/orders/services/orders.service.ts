import { Prisma } from "@/generated/prisma/client"
import { OrderNotFoundError } from "@/features/orders/errors/order.errors"
import { createOrder, updateOrderStatus, type TCreateInput, type TChangeStatusInput } from "@/features/orders/server/orders.commands"

export async function createNewOrder(input: TCreateInput) {
  const order = await createOrder(input)
  return order
}

export async function changeOrderStatus(input: TChangeStatusInput) {
    try {
        return await updateOrderStatus(input)
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
            throw new OrderNotFoundError()
        }
        throw error
    }
}

