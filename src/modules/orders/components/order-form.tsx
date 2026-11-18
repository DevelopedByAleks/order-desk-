"use client";

import { useState, useTransition } from "react";
import { z } from "zod";
import { createOrderAction, updateOrderAction } from "@/app/orders/actions";
import { uploadImageAction } from "@/app/files/actions";
import { OrderStatus } from "@/generated/prisma/enums";
import { callAction } from "@/shared/action-client";
import type { ErrorKind, FieldErrors } from "@/shared/errors";
import { ImageUpload, type UploadState } from "@/shared/ui/image-upload";
import type { OrderDto } from "@/modules/orders/dto";
import { orderInputSchema } from "@/modules/orders/schema";

type Props = {
  order?: OrderDto; // есть — редактирование, нет — создание
  onSaved: () => void;
  onCancel?: () => void;
};

type SaveError = { kind: ErrorKind; message: string; fieldErrors?: FieldErrors };

// Две независимые части: загрузка файла (ImageUpload) и данные заказа (controlled-инпуты вне <form>).
export function OrderForm({ order, onSaved, onCancel }: Props) {
  const [status, setStatus] = useState<OrderStatus>(order?.status ?? OrderStatus.NEW);
  const [comment, setComment] = useState(order?.comment ?? "");
  const [upload, setUpload] = useState<UploadState>({ status: "idle" });
  const [saveError, setSaveError] = useState<SaveError | null>(null);
  const [saving, startSaving] = useTransition();

  const input = {
    status,
    comment,
    fileId: upload.status === "done" ? upload.fileId : undefined,
  };

  // Клиентская валидация (UX, не защита): та же схема, что и на сервере, считается на каждый рендер.
  const parsed = orderInputSchema.safeParse(input);
  const clientErrors: FieldErrors = parsed.success ? {} : z.flattenError(parsed.error).fieldErrors;
  const commentError = clientErrors.comment?.[0] ?? saveError?.fieldErrors?.comment?.[0];

  const canSave = parsed.success && upload.status !== "uploading" && !saving;

  function save() {
    setSaveError(null);
    startSaving(async () => {
      const result = await callAction(() =>
        order ? updateOrderAction(order.id, input) : createOrderAction(input),
      );
      if (result.success) onSaved();
      else setSaveError(result.error);
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <h2>{order ? `Заказ №${order.id}` : "Новый заказ"}</h2>

      <ImageUpload upload={uploadImageAction} currentImageUrl={order?.imageUrl} onStateChange={setUpload} />

      <label>
        Статус{" "}
        <select
          value={status}
          onChange={(e) => {
            const next = Object.values(OrderStatus).find((value) => value === e.target.value);
            if (next) setStatus(next);
            setSaveError(null);
          }}
        >
          {Object.values(OrderStatus).map((value) => (
            <option key={value}>{value}</option>
          ))}
        </select>
      </label>

      <label>
        Комментарий{" "}
        <input
          value={comment}
          onChange={(e) => {
            setComment(e.target.value);
            setSaveError(null);
          }}
        />
      </label>
      {commentError && <p role="alert">{commentError}</p>}

      <div className="flex gap-2">
        <button type="button" onClick={save} disabled={!canSave}>
          {saving ? "Сохранение…" : "Сохранить"}
        </button>
        {onCancel && <button type="button" onClick={onCancel}>Отмена</button>}
      </div>
      {saveError && <p role="alert">{saveError.message}</p>}
    </div>
  );
}
