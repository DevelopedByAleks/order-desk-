import { OrdersView } from "../orders-view"
import { ActionOrderForm } from "./order-form"

export default function OrdersV2Page() {
  return <OrdersView title="Заказы через форму с Server Action" Form={ActionOrderForm} />
}
