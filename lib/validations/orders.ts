import { z } from "zod";
import { OrderStatus } from "@/generated/prisma/enums";

export const createOrderSchema = z.object({
  status: z.enum(OrderStatus).optional(),
});

export const updateOrderSchema = createOrderSchema.required({ status: true });
export const orderIdSchema = z.int32().positive();
