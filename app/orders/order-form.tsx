"use client";

import { useActionState } from "react";
import { OrderStatus } from "@/generated/prisma/enums";
import { createOrder, updateOrder } from "./actions";

type Props = {
  orderId?: number;
  status?: OrderStatus;
};

export function OrderForm({ orderId, status = OrderStatus.NEW }: Props) {
  const isNew = orderId === undefined;
  const action = isNew ? createOrder : updateOrder.bind(null, orderId);
  const [error, submit, pending] = useActionState(action, null);

  return (
    <form action={submit}>
      <label>
        {isNew ? "Начальный статус" : "Статус заказа №" + orderId}{" "}
        <select key={status} name="status" defaultValue={status}>
          {Object.values(OrderStatus).map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </label>{" "}
      <button disabled={pending}>
        {pending ? "Сохраняем…" : isNew ? "Создать" : "Сохранить"}
      </button>
      {error && <p role="alert">{error}</p>}
    </form>
  );
}
