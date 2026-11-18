"use client";

import { changeOrderStatusAction, createOrderAction } from "@/app/orders/actions";
import { OrderStatus } from "@/generated/prisma/enums";
import { useActionState } from "react";

type OrderFormProps =
  | { mode: "create" }
  | { mode: "status"; orderId: number; status?: OrderStatus };

export function OrderForm(props: OrderFormProps) {
  const isCreate = props.mode === "create";

  const action = isCreate
    ? createOrderAction
    : changeOrderStatusAction;

  const [state, formAction, pending] = useActionState(
    action,
    { success: false, error: null as string | null }
  );

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {props.mode === "create" ? (
        <>
          <input
            name="comment"
            placeholder="Комментарий"
          />

          <input
            name="imageFile"
            placeholder="Ссылка на изображение"
          />
        </>
      ) : (
        <>
          <input
            type="hidden"
            name="id"
            value={props.orderId}
          />

          <select name="status" defaultValue={props.status ?? OrderStatus.NEW}>
            {Object.values(OrderStatus).map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </>
      )}

      {state?.error && <p role="alert">{state.error}</p>}

      {state?.success && <p>Успешно сохранено</p>}

      <button type="submit" disabled={pending}>
        {pending
          ? "Сохранение..."
          : isCreate
            ? "Создать заказ"
            : "Изменить статус"}
      </button>
    </form>
  );
}
