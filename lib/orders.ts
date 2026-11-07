import { prisma } from "@/lib/prisma";

export function listOrders() {
  return prisma.order.findMany({
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
  });
}
