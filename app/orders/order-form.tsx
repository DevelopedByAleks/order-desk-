"use client";

import { useRouter } from "next/navigation";
import { useState, type SubmitEvent } from "react";
import { OrderStatus } from "@/generated/prisma/enums";

type Props = {
  orderId?: number;
  status?: OrderStatus;
};

export function OrderForm({ orderId, status = OrderStatus.NEW }: Props) {
  const router = useRouter();
  const isNew = orderId === undefined;
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function submit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const status = new FormData(form).get("status");
    setError(null);
    setPending(true);

    try {
      const response = await fetch(isNew ? "/api/orders" : "/api/orders/" + orderId, {
        method: isNew ? "POST" : "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        const body: { error?: string } | null = await response.json().catch(() => null);
        setError(body?.error ?? "Не удалось сохранить заказ.");
        return;
      }

      if (isNew) form.reset();
      router.refresh();
    } catch {
      setError("Не удалось связаться с сервером. Попробуйте ещё раз.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={submit}>
      <label>
        {isNew ? "Начальный статус" : "Статус заказа №" + orderId}{" "}
        <select key={status} name="status" defaultValue={status}>
          {Object.values(OrderStatus).map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </label>{" "}
      <button type="submit" disabled={pending}>
        {pending ? "Сохраняем…" : isNew ? "Создать" : "Сохранить"}
      </button>
      {error && <p role="alert">{error}</p>}
    </form>
  );
}
