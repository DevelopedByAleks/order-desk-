import type { ActionResult } from "@/shared/errors";

/**
 * Клиентская обёртка над вызовом Server Action. Action возвращает ожидаемые ошибки значением,
 * а исключение означает, что запрос не дошёл (нет сети, сервер недоступен, превышен лимит тела).
 */
export async function callAction<T>(call: () => Promise<ActionResult<T>>): Promise<ActionResult<T>> {
  try {
    return await call();
  } catch {
    return {
      success: false,
      error: { kind: "unknown", message: "Не удалось связаться с сервером. Проверьте соединение и повторите." },
    };
  }
}
