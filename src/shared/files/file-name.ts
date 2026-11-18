// Формат имён, которые генерирует сервер (UUID v4 + расширение). Чистый модуль: его использует и Zod-схема.

export const STORED_FILE_NAME = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.(png|jpg)$/;

export const isStoredFileName = (name: string) => STORED_FILE_NAME.test(name);

export const mimeOf = (name: string) => (name.endsWith(".png") ? "image/png" : "image/jpeg");
