import type { ComponentType } from "react"
import Link from "next/link"
import { connection } from "next/server"
import OrderList from "@/components/orders/list"
import { toOrderDTO } from "@/lib/mappers/order.mapper"
import { listOrders } from "@/lib/orders"
import type { OrderFormProps } from "./order-fields"

type Props = {
  title: string
  Form: ComponentType<OrderFormProps>
  index?: boolean
}

export async function OrdersView({ title, Form, index }: Props) {
  await connection()
  const orders = await listOrders().catch(error => {
    console.error(error)
    throw new Error("Не удалось загрузить заказы.")
  })

  return (
    <>
      <h1>{title}</h1>
      {index ? (
        <nav aria-label="Варианты формы">
          <ul>
            <li><Link href="/orders/v1">1. Route Handler</Link></li>
            <li><Link href="/orders/v2">2. Server Action и загрузка изображения</Link></li>
            <li><Link href="/orders/v3">3. Управляемая форма</Link></li>
          </ul>
        </nav>
      ) : <Link href="/orders">Все варианты формы</Link>}
      <h2>Новый заказ</h2>
      <Form />
      <OrderList orders={orders.map(toOrderDTO)} renderForm={order => <Form order={order} />} />
    </>
  )
}
