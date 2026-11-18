// Чистый модуль без fs: безопасно импортировать и на клиенте. Единственный источник правды о форматах.

export const MAX_IMAGE_BYTES = 2 * 1024 * 1024;

const IMAGE_TYPES = [
  { ext: "png", mime: "image/png", signature: [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a] },
  { ext: "jpg", mime: "image/jpeg", signature: [0xff, 0xd8, 0xff] },
] as const;

export type ImageType = (typeof IMAGE_TYPES)[number];

/** Имя, которое генерирует сервер: UUID + расширение из IMAGE_TYPES. */
export const STORED_FILE_NAME = new RegExp(
  `^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\\.(${IMAGE_TYPES.map((type) => type.ext).join("|")})$`,
);

export const isStoredFileName = (name: string) => STORED_FILE_NAME.test(name);

export const mimeOf = (name: string) =>
  IMAGE_TYPES.find((type) => name.endsWith(`.${type.ext}`))?.mime ?? "application/octet-stream";

/** Определяет реальный формат по первым байтам. Content-Type, имя и расширение клиента не используются. */
export function detectImageType(bytes: Uint8Array): ImageType | null {
  return IMAGE_TYPES.find(({ signature }) => signature.every((byte, i) => bytes[i] === byte)) ?? null;
}
