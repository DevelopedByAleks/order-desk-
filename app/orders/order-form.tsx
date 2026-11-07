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
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const { url, method, label, buttonText } = orderId === undefined
    ? {
        url: "/api/orders",
        method: "POST",
        label: "Начальный статус",
        buttonText: "Создать",
      }
    : {
        url: `/api/orders/${orderId}`,
        method: "PATCH",
        label: `Статус заказа №${orderId}`,
        buttonText: "Сохранить",
      };

  async function submit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const selectedStatus = new FormData(form).get("status");
    setError(null);
    setPending(true);

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: selectedStatus }),
      });

      if (!response.ok) {
        const body: { error?: string } | null = await response.json().catch(() => null);
        setError(body?.error ?? "Не удалось сохранить заказ.");
        return;
      }

      if (method === "POST") form.reset();
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
        {label}{" "}
        <select key={status} name="status" defaultValue={status}>
          {Object.values(OrderStatus).map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </label>{" "}
      <button type="submit" disabled={pending}>
        {pending ? "Сохраняем…" : buttonText}
      </button>
      {error && <p role="alert">{error}</p>}
    </form>
  );
}
