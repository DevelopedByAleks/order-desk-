import { OrdersView } from "@/modules/orders/components/orders-view";
import { toOrderDto } from "@/modules/orders/mapper";
import { listOrders } from "@/modules/orders/service";

// Данные из БД: рендерим на каждый запрос, а не на сборке.
export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  const orders = await listOrders();
  return <OrdersView orders={orders.map(toOrderDto)} />;
}
