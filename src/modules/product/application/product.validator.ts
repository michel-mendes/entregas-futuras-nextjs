import { z } from 'zod';
import { ProductCategory } from '../domain/product.entity';

export const PackageDataSchema = z.object({
    weightKg: z.number().positive().optional(),
    areaM2: z.number().positive().optional(),
});

export const CreateProductSchema = z.object({
        skuCode: z.string().trim().min(1, 'SKU code is required'),
        name: z.string().trim().min(1, 'Product name is required'),
        imageUrl: z.url().optional().or(z.literal('')),
        priceCost: z.number().nonnegative('Price cost cannot be negative'),
        priceCash: z.number().nonnegative('Price cash cannot be negative'),
        priceInstallments: z.number().nonnegative('Price installments cannot be negative'),
        category: z.enum(ProductCategory),
        active: z.boolean(),
        packageData: PackageDataSchema.optional(),
    })
    .superRefine((data, ctx) => {
        const requiresPackage =
            data.category === ProductCategory.FLOOR_TILE ||
            data.category === ProductCategory.PORCELAIN_TILE;

        if (requiresPackage) {
            
            // If category is FLOOR_TILE or PORCELAIN_TILE, packageData must be provided
            if (!data.packageData) {
                ctx.addIssue({
                    code: "custom",
                    message:
                        'Package data (WeightKg and AreaM2) is required for FLOOR_TILE and PORCELAIN_TILE categories.',
                    path: ['packageData'],
                });
                return;
            }

            // If packageData is provided, both WeightKg and AreaM2 must be present
            if (data.packageData.weightKg === undefined || data.packageData.weightKg === null) {
                ctx.addIssue({
                    code: "custom",
                    message: 'WeightKg is required for this category.',
                    path: ['packageData', 'WeightKg'],
                });
            }

            // If packageData is provided, both WeightKg and AreaM2 must be present
            if (data.packageData.areaM2 === undefined || data.packageData.areaM2 === null) {
                ctx.addIssue({
                    code: "custom",
                    message: 'AreaM2 is required for this category.',
                    path: ['packageData', 'AreaM2'],
                });
            }
        }
    });

export const UpdateProductSchema = z.object({
        skuCode: z.string().trim().min(1, 'SKU code cannot be empty').optional(),
        name: z.string().trim().min(1, 'Product name cannot be empty').optional(),
        imageUrl: z.url().optional().or(z.literal('')).optional(),
        priceCost: z.number().nonnegative('Price cost cannot be negative').optional(),
        priceCash: z.number().nonnegative('Price cash cannot be negative').optional(),
        priceInstallments: z.number()
            .nonnegative('Price installments cannot be negative')
            .optional(),
        category: z.enum(ProductCategory).optional(),
        active: z.boolean().optional(),
        packageData: PackageDataSchema.optional(),
    })
    .superRefine((data, ctx) => {
        if (
            data.category === ProductCategory.FLOOR_TILE ||
            data.category === ProductCategory.PORCELAIN_TILE
        ) {
            if (!data.packageData) {
                ctx.addIssue({
                    code: "custom",
                    message:
                        'Package data (WeightKg and AreaM2) is required for FLOOR_TILE and PORCELAIN_TILE categories.',
                    path: ['packageData'],
                });
                return;
            }

            if (data.packageData.weightKg === undefined || data.packageData.weightKg === null) {
                ctx.addIssue({
                    code: "custom",
                    message: 'WeightKg is required for this category.',
                    path: ['packageData', 'WeightKg'],
                });
            }

            if (data.packageData.areaM2 === undefined || data.packageData.areaM2 === null) {
                ctx.addIssue({
                    code: "custom",
                    message: 'AreaM2 is required for this category.',
                    path: ['packageData', 'AreaM2'],
                });
            }
        }

        if (data.packageData) {
            if (data.packageData.weightKg !== undefined && data.packageData.weightKg <= 0) {
                ctx.addIssue({
                    code: "custom",
                    message: 'WeightKg must be positive when provided.',
                    path: ['packageData', 'WeightKg'],
                });
            }

            if (data.packageData.areaM2 !== undefined && data.packageData.areaM2 <= 0) {
                ctx.addIssue({
                    code: "custom",
                    message: 'AreaM2 must be positive when provided.',
                    path: ['packageData', 'AreaM2'],
                });
            }
        }
    });

export const ProductIdParamSchema = z.object({
    id: z.string().trim().min(1, 'ID is required'),
});

export const ListProductsQuerySchema = z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(10),
    name: z.string().trim().optional(),
    skuCode: z.string().trim().optional(),
    category: z.union([ z.literal("ALL"), z.enum(ProductCategory) ]).optional(),
    active: z.enum(['ACTIVE', 'INACTIVE', 'ALL']).default('ALL').optional(),
});

export type CreateProductInput = z.infer<typeof CreateProductSchema>;
export type UpdateProductInput = z.infer<typeof UpdateProductSchema>;
export type ProductIdParam = z.infer<typeof ProductIdParamSchema>;
export type ListProductsQuery = z.infer<typeof ListProductsQuerySchema>;