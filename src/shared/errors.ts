export type ErrorKind = "validation" | "not_found" | "infrastructure" | "unknown";

export type FieldErrors = Record<string, string[] | undefined>;

export type ActionResult<T> =
  | { success: true; data: T }
  | {
    success: false;
    error: { kind: ErrorKind; message: string; fieldErrors?: FieldErrors };
  };

/**
 * Ожидаемая ошибка приложения. Инвариант: `message` безопасен для показа клиенту,
 * всё внутреннее (текст БД, stack) живёт в `cause` и попадает только в лог.
 */
export class AppError extends Error {
  readonly kind: ErrorKind;
  readonly fieldErrors?: FieldErrors;

  constructor(
    kind: ErrorKind,
    message: string,
    options?: { fieldErrors?: FieldErrors; cause?: unknown },
  ) {
    super(message, { cause: options?.cause });
    this.name = "AppError";
    this.kind = kind;
    this.fieldErrors = options?.fieldErrors;
  }
}

/** Приводит что угодно к AppError; неожиданные и инфраструктурные ошибки пишет в лог. */
export function normalizeError(error: unknown): AppError {
  const appError =
    error instanceof AppError
      ? error
      : new AppError("unknown", "Что-то пошло не так. Попробуйте позже.", { cause: error });

  if (appError.kind === "infrastructure" || appError.kind === "unknown") {
    console.error(appError);
  }
  return appError;
}
