"use client"

import { useActionState } from "react"
import { saveOrderFromForm } from "../actions"
import { OrderFields, type OrderFormProps } from "../order-fields"

export function ActionOrderForm({ order }: OrderFormProps) {
  const [result, action, pending] = useActionState(saveOrderFromForm.bind(null, order?.id), null)
  const error = !pending && result?.success === false ? result.error : null

  return (
    <form action={action}>
      <OrderFields order={order} error={error} pending={pending} upload />
    </form>
  )
}
