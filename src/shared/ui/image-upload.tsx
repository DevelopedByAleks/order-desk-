"use client";

import { useState, type ChangeEvent } from "react";
import { callAction } from "@/shared/action-client";
import type { ActionResult } from "@/shared/errors";
import { MAX_IMAGE_BYTES } from "@/shared/files/image-signature";

export type UploadState =
  | { status: "idle" }
  | { status: "uploading"; fileName: string }
  | { status: "done"; fileId: string; fileName: string }
  | { status: "error"; message: string };

type Props = {
  /** Серверная загрузка (Server Action) передаётся снаружи: компонент не зависит от роутов. */
  upload: (formData: FormData) => Promise<ActionResult<{ fileId: string }>>;
  currentImageUrl?: string | null;
  onStateChange: (state: UploadState) => void;
};

// Ничего не знает ни о заказе, ни об app/: выбирает файл, грузит его сразу и сообщает наружу своё состояние.
export function ImageUpload({ upload, currentImageUrl, onStateChange }: Props) {
  const [state, setState] = useState<UploadState>({ status: "idle" });

  const update = (next: UploadState) => {
    setState(next);
    onStateChange(next);
  };

  async function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return update({ status: "idle" });

    // Проверка размера на клиенте — только UX: файл крупнее лимита тела Server Action не дойдёт до сервера.
    if (file.size > MAX_IMAGE_BYTES) return update({ status: "error", message: "Файл больше 2 МБ." });

    update({ status: "uploading", fileName: file.name });
    const formData = new FormData();
    formData.set("file", file);
    const result = await callAction(() => upload(formData));

    update(
      result.success
        ? { status: "done", fileId: result.data.fileId, fileName: file.name }
        : { status: "error", message: result.error.message },
    );
  }

  return (
    <div>
      <label>
        Картинка (PNG или JPEG, до 2 МБ){" "}
        <input
          type="file"
          accept="image/png,image/jpeg"
          disabled={state.status === "uploading"}
          onChange={handleChange}
        />
      </label>
      {currentImageUrl && state.status !== "done" && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={currentImageUrl} alt="Текущая картинка" width={120} />
      )}
      {state.status === "uploading" && <p>Загружается: {state.fileName}…</p>}
      {state.status === "done" && <p>Загружено: {state.fileName}</p>}
      {state.status === "error" && <p role="alert">{state.message}</p>}
    </div>
  );
}
