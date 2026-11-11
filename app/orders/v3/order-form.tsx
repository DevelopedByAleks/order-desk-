"use client"

import { useState, useTransition, type SubmitEvent } from "react"
import type { FormError } from "@/lib/types/orders"
import { saveOrderFromFields } from "../actions"
import { initialOrderValues, OrderFields, type OrderFormProps } from "../order-fields"

export function ControlledOrderForm({ order }: OrderFormProps) {
  const [values, setValues] = useState(() => initialOrderValues(order))
  const [error, setError] = useState<FormError | null>(null)
  const [pending, startTransition] = useTransition()

  function submit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)

    startTransition(async () => {
      try {
        const result = await saveOrderFromFields(order?.id, values)
        if (!result.success) {
          setError(result.error)
          return
        }
        setValues(initialOrderValues(order ? result.data : undefined))
      } catch {
        setError({ message: "Не удалось связаться с сервером. Проверьте подключение." })
      }
    })
  }

  return (
    <form onSubmit={submit}>
      <OrderFields
        order={order}
        error={error}
        pending={pending}
        controlled={{
          values,
          onChange: (field, value) => setValues(previous => ({ ...previous, [field]: value })),
        }}
      />
    </form>
  )
}
