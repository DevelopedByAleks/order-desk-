"use server"

import { OrderNotFoundError } from "@/features/orders/errors/order.errors"
import {
  ChangeOrderStatusSchema,
  CreateOrderSchema,
} from "@/features/orders/schemas/order.schema"

import {
  changeOrderStatus,
  createNewOrder,
} from "@/features/orders/services/orders.service"
import { mkdir, writeFile } from "node:fs/promises"

import { revalidatePath } from "next/cache"
import { randomUUID } from "node:crypto"
import path from "node:path"

type ActionState = {
  success: boolean
  error: string | null
}

type UploadResult =
  | { success: true url: string }
  | { success: false error: string }


export async function createOrderAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {

  const result = CreateOrderSchema.safeParse({
    comment: formData.get("comment"),
    imageFile: formData.get("imageFile") || undefined,
  })

  if (!result.success) {
    return {
      success: false,
      error: "Некорректные данные",
    }
  }
  await createNewOrder(result.data)

  revalidatePath("/orders")

  return {
    success: true,
    error: null,
  }
}

export async function changeOrderStatusAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {

  const result = ChangeOrderStatusSchema.safeParse({
    id: Number(formData.get("id")),
    status: formData.get("status"),
  })

  if (!result.success) {
    return {
      success: false,
      error: "Некорректные данные",
    }
  }

  try {
    await changeOrderStatus(result.data)

    revalidatePath("/orders")

    return {
      success: true,
      error: null,
    }

  } catch (error) {
    if (error instanceof OrderNotFoundError) {
      return {
        success: false,
        error: "Заказ не найден",
      }
    }

    throw error
  }
}


export async function uploadImageAction(
  formData: FormData
): Promise<UploadResult> {


  const file = formData.get("file")

  if (!(file instanceof File)) {
    return { success: false, error: "Файл не выбран" }
  }

  const allowedTypes: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
  }

  const extension = allowedTypes[file.type]

  if (!extension) {
    return { success: false, error: "Неверный формат" }
  }

  if (file.size === 0 || file.size > 5 * 1024 * 1024) {
    return { success: false, error: "Максимум 5 МБ" }
  }

  const filename = `${randomUUID()}.${extension}`

  const directory = path.join(
    process.cwd(),
    "public",
    "uploads"
  )

  await mkdir(directory, { recursive: true })

  const buffer = Buffer.from(await file.arrayBuffer())

  await writeFile(
    path.join(directory, filename),
    buffer
  )

  return {
    success: true,
    url: `/uploads/${filename}`,
  }
}