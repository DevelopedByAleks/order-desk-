import { prisma } from "@/shared/db/prisma";
import { dbCall } from "@/shared/db/prisma-errors";
import type { OrderStatus } from "@/generated/prisma/enums";

// Единственное место, которое знает, как хранятся заказы.
export type OrderData = {
  status: OrderStatus;
  comment: string | null;
  imageFile?: string; // undefined = не менять
};

export const listOrders = () =>
  dbCall(() => prisma.order.findMany({ orderBy: [{ createdAt: "desc" }, { id: "desc" }] }));

export const findOrder = (id: number) => dbCall(() => prisma.order.findUnique({ where: { id } }));

export const insertOrder = (data: OrderData) => dbCall(() => prisma.order.create({ data }));

export const updateOrder = (id: number, data: OrderData) =>
  dbCall(() => prisma.order.update({ where: { id }, data }));
