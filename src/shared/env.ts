import { z } from "zod";

/** Падает при старте с понятной ошибкой, если переменная окружения не задана или некорректна. */
export const env = z.object({ DATABASE_URL: z.url() }).parse(process.env);
