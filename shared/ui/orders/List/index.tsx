"use client"

import type { OrderDTO } from "@/features/orders/types/order.dto"
import { OrderForm } from "@/features/orders/components/order-form"
import { useDialog } from "@/shared/providers/Modal/modal.provider"

type Props = {
  orders: OrderDTO[]
}

export default function OrderList({ orders }: Props) {
  const { openDialog } = useDialog();

  return (
    <>
      <h2>Список заказов</h2>
      {orders.length === 0 ? <p>Заказов пока нет.</p> : (
        <ul className="space-y-6">
          {orders.map(order => (
            <li key={order.id}>
              <h3>Заказ №{order.id}</h3>
              <p>Создан: <time dateTime={order.createdAt}>{new Date(order.createdAt).toLocaleString("ru-RU")}</time></p>
              <p>Текущий статус: {order.status}</p>
              {order.comment && <p>Комментарий: {order.comment}</p>}
              {order.imageUrl && <img src={order.imageUrl} alt={`Изображение заказа №${order.id}`} width={120} />}
              <button type="button" onClick={() => openDialog(
                <OrderForm key={`status-${order.id}`} mode="status" orderId={order.id} status={order.status} />
              )}>
                  Изменить статус
              </button>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}
