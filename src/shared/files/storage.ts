import { randomUUID } from "node:crypto";
import { mkdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { AppError } from "@/shared/errors";
import { isStoredFileName } from "@/shared/files/image-types";

// Единственное место с fs. Знает только про байты и имена; про заказы и Prisma — ничего.
const UPLOAD_DIR = join(process.cwd(), "uploads");

const isMissing = (cause: unknown) => cause instanceof Error && "code" in cause && cause.code === "ENOENT";

const diskError = (cause: unknown) => new AppError("infrastructure", "Хранилище файлов недоступно.", { cause });

/** Путь строится только из имени проверенного формата — path traversal невозможен. */
function pathOf(name: string) {
  if (!isStoredFileName(name)) throw new Error(`Invalid stored file name: ${name}`);
  return join(UPLOAD_DIR, name);
}

/** Сохраняет байты под новым серверным именем и возвращает его. */
export async function saveFile(bytes: Uint8Array, ext: string): Promise<string> {
  const name = `${randomUUID()}.${ext}`;
  try {
    await mkdir(UPLOAD_DIR, { recursive: true });
    await writeFile(pathOf(name), bytes, { flag: "wx" });
    return name;
  } catch (cause) {
    throw diskError(cause);
  }
}

/** Байты файла или null, если файла нет. */
export async function readStoredFile(name: string): Promise<Uint8Array | null> {
  try {
    return new Uint8Array(await readFile(pathOf(name)));
  } catch (cause) {
    if (isMissing(cause)) return null;
    throw diskError(cause);
  }
}

export async function fileExists(name: string): Promise<boolean> {
  try {
    return (await stat(pathOf(name))).isFile();
  } catch (cause) {
    if (isMissing(cause)) return false;
    throw diskError(cause);
  }
}

export async function deleteFile(name: string): Promise<void> {
  try {
    await rm(pathOf(name), { force: true });
  } catch (cause) {
    throw diskError(cause);
  }
}
