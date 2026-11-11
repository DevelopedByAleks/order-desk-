import { OrderForm } from "./order-form"
import { OrdersView } from "./orders-view"

export default function OrdersPage() {
  return <OrdersView title="Заказы" Form={OrderForm} index />
}
