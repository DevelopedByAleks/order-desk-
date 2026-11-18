"use client";

import Link from "next/link";
import { useDialog } from "@/shared/providers/dialog-provider";
import { OrderForm } from "@/modules/orders/components/order-form";
import { OrderInfo } from "@/modules/orders/components/order-info";
import type { OrderDto } from "@/modules/orders/dto";

// Получает только DTO через props: не знает, откуда данные.
export function OrdersView({ orders }: { orders: OrderDto[] }) {
  const { openDialog, closeDialog } = useDialog();

  return (
    <>
      <h1>Заказы</h1>
      <button type="button" onClick={() => openDialog(<OrderForm onSaved={closeDialog} onCancel={closeDialog} />)}>
        Создать заказ
      </button>

      {orders.length === 0 ? (
        <p>Заказов пока нет.</p>
      ) : (
        <ul className="space-y-6">
          {orders.map((order) => (
            <li key={order.id}>
              <h2><Link href={`/orders/${order.id}`}>Заказ №{order.id}</Link></h2>
              <OrderInfo order={order} />
              <button
                type="button"
                onClick={() => openDialog(<OrderForm order={order} onSaved={closeDialog} onCancel={closeDialog} />)}
              >
                Редактировать
              </button>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
