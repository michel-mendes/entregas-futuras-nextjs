import { Model, Schema, model, models } from 'mongoose';
import { IDeposito } from './deposito.types';

const DepositoSchema = new Schema<IDeposito>(
    {
        nome: { type: String, required: true, trim: true, uppercase: true },
        setor: { type: String, trim: true, uppercase: true },
        ativo: { type: Boolean, default: true },
    },
    {
        timestamps: true,
    }
);

DepositoSchema.index({ nome: 1, setor: 1 }, { unique: true });

export const Deposito: Model<IDeposito> = models.Deposito || model<IDeposito>('Deposito', DepositoSchema);