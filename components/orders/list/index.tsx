import type { ReactNode } from "react"
import type { OrderDTO } from "@/lib/types/orders"

type Props = {
  orders: OrderDTO[]
  renderForm: (order: OrderDTO) => ReactNode
}

export default function OrderList({ orders, renderForm }: Props) {
  return (
    <>
      <h2>Список заказов</h2>
      {orders.length === 0 ? <p>Заказов пока нет.</p> : (
        <ul>
          {orders.map(order => (
            <li key={order.id}>
              <h3>Заказ №{order.id}</h3>
              <p>Создан: <time dateTime={order.createdAt}>{new Date(order.createdAt).toLocaleString("ru-RU")}</time></p>
              <p>Текущий статус: {order.status}</p>
              {order.comment && <p>Комментарий: {order.comment}</p>}
              {order.imageUrl && <img src={order.imageUrl} alt={`Изображение заказа №${order.id}`} width={120} />}
              {renderForm(order)}
            </li>
          ))}
        </ul>
      )}
    </>
  )
}
