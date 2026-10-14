import { z } from 'zod';

export const DeliveryItemViewSchema = z.object({
    itemId: z.string().min(1, 'Item ID is required'),
    productId: z.string().min(1, 'Product ID is required'),
    description: z.string().min(1, 'Description is required'),
    remaining: z.number().positive('Remaining balance must be greater than zero'),
    qtyToDeliver: z.coerce
        .number('Quantity must be a valid number')
        .positive('Quantity must be greater than zero'),
    obs: z.string().optional().default(''),
}).refine((data) => data.qtyToDeliver <= data.remaining, {
    message: 'Quantity to deliver cannot exceed remaining balance',
    path: ['qtyToDeliver'],
});

export const DeliveryReceiptFormSchema = z.object({
    items: z.array(DeliveryItemViewSchema).min(1, 'At least one item must be added to the delivery receipt'),
});

export type DeliveryItemViewInput = z.infer<typeof DeliveryItemViewSchema>;
export type DeliveryReceiptFormInput = z.infer<typeof DeliveryReceiptFormSchema>;