import { notFound } from "next/navigation";
import { OrderDetails } from "@/modules/orders/components/order-details";
import { toOrderDto } from "@/modules/orders/mapper";
import { getOrder } from "@/modules/orders/service";

// Данные из БД: рендерим на каждый запрос, а не на сборке.
export const dynamic = "force-dynamic";

export default async function OrderPage({ params }: { params: Promise<{ id: string }> }) {
  const order = await getOrder(Number((await params).id));
  if (!order) notFound();
  return <OrderDetails order={toOrderDto(order)} />;
}
