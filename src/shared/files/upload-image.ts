import { AppError } from "@/shared/errors";
import { detectImageType, MAX_IMAGE_BYTES } from "@/shared/files/image-signature";
import { saveFile } from "@/shared/files/storage";

/** Проверяет и сохраняет картинку; fileId — имя, сгенерированное сервером. */
export async function uploadImage(bytes: Uint8Array): Promise<{ fileId: string }> {
  const fail = (message: string) => new AppError("validation", message, { fieldErrors: { file: [message] } });

  if (bytes.length === 0) throw fail("Файл пустой.");
  if (bytes.length > MAX_IMAGE_BYTES) throw fail("Файл больше 2 МБ.");
  const type = detectImageType(bytes);
  if (!type) throw fail("Допустимы только изображения PNG и JPEG.");

  return { fileId: await saveFile(bytes, type.ext) };
}
