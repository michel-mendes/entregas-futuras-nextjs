import { z } from 'zod';
import { DeliveryReceiptStatus } from '../domain/delivery-receipt.entity';

const objectIdSchema = z
    .string()
    .trim()
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid ObjectId format');

export const RecipientSchema = z.object({
    name: z.string().trim().min(2, 'Recipient name must have at least 2 characters'),
    address: z.string().trim().min(5, 'Recipient address must have at least 5 characters'),
    phone: z.string().trim().optional(),
});

export const DeliveryReceiptItemSchema = z.object({
    productId: objectIdSchema,
    batchId: z.string().trim().optional(),
    quantity: z
        .number({ message: 'Quantity must be a number' })
        .int('Quantity must be an integer')
        .positive('Quantity must be greater than zero'),
    itemNotes: z.string().trim().optional(),
});

export const CreateDeliveryReceiptSchema = z.object({
    futureDeliveryId: objectIdSchema,
    saleId: z.string().trim().min(1, 'Sale ID is required'),
    saleType: z.string().trim().min(1, 'Sale type is required'),
    deliveryNumber: z.string().trim().min(1, 'Delivery number is required'),
    deliveryDate: z.coerce.date({ message: 'Invalid delivery date format' }),
    recipient: RecipientSchema,
    notes: z.string().trim().optional(),
    items: z
        .array(DeliveryReceiptItemSchema)
        .min(1, 'At least one item is required for a delivery receipt'),
});

export const AddItemToReceiptSchema = DeliveryReceiptItemSchema;

export const DeliveryReceiptIdParamSchema = z.object({
    id: objectIdSchema,
});

export const ListDeliveryReceiptsQuerySchema = z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(10),
    futureDeliveryId: objectIdSchema.optional(),
    saleId: z.string().trim().optional(),
    deliveryNumber: z.string().trim().optional(),
    recipientName: z.string().trim().optional(),
    status: z
        .union([z.literal('ALL'), z.nativeEnum(DeliveryReceiptStatus)])
        .default('ALL')
        .optional(),
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
});

// Type Inferences
export type CreateDeliveryReceiptInput = z.infer<typeof CreateDeliveryReceiptSchema>;
export type AddItemToReceiptInput = z.infer<typeof AddItemToReceiptSchema>;
export type DeliveryReceiptIdParam = z.infer<typeof DeliveryReceiptIdParamSchema>;
export type ListDeliveryReceiptsQuery = z.infer<typeof ListDeliveryReceiptsQuerySchema>;