import { z } from "zod";
import { OrderStatus } from "@/generated/prisma/enums"; // чистые константы, без Prisma Client
import { STORED_FILE_NAME } from "@/shared/files/image-types";

const MIN_COMMENT_LENGTH = 3;
const MAX_COMMENT_BYTES = 250;

// Одна схема для формы и сервера: серверных импортов быть не должно.
export const orderInputSchema = z.object({
  status: z.enum(OrderStatus, "Выберите статус из списка."),
  // Пустая строка (после trim) = «нет комментария».
  comment: z
    .string()
    .trim()
    .superRefine((value, ctx) => {
      if (value === "") return;
      if (value.length < MIN_COMMENT_LENGTH) {
        ctx.addIssue({ code: "custom", message: `Минимум ${MIN_COMMENT_LENGTH} символа.` });
      }
      if (new TextEncoder().encode(value).length > MAX_COMMENT_BYTES) {
        ctx.addIssue({ code: "custom", message: `Не больше ${MAX_COMMENT_BYTES} байт (кириллица — 2 байта на символ).` });
      }
    })
    .optional(),
  fileId: z.string().regex(STORED_FILE_NAME, "Некорректный идентификатор файла.").optional(),
});

export type OrderInput = z.input<typeof orderInputSchema>;

export const orderIdSchema = z.int().positive();
