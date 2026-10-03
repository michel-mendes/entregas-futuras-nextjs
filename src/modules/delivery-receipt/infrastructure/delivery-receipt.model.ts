import { Schema, model, Model, Document, models, Types } from 'mongoose';
import { DeliveryReceiptStatus } from '../domain/delivery-receipt.entity';

// Document Sub-Interfaces
export interface DeliveryReceiptRecipientDocument {
    name: string;
    address: string;
    phone?: string;
}

export interface DeliveryReceiptItemDocument {
    _id?: Types.ObjectId;
    productId: Types.ObjectId;
    batchId?: string;
    quantity: number;
    itemNotes?: string;
}

// Main Document Interface
export interface DeliveryReceiptDocument extends Document {
    futureDeliveryId: Types.ObjectId;
    saleId: string;
    saleType: string;
    deliveryNumber: string;
    deliveryDate: Date;
    recipient: DeliveryReceiptRecipientDocument;
    status: DeliveryReceiptStatus;
    notes?: string;
    items: DeliveryReceiptItemDocument[];
    createdAt: Date;
    updatedAt?: Date;
}

// Sub-Schemas
const DeliveryReceiptRecipientSchema = new Schema<DeliveryReceiptRecipientDocument>(
    {
        name: { type: String, required: true, trim: true, index: true },
        address: { type: String, required: true, trim: true },
        phone: { type: String, trim: true, default: undefined },
    },
    { _id: false }
);

const DeliveryReceiptItemSchema = new Schema<DeliveryReceiptItemDocument>(
    {
        productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true, index: true },
        batchId: { type: String, trim: true, default: undefined, index: true },
        quantity: { type: Number, required: true, min: 1 },
        itemNotes: { type: String, trim: true, default: undefined },
    },
    { _id: true }
);

// Main Schema
const DeliveryReceiptSchema = new Schema<DeliveryReceiptDocument>(
    {
        futureDeliveryId: {
            type: Schema.Types.ObjectId,
            ref: 'FutureDelivery',
            required: true,
            index: true,
        },
        saleId: { type: String, required: true, trim: true, index: true },
        saleType: { type: String, required: true, trim: true },
        deliveryNumber: { type: String, required: true, trim: true, index: true },
        deliveryDate: { type: Date, required: true },
        recipient: { type: DeliveryReceiptRecipientSchema, required: true },
        status: {
            type: String,
            required: true,
            enum: Object.values(DeliveryReceiptStatus),
            default: DeliveryReceiptStatus.CREATED,
            index: true,
        },
        notes: { type: String, trim: true, default: undefined },
        items: {
            type: [DeliveryReceiptItemSchema],
            required: true,
            validate: [
                (val: DeliveryReceiptItemDocument[]) => val.length > 0,
                'At least one item is required for a delivery receipt.',
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
DeliveryReceiptSchema.index({ futureDeliveryId: 1, status: 1 });
DeliveryReceiptSchema.index({ 'recipient.name': 1, status: 1 });
DeliveryReceiptSchema.index({ createdAt: -1 });

export const DeliveryReceiptModel: Model<DeliveryReceiptDocument> =
    models.DeliveryReceipt || model<DeliveryReceiptDocument>('DeliveryReceipt', DeliveryReceiptSchema);