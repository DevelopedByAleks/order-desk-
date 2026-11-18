import { AppError } from "@/shared/errors";
import { parseInput } from "@/shared/validation";
import { deleteFile, fileExists, readStoredFile } from "@/shared/files/storage";
import { mimeOf } from "@/shared/files/image-types";
import { orderIdSchema, orderInputSchema } from "@/modules/orders/schema";
import * as repository from "@/modules/orders/repository";

const notFound = () => new AppError("not_found", "Заказ не найден.");

export const listOrders = repository.listOrders;

/** null — и для несуществующего, и для некорректного id. */
export async function getOrder(id: number) {
  const parsed = orderIdSchema.safeParse(id);
  return parsed.success ? repository.findOrder(parsed.data) : null;
}

export async function getOrderImage(id: number) {
  const name = (await getOrder(id))?.imageFile;
  if (!name) return null;
  const bytes = await readStoredFile(name);
  return bytes && { bytes, mime: mimeOf(name) };
}

/** fileId пришёл от клиента: формат проверила схема, существование проверяем здесь. */
async function parseOrderInput(input: unknown) {
  const { status, comment, fileId } = parseInput(orderInputSchema, input);
  if (fileId && !(await fileExists(fileId))) {
    throw new AppError("validation", "Загруженный файл не найден. Загрузите его заново.", {
      fieldErrors: { fileId: ["Загруженный файл не найден."] },
    });
  }
  return { status, comment: comment || null, imageFile: fileId };
}

export async function createOrder(input: unknown) {
  return repository.insertOrder(await parseOrderInput(input));
}

export async function updateOrder(id: number, input: unknown) {
  const data = await parseOrderInput(input);
  const current = await getOrder(id);
  if (!current) throw notFound();

  const updated = await repository.updateOrder(current.id, data);

  // Старый файл удаляем после записи в БД; сбой удаления не валит запрос.
  if (current.imageFile && data.imageFile && current.imageFile !== data.imageFile) {
    await deleteFile(current.imageFile).catch((error) => console.warn("Failed to delete old image", error));
  }
  return updated;
}
