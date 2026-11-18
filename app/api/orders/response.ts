import { Prisma } from "@/generated/prisma/client"
import { OrderNotFoundError } from "@/features/orders/errors/order.errors"

export function invalidOrder(fieldErrors: Record<string, string[]> = {}) {
  return Response.json({
    success: false,
    error: { kind: "validation", message: "Проверьте данные заказа.", fieldErrors },
  }, { status: 400 })
}

export function orderRequestError(error: unknown) {
  if (error instanceof OrderNotFoundError) {
    return Response.json({
      success: false,
      error: { kind: "not_found", message: error.message },
    }, { status: 404 })
  }

  console.error(error)
  const connectionErrors = ["P1000", "P1001", "P1002", "P1003", "P1008", "P1011", "P1017", "P2024", "P2037"]
  if (error instanceof Prisma.PrismaClientInitializationError ||
    (error instanceof Prisma.PrismaClientKnownRequestError && connectionErrors.includes(error.code))) {
    return Response.json({
      success: false,
      error: { kind: "infrastructure", message: "Сервис временно недоступен." },
    }, { status: 503 })
  }

  return Response.json({
    success: false,
    error: { kind: "unknown", message: "Не удалось выполнить операцию. Попробуйте ещё раз." },
  }, { status: 500 })
}
