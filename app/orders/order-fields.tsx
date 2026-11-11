import { useId, useState } from "react"
import { OrderStatus } from "@/generated/prisma/enums"
import type { FormError, OrderDTO } from "@/lib/types/orders"
import { validateOrderInput } from "@/lib/validations/orders"

export type OrderFormProps = { order?: OrderDTO }
export type OrderValues = { status: string; comment: string }

export function initialOrderValues(order?: OrderDTO): OrderValues {
  return { status: order?.status ?? OrderStatus.NEW, comment: order?.comment ?? "" }
}

type Props = OrderFormProps & {
  error: FormError | null
  pending: boolean
  upload?: boolean
  controlled?: {
    values: OrderValues
    onChange: (field: keyof OrderValues, value: string) => void
  }
}

export function OrderFields({ order, error, pending, upload, controlled }: Props) {
  const id = useId()
  const defaults = initialOrderValues(order)
  const [messages, setMessages] = useState({ status: "", comment: "", image: "" })
  const statusError = messages.status || error?.fieldErrors?.status?.[0]
  const commentError = messages.comment || error?.fieldErrors?.comment?.[0]
  const imageError = messages.image || error?.fieldErrors?.image?.[0]

  function checkField(
    input: HTMLSelectElement | HTMLTextAreaElement | HTMLInputElement,
    value: string | File | undefined,
  ) {
    const field = input.name
    const result = validateOrderInput({ [field]: value })
    const message = result.success ? "" : result.error.fieldErrors?.[field]?.[0] ?? result.error.message
    input.setCustomValidity(message)
    setMessages(previous => ({ ...previous, [field]: message }))
  }

  return (
    <>
      <div>
        <label htmlFor={id + "-status"}>{order ? `Статус заказа №${order.id}` : "Начальный статус"}</label>{" "}
        <select
          id={id + "-status"}
          name="status"
          required
          key={order?.status}
          value={controlled?.values.status}
          defaultValue={controlled ? undefined : defaults.status}
          onChange={event => {
            const input = event.currentTarget
            controlled?.onChange("status", input.value)
            checkField(input, input.value)
          }}
          aria-invalid={!!statusError}
          aria-describedby={statusError ? id + "-status-error" : undefined}
        >
          {Object.values(OrderStatus).map(status => <option key={status}>{status}</option>)}
        </select>
        {statusError && <p id={id + "-status-error"} role="alert">{statusError}</p>}
      </div>
      <div>
        <label htmlFor={id + "-comment"}>Комментарий</label>{" "}
        <textarea
          id={id + "-comment"}
          name="comment"
          key={order?.comment ?? ""}
          value={controlled?.values.comment}
          defaultValue={controlled ? undefined : defaults.comment}
          onChange={event => {
            const input = event.currentTarget
            controlled?.onChange("comment", input.value)
            checkField(input, input.value)
          }}
          aria-invalid={!!commentError}
          aria-describedby={commentError ? id + "-comment-error" : undefined}
        />
        {commentError && <p id={id + "-comment-error"} role="alert">{commentError}</p>}
      </div>
      {upload && (
        <div>
          <label htmlFor={id + "-image"}>{order?.imageUrl ? "Заменить изображение" : "Изображение"}</label>{" "}
          <input
            id={id + "-image"}
            name="image"
            type="file"
            accept="image/png,image/jpeg"
            onChange={event => {
              const input = event.currentTarget
              checkField(input, input.files?.[0])
            }}
            aria-invalid={!!imageError}
            aria-describedby={imageError ? id + "-image-error" : undefined}
          />
          {imageError && <p id={id + "-image-error"} role="alert">{imageError}</p>}
        </div>
      )}
      <button type="submit" disabled={pending}>
        {pending ? "Сохраняем…" : order ? "Сохранить" : "Создать"}
      </button>
      {error && !statusError && !commentError && !imageError && <p role="alert">{error.message}</p>}
    </>
  )
}
