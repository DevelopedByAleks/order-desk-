import { z } from "zod";
import { OrderStatus } from "@/generated/prisma/enums";

export const orderStatusSchema = z.enum(OrderStatus);
export const orderIdSchema = z.int32().positive();
