import { Model, Schema, model, models } from 'mongoose';

export interface IWarehouseDocument extends Document {
    _id: Schema.Types.ObjectId;
    name: string;
    sector: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const WarehouseSchema = new Schema<IWarehouseDocument>(
    {
        name: { type: String, required: true, trim: true },
        sector: { type: String, required: true, trim: true },
        isActive: { type: Boolean, required: true, default: true },
    },
    {
        timestamps: true,
        versionKey: false 
    }
);

WarehouseSchema.index({ name: 1 });
WarehouseSchema.index({ sector: 1 });
WarehouseSchema.index({ isActive: 1 });

export const WarehouseModel: Model<IWarehouseDocument> = models.Warehouse || model<IWarehouseDocument>('Warehouse', WarehouseSchema);