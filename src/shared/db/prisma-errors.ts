import { Prisma } from "@/generated/prisma/client";
import { AppError } from "@/shared/errors";

// P1xxx — соединение, P2024 — таймаут пула; адаптер pg отдаёт и сетевые коды Node.
const UNAVAILABLE_CODES = new Set([
  "P1000", "P1001", "P1002", "P1008", "P1017", "P2024",
  "ECONNREFUSED", "ECONNRESET", "ETIMEDOUT", "ENOTFOUND",
]);

function translate(cause: unknown): unknown {
  if (cause instanceof Prisma.PrismaClientKnownRequestError) {
    if (cause.code === "P2025") return new AppError("not_found", "Запись не найдена.", { cause });
    if (UNAVAILABLE_CODES.has(cause.code)) return infrastructure(cause);
  }
  if (cause instanceof Prisma.PrismaClientInitializationError) return infrastructure(cause);
  return cause; // неизвестное остаётся как есть и станет "unknown" на границе
}

const infrastructure = (cause: unknown) =>
  new AppError("infrastructure", "Сервис временно недоступен. Попробуйте позже.", { cause });

/** Единственное место, где распознаются ошибки Prisma; оборачивает каждый запрос репозитория. */
export async function dbCall<T>(query: () => Promise<T>): Promise<T> {
  try {
    return await query();
  } catch (cause) {
    throw translate(cause);
  }
}
