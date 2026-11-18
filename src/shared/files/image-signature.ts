// Чистые функции без fs: безопасно импортировать и на клиенте.

export const MAX_IMAGE_BYTES = 2 * 1024 * 1024;

export type ImageType = { ext: "png" | "jpg"; mime: "image/png" | "image/jpeg" };

const PNG = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
const JPEG = [0xff, 0xd8, 0xff];

const startsWith = (bytes: Uint8Array, signature: number[]) =>
  bytes.length >= signature.length && signature.every((byte, i) => bytes[i] === byte);

/** Определяет реальный формат по первым байтам. Content-Type, имя и расширение клиента не используются. */
export function detectImageType(bytes: Uint8Array): ImageType | null {
  if (startsWith(bytes, PNG)) return { ext: "png", mime: "image/png" };
  if (startsWith(bytes, JPEG)) return { ext: "jpg", mime: "image/jpeg" };
  return null;
}
