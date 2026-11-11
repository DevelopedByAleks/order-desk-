import { Prisma } from "@/generated/prisma/client"
import { toOrderDTO } from "@/lib/mappers/order.mapper"
import { readOrderImage, removeOrderImage, saveOrderImage } from "@/lib/order-images"
import { prisma } from "@/lib/prisma"
import type { ActionResult, OrderDTO, OrderError } from "@/lib/types/orders"
import { invalidFields, isOrderId, validateOrderInput } from "@/lib/validations/orders"

export const errorStatus = {
  validation: 400,
  not_found: 404,
  infrastructure: 503,
  unknown: 500,
}

const connectionErrors = ["P1000", "P1001", "P1002", "P1003", "P1008", "P1011", "P1017", "P2024", "P2037"]

export function orderError(error: unknown): OrderError {
  const code = error instanceof Prisma.PrismaClientKnownRequestError ? error.code : ""
  if (code === "P2025") return { kind: "not_found", message: "Заказ не найден." }

  console.error(error)
  if (error instanceof Prisma.PrismaClientInitializationError || connectionErrors.includes(code)) {
    return { kind: "infrastructure", message: "Сервис временно недоступен." }
  }
  return { kind: "unknown", message: "Не удалось выполнить операцию. Попробуйте ещё раз." }
}

async function removeUnusedImage(imageFile: string) {
  try {
    const order = await prisma.order.findFirst({ where: { imageFile }, select: { id: true } })
    if (!order) await removeOrderImage(imageFile)
  } catch (error) {
    console.error(error)
  }
}

export function listOrders() {
  return prisma.order.findMany({
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
  })
}

export async function saveOrder(
  input: unknown,
  orderId?: number,
  { allowImage = false } = {},
): Promise<ActionResult<OrderDTO>> {
  if (orderId !== undefined && !isOrderId(orderId)) {
    return invalidFields({ id: ["Некорректный ID заказа."] })
  }

  const parsed = validateOrderInput(input, orderId !== undefined)
  if (!parsed.success) return parsed

  const { image, ...data } = parsed.data
  let imageFile: string | undefined
  if (image) {
    if (!allowImage) {
      return invalidFields({ image: ["Изображение можно загрузить через форму v2."] })
    }
    try {
      const name = await saveOrderImage(image)
      if (!name) return invalidFields({ image: ["Загрузите изображение PNG или JPEG."] })
      imageFile = name
    } catch (error) {
      console.error(error)
      return { success: false, error: { kind: "infrastructure", message: "Не удалось сохранить изображение." } }
    }
  }

  try {
    if (orderId === undefined) {
      const order = await prisma.order.create({ data: { ...data, imageFile } })
      return { success: true, data: toOrderDTO(order) }
    }
    if (imageFile === undefined) {
      const order = await prisma.order.update({ where: { id: orderId }, data })
      return { success: true, data: toOrderDTO(order) }
    }

    const newImage = imageFile
    const { order, previousImage } = await prisma.$transaction(async tx => {
      const previous = await tx.order.findUniqueOrThrow({
        where: { id: orderId },
        select: { imageFile: true },
      })
      const order = await tx.order.update({
        where: { id: orderId },
        data: { ...data, imageFile: newImage },
      })
      return { order, previousImage: previous.imageFile }
    }, { isolationLevel: "Serializable" })
    await removeOrderImage(previousImage)
    return { success: true, data: toOrderDTO(order) }
  } catch (error) {
    if (imageFile) await removeUnusedImage(imageFile)
    return { success: false, error: orderError(error) }
  }
}

export async function getOrderImage(id: number) {
  const order = await prisma.order.findUnique({ where: { id }, select: { imageFile: true } })
  return order?.imageFile ? readOrderImage(order.imageFile) : null
}
