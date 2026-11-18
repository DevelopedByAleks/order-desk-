import type { OrderDto } from "@/modules/orders/dto";

// Режим просмотра заказа: общий для списка и детальной страницы.
export function OrderInfo({ order }: { order: OrderDto }) {
  return (
    <dl>
      <dt>Создан</dt>
      <dd><time dateTime={order.createdAt}>{new Date(order.createdAt).toLocaleString("ru-RU")}</time></dd>
      <dt>Статус</dt>
      <dd>{order.status}</dd>
      <dt>Комментарий</dt>
      <dd>{order.comment ?? "—"}</dd>
      {order.imageUrl && (
        <>
          <dt>Картинка</dt>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <dd><img src={order.imageUrl} alt={`Заказ №${order.id}`} width={120} /></dd>
        </>
      )}
    </dl>
  );
}
