"use client"

import { useRouter } from "next/navigation"
import { useState, type SubmitEvent } from "react"
import type { ActionResult, FormError, OrderDTO } from "@/lib/types/orders"
import { readOrderForm } from "@/lib/validations/orders"
import { OrderFields, type OrderFormProps } from "./order-fields"

export function OrderForm({ order }: OrderFormProps) {
  const router = useRouter()
  const [error, setError] = useState<FormError | null>(null)
  const [pending, setPending] = useState(false)

  async function submit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    setError(null)
    setPending(true)
    try {
      const response = await fetch(order ? `/api/orders/${order.id}` : "/api/orders", {
        method: order ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(readOrderForm(new FormData(form))),
      })
      const result: ActionResult<OrderDTO> | null = await response.json().catch(() => null)
      if (!result || typeof result.success !== "boolean") {
        setError({ message: "Сервер вернул ответ в неожиданном формате." })
        return
      }
      if (!result.success) {
        setError(result.error)
        return
      }

      if (!order) form.reset()
      router.refresh()
    } catch {
      setError({ message: "Не удалось связаться с сервером. Проверьте подключение." })
    } finally {
      setPending(false)
    }
  }

  return (
    <form onSubmit={submit}>
      <OrderFields order={order} error={error} pending={pending} />
    </form>
  )
}
