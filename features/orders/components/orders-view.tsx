import { connection } from "next/server"
import { toOrderDTO } from "@/features/orders/mappers/order.mapper"
import { getOrders } from "@/features/orders/server/orders.queries"
import OrderList from "@/shared/ui/orders/List"
import OrdersNavigation from "@/shared/ui/orders/Navigation/navigation"

export default async function OrderView() {
    const orders = await getOrders()

    return (
        <>
            <h1>Заказы</h1>
            <OrdersNavigation />
            <OrderList
                orders={orders.map(toOrderDTO)}
            />
        </>
    )
}
