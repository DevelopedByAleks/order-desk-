import { notFound } from "next/navigation";
import { connection } from "next/server";
import { OrderDetails } from "@/modules/orders/components/order-details";
import { toOrderDto } from "@/modules/orders/mapper";
import { getOrder } from "@/modules/orders/service";

export default async function OrderPage({ params }: { params: Promise<{ id: string }> }) {
  await connection();
  const order = await getOrder(Number((await params).id));
  if (!order) notFound();
  return <OrderDetails order={toOrderDto(order)} />;
}
