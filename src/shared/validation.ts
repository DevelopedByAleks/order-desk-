import { z } from "zod";
import { AppError } from "@/shared/errors";

/** Разбирает вход по Zod-схеме; при ошибке бросает AppError("validation") с ошибками по полям. */
export function parseInput<S extends z.ZodType>(schema: S, input: unknown): z.output<S> {
  const result = schema.safeParse(input);
  if (!result.success) {
    throw new AppError("validation", "Проверьте введённые данные.", {
      fieldErrors: z.flattenError(result.error).fieldErrors,
    });
  }
  return result.data;
}
