import { fileURLToPath } from "node:url";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: { root: fileURLToPath(new URL(".", import.meta.url)) },
  experimental: {
    // Больше MAX_IMAGE_BYTES (2 МБ): файл 2–3 МБ доходит до серверной валидации и получает наше сообщение.
    serverActions: { bodySizeLimit: "3mb" },
  },
};

export default nextConfig;
