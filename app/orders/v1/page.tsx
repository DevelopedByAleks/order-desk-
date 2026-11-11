import { OrderForm } from "../order-form"
import { OrdersView } from "../orders-view"

export default function OrdersV1Page() {
  return <OrdersView title="Заказы через Route Handler" Form={OrderForm} />
}
