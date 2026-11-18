"use server";

import { runAction } from "@/shared/action";
import { AppError } from "@/shared/errors";
import { uploadImage } from "@/shared/files/upload-image";

export async function uploadImageAction(formData: FormData) {
  return runAction(async () => {
    const file = formData.get("file");
    if (!(file instanceof File)) throw new AppError("validation", "Файл не передан.");
    return uploadImage(new Uint8Array(await file.arrayBuffer()));
  });
}
