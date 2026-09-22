import { Schema, model, Model, Document, models } from 'mongoose';
import { ProductCategory, PackageData } from '../domain/product.entity';

export interface ProductDocument extends Document {
    skuCode: string;
    name: string;
    imageUrl?: string;
    priceCost: number;
    priceCash: number;
    priceInstallments: number;
    category: ProductCategory;
    active: boolean;
    packageData?: PackageData;
    createdAt: Date;
    updatedAt?: Date;
    deletedAt?: Date;
}

const PackageDataSchema = new Schema<PackageData>(
    {
        weightKg: { type: Number, min: 0 },
        areaM2: { type: Number, min: 0 },
    },
    { _id: false }
);

const ProductSchema = new Schema<ProductDocument>(
    {
        skuCode: { type: String, required: true, unique: true, trim: true, index: true },
        name: { type: String, required: true, trim: true, index: true },
        imageUrl: { type: String, trim: true, default: undefined, },
        priceCost: { type: Number, required: true, min: 0, },
        priceCash: { type: Number, required: true, min: 0, },
        priceInstallments: { type: Number, required: true, min: 0, },
        category: { type: String, required: true, enum: Object.values(ProductCategory), index: true, },
        active: { type: Boolean, required: true, default: true, index: true, },
        packageData: { type: PackageDataSchema, default: undefined, },
        createdAt: { type: Date, required: true, default: () => new Date(), },
        updatedAt: { type: Date, default: undefined, },
        deletedAt: { type: Date, default: undefined, },
    },
    {
        timestamps: {
            createdAt: 'createdAt',
            updatedAt: 'updatedAt',
        },
    }
);

export const ProductModel: Model<ProductDocument> =
    models.Product || model<ProductDocument>('Product', ProductSchema);