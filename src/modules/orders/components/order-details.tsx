"use client";

import Link from "next/link";
import { useState } from "react";
import { OrderForm } from "@/modules/orders/components/order-form";
import { OrderInfo } from "@/modules/orders/components/order-info";
import type { OrderDto } from "@/modules/orders/dto";

// Детальная страница: по умолчанию просмотр, по кнопке — та же форма, что и в модалке.
export function OrderDetails({ order }: { order: OrderDto }) {
  const [editing, setEditing] = useState(false);

  return (
    <>
      <Link href="/orders">← К списку</Link>
      {editing ? (
        <OrderForm order={order} onSaved={() => setEditing(false)} onCancel={() => setEditing(false)} />
      ) : (
        <>
          <h1>Заказ №{order.id}</h1>
          <OrderInfo order={order} />
          <button type="button" onClick={() => setEditing(true)}>Редактировать</button>
        </>
      )}
    </>
  );
}
