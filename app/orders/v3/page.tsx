import { OrdersView } from "../orders-view"
import { ControlledOrderForm } from "./order-form"

export default function OrdersV3Page() {
  return <OrdersView title="Заказы через управляемую форму" Form={ControlledOrderForm} />
}
