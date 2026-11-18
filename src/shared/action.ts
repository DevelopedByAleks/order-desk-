import { normalizeError, type ActionResult } from "@/shared/errors";

/** Единственное место, где «ошибка приложения → ActionResult». Используется всеми Server Actions. */
export async function runAction<T>(operation: () => Promise<T>): Promise<ActionResult<T>> {
  try {
    return { success: true, data: await operation() };
  } catch (cause) {
    const { kind, message, fieldErrors } = normalizeError(cause);
    return { success: false, error: { kind, message, fieldErrors } };
  }
}
