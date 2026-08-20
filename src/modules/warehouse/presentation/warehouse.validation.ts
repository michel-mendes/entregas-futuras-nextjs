import { z } from "zod";

export const createWarehouseValidationSchema = z.object({
    name: z.string("'name' is required.")
        .trim()
        .min(1, "'name' cannot be empty."),

    sector: z.string("'sector' is required")
        .trim()
        .min(1, "'sector' cannot be empty."),

    isActive: z.boolean("'isActive' must be a boolean.")
        .optional()
        .default(true)
});

const warehouseStatusEnum = z.enum(["ACTIVE", "INACTIVE", "ALL"], "Status must be 'ACTIVE', 'INACTIVE', or 'ALL'.");

export const listWarehousesValidationSchema = z.object({
    page: z.coerce.number("Page must be a valid number.")
        .int("Page must be an integer.")
        .min(1, "Page must be 1 or greater.")
        .default(1),

    limit: z.coerce.number("Limit must be a valid number.")
        .int("Limit must be an integer.")
        .min(1, "Limit must be 1 or greater.")
        .max(100, "Limit cannot exceed 100.")
        .default(10),

    name: z.string().trim().optional(),
    sector: z.string().trim().optional(),
    status: warehouseStatusEnum.optional()
});

export const updateWarehouseValidationSchema = z.object({
    name: z.string("'name' must be a string.")
        .trim()
        .min(1, "'name' cannot be empty."),

    sector: z.string("'sector' must be a string.")
        .trim()
        .min(1, "'sector' cannot be empty.")
});

export type CreateWarehouseDTO = z.infer<typeof createWarehouseValidationSchema>;
export type ListWarehousesDTO = z.infer<typeof listWarehousesValidationSchema>;
export type UpdateWarehouseDTO = z.infer<typeof updateWarehouseValidationSchema>;