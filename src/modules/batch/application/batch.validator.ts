import { z } from "zod";

const statusBatchSchema = z.enum(["ACTIVE", "INACTIVE", "ALL"], "Status must be 'ACTIVE', 'INACTIVE', or 'ALL'.");

export const createBatchSchema = z.object({
    productId: z.string().min(1, "Product ID cannot be empty"),
    warehouseId: z.string().min(1, "Warehouse ID cannot be empty"),
    gauge: z.number().int("Gauge must be an integer"),
    shade: z.number().int("Shade must be an integer"),
    initialQuantity: z.number().min(0.01, "Initial quantity must be greater than zero"),
    productionDate: z.date().optional(),
    batchNumber: z.string().optional(),
    detailedLocation: z.string().optional(),
    notes: z.string().optional()
});

export const searchBatchesSchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    productName: z.string().optional(),
    warehouseName: z.string().optional(),
    status: statusBatchSchema.optional()
});

export type CreateBatchDTO = z.infer<typeof createBatchSchema>;
export type SearchBatchesDTO = z.infer<typeof searchBatchesSchema>;