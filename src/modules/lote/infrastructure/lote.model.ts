import { Schema, model, models, Model, Document, Types } from 'mongoose';

export interface BatchDocument extends Omit<Document, "_id"> {
    _id: Types.ObjectId;
    active: boolean;
    productId: Types.ObjectId;
    warehouseId: Types.ObjectId;
    productionDate?: Date;
    batchNumber?: string;
    gauge: number;
    shade: number;
    initialQuantity: number;
    currentQuantity: number;
    reservedQuantity: number;
    detailedLocation?: string;
    notes?: string;
    createdAt: Date;
    updatedAt?: Date;
}

const BatchSchema = new Schema<BatchDocument>(
    {
        active: { type: Boolean, default: true },

        productId: { type: Types.ObjectId, ref: 'Produto', required: true },
        warehouseId: { type: Types.ObjectId, ref: 'Warehouse', required: true },

        productionDate: { type: Date, required: false },
        batchNumber: { type: String, required: false, trim: true, uppercase: true },
        gauge: { type: Number, required: true },
        shade: { type: Number, required: true },

        initialQuantity: { type: Number, required: true, min: 0 },
        currentQuantity: { type: Number, required: true, min: 0 },
        reservedQuantity: { type: Number, default: 0, min: 0 },

        detailedLocation: { type: String, trim: true, uppercase: true, required: false },
        notes: { type: String, trim: true, required: false },
    },
    { timestamps: true }
);

// Índices
BatchSchema.index({ productId: 1, active: 1 });       // Busca rápida por produto e lotes ativos (A query mais comum no dia a dia)
BatchSchema.index({ warehouseId: 1 });                // Busca rápida por depósito
BatchSchema.index({ productId: 1, batchNumber: 1 });  // Busca exata de um lote de um produto

export const BatchModel: Model<BatchDocument> = models.Batch || model<BatchDocument>('Batch', BatchSchema);