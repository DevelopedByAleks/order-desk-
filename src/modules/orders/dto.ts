import type { OrderStatus } from "@/generated/prisma/enums";

// Выход: сервер → UI. Обычный тип без Zod; значения переживают JSON/RSC-сериализацию.
export type OrderDto = {
  id: number;
  status: OrderStatus;
  createdAt: string; // ISO
  comment: string | null;
  imageUrl: string | null;
};
