import { Schema, model, Model, Document, models, Types } from 'mongoose';
import { FutureDeliveryStatus } from '../domain/future-delivery.entity';

// Document Sub-Interfaces
export interface FutureDeliveryItemDocument {
    _id?: Types.ObjectId;
    productId: Types.ObjectId;
    description: string;
    purchasedQuantity: number;
    deliveredQuantity: number;
}

export interface CustomerDocument {
    name: string;
    document: string;
    phone: string;
}

export interface DeliveryAddressDocument {
    zipCode: string;
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
}


// Main Document Interface
export interface FutureDeliveryDocument extends Document {
    customer: CustomerDocument;
    deliveryAddress: DeliveryAddressDocument;
    status: FutureDeliveryStatus;
    items: FutureDeliveryItemDocument[];
    createdAt: Date;
    updatedAt?: Date;
}

// Sub-Schemas
const CustomerSchema = new Schema<CustomerDocument>(
    {
        name: { type: String, required: true, trim: true },
        document: { type: String, required: true, trim: true, index: true },
        phone: { type: String, required: true, trim: true },
    },
    { _id: false }
);

const DeliveryAddressSchema = new Schema<DeliveryAddressDocument>(
    {
        zipCode: { type: String, required: true, trim: true },
        street: { type: String, required: true, trim: true },
        number: { type: String, required: true, trim: true },
        complement: { type: String, trim: true, default: undefined },
        neighborhood: { type: String, required: true, trim: true },
        city: { type: String, required: true, trim: true },
        state: { type: String, required: true, trim: true, uppercase: true },
    },
    { _id: false }
);

const FutureDeliveryItemSchema = new Schema<FutureDeliveryItemDocument>(
    {
        productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true, index: true },
        description: { type: String, required: true, trim: true },
        purchasedQuantity: { type: Number, required: true, min: 1 },
        deliveredQuantity: { type: Number, required: true, min: 0, default: 0 },
    },
    { _id: true }
);

// Main Schema
const FutureDeliverySchema = new Schema<FutureDeliveryDocument>(
    {
        customer: { type: CustomerSchema, required: true },
        deliveryAddress: { type: DeliveryAddressSchema, required: true },
        status: {
            type: String,
            required: true,
            enum: Object.values(FutureDeliveryStatus),
            default: FutureDeliveryStatus.PENDING,
            index: true,
        },
        items: {
            type: [FutureDeliveryItemSchema],
            required: true,
            validate: [
                (val: FutureDeliveryItemDocument[]) => val.length > 0,
                'At least one item is required for future delivery.',
            ],
        },
        createdAt: { type: Date, required: true, default: () => new Date() },
        updatedAt: { type: Date, default: undefined },
    },
    {
        timestamps: {
            createdAt: 'createdAt',
            updatedAt: 'updatedAt',
        },
    }
);

// Compound Indexing for Query Optimization
FutureDeliverySchema.index({ 'customer.document': 1, status: 1 });
FutureDeliverySchema.index({ createdAt: -1 });

export const FutureDeliveryModel: Model<FutureDeliveryDocument> =
    models.FutureDelivery || model<FutureDeliveryDocument>('FutureDelivery', FutureDeliverySchema);