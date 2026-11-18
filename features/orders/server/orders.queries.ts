import { prisma } from "@/features/prisma";

export async function getOrders() {
    const orders = await prisma.order.findMany({
        orderBy: [{ createdAt: "desc" }, { id: "desc" }]
    })
    return orders
}

export async function getOrderById(id:number) {
    const order = await prisma.order.findUnique({
        where: {id}
    })
    return order
}

export async function getArrayOfOrders(ids:number[]) {
    const ordersbyrequest = await prisma.order.findMany({
        where: {
            id: {
                in: ids
            }
        }
    })
    return ordersbyrequest
}
