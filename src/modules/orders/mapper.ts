import type { Order } from "@/generated/prisma/client";
import type { OrderDto } from "@/modules/orders/dto";

// Только сервер: клиент импортирует dto.ts, но не этот файл.
export function toOrderDto(order: Order): OrderDto {
  return {
    id: order.id,
    status: order.status,
    createdAt: order.createdAt.toISOString(),
    comment: order.comment,
    // ?v=имя файла — сброс кэша браузера при замене картинки
    imageUrl: order.imageFile ? `/api/orders/${order.id}/image?v=${order.imageFile}` : null,
  };
}
