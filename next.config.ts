import { fileURLToPath } from "node:url";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: { root: fileURLToPath(new URL(".", import.meta.url)) },
  experimental: {
    // Лимит на тело Server Action (по умолчанию 1 МБ). Максимум картинки — 2 МБ (MAX_IMAGE_BYTES),
    // multipart добавляет накладные расходы, поэтому с запасом: файл 2–3 МБ доходит до нашей
    // валидации и получает наше сообщение. Файлы крупнее отсекает клиент до отправки.
    serverActions: { bodySizeLimit: "3mb" },
  },
};

export default nextConfig;
