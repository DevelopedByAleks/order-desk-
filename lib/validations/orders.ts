import { z } from "zod";
import { OrderStatus } from "@/generated/prisma/enums";

const orderStatusSchema = z.enum(OrderStatus);

export const createOrderSchema = z.object({
  status: orderStatusSchema.default(OrderStatus.NEW),
});

export const updateOrderSchema = z.object({
  status: orderStatusSchema,
});

export const orderIdSchema = z.int32().positive();
