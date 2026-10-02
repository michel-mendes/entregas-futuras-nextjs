import { z } from 'zod';
import { FutureDeliveryStatus } from '../domain/future-delivery.entity';

// Mongo ObjectId string validation helper
const objectIdSchema = z
    .string()
    .trim()
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid ObjectId format');

export const PartialItemDeliverySchema = z.object({
    productId: objectIdSchema,
    quantityToDeliver: z
        .number('Quantity to deliver must be a number')
        .int('Quantity to deliver must be an integer')
        .positive('Quantity to deliver must be greater than zero'),
});

export const CustomerSchema = z.object({
    name: z.string().trim().min(2, 'Customer name must have at least 2 characters'),
    document: z
        .string()
        .trim()
        .min(11, 'Document must be a valid CPF or CNPJ')
        .max(14, 'Document must be a valid CPF or CNPJ'),
    phone: z.string().trim().min(8, 'Phone number is required'),
});

export const DeliveryAddressSchema = z.object({
    zipCode: z.string().trim().min(8, 'Zip code must have at least 8 digits'),
    street: z.string().trim().min(1, 'Street is required'),
    number: z.string().trim().min(1, 'Number is required'),
    complement: z.string().trim().optional(),
    neighborhood: z.string().trim().min(1, 'Neighborhood is required'),
    city: z.string().trim().min(1, 'City is required'),
    state: z.string().trim().length(2, 'State must be a 2-letter UF code').toUpperCase(),
});

export const FutureDeliveryItemSchema = z
    .object({
        productId: objectIdSchema,
        description: z.string().trim().min(1, 'Product description is required'),
        purchasedQuantity: z
            .number('Purchased quantity must be a number')
            .int('Purchased quantity must be an integer')
            .positive('Purchased quantity must be greater than zero'),
        deliveredQuantity: z
            .number('Delivered quantity must be a number')
            .int('Delivered quantity must be an integer')
            .nonnegative('Delivered quantity cannot be negative')
            .default(0),
    })
    .superRefine((data, ctx) => {
        if (data.deliveredQuantity > data.purchasedQuantity) {
            ctx.addIssue({
                code: 'custom',
                message: 'Delivered quantity cannot exceed purchased quantity.',
                path: ['deliveredQuantity'],
            });
        }
    });

export const CreateFutureDeliverySchema = z.object({
    customer: CustomerSchema,
    deliveryAddress: DeliveryAddressSchema,
    items: z
        .array(FutureDeliveryItemSchema)
        .min(1, 'At least one item is required for future delivery'),
});

export const UpdateDeliveryAddressSchema = DeliveryAddressSchema;

export const RegisterPartialItemDeliverySchema = z.object({
    itemsToDeliver: z.array(PartialItemDeliverySchema).min(1, 'At least one item is required for future delivery'),
});

export const FutureDeliveryIdParamSchema = z.object({
    id: objectIdSchema,
});

export const ListFutureDeliveriesQuerySchema = z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(10),
    customerName: z.string().trim().optional(),
    customerDocument: z.string().trim().optional(),
    status: z
        .union([z.literal('ALL'), z.enum(FutureDeliveryStatus)])
        .default('ALL')
        .optional(),
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
});


export type CreateFutureDeliveryInput = z.infer<typeof CreateFutureDeliverySchema>;
export type UpdateDeliveryAddressInput = z.infer<typeof UpdateDeliveryAddressSchema>;
export type RegisterPartialItemDeliveryInput = z.infer<typeof RegisterPartialItemDeliverySchema>;
export type FutureDeliveryIdParam = z.infer<typeof FutureDeliveryIdParamSchema>;
export type ListFutureDeliveriesQuery = z.infer<typeof ListFutureDeliveriesQuerySchema>;