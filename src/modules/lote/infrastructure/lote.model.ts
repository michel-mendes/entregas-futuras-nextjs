import { Schema, model, models, Model } from 'mongoose';
import { ILote } from '../lote.types';

const LoteSchema = new Schema<ILote>(
    {
        ativo: { type: Boolean, default: true },

        idProduto: { type: Schema.Types.ObjectId, ref: 'Produto', required: true, index: true },
        idDeposito: { type: Schema.Types.ObjectId, ref: 'Deposito', required: true, index: true },

        dataProducao: { type: Date, required: false },
        numeroLote: { type: String, required: false, trim: true, uppercase: true },
        bitola: { type: Number, required: true },
        tonalidade: { type: Number, required: true },

        quantidadeInicial: { type: Number, required: true, min: 0 },
        quantidadeAtual: { type: Number, required: true, min: 0 },
        quantidadeReservada: { type: Number, default: 0, min: 0 },

        localizacaoDetalhada: { type: String, trim: true, uppercase: true, required: false },
        observacoes: { type: String, trim: true, required: false },
    },
    { timestamps: true }
);

// Índices
LoteSchema.index({ idProduto: 1, ativo: 1 });       // Busca rápida por produto e lotes ativos (A query mais comum no dia a dia)
LoteSchema.index({ idDeposito: 1 });                // Busca rápida por depósito
LoteSchema.index({ idProduto: 1, numeroLote: 1 });  // Busca exata de um lote de um produto

export const Lote: Model<ILote> = models.Lote || model<ILote>('Lote', LoteSchema);