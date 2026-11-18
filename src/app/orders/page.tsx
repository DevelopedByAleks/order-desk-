import { connection } from "next/server";
import { OrdersView } from "@/modules/orders/components/orders-view";
import { toOrderDto } from "@/modules/orders/mapper";
import { listOrders } from "@/modules/orders/service";

export default async function OrdersPage() {
  await connection(); // данные из БД: не пререндерить на сборке
  const orders = await listOrders();
  return <OrdersView orders={orders.map(toOrderDto)} />;
}
