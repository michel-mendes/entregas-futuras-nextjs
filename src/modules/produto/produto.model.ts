import mongoose, { Schema, Model } from 'mongoose';
import { IProduto, CategoriaProduto } from '@/modules/produto/produto.types';

const ProdutoSchema = new Schema<IProduto>(
    {
        codigoSKU: { type: String, required: true, unique: true, trim: true },
        descricao: { type: String, required: true, trim: true },
        urlImagem: { type: String, required: false },
        precoVista: { type: Number, required: true, min: 0 },
        precoPrazo: { type: Number, required: true, min: 0 },
        categoria: {
            type: String,
            enum: Object.values(CategoriaProduto),
            required: true
        },
        ativo: { type: Boolean, default: true },

        pesoEmbalagemKg: {
            type: Number,
            min: 0.1,
            required: function (this: IProduto) {
                return this.categoria === (CategoriaProduto.PISO || CategoriaProduto.PORCELANATO || CategoriaProduto.ARGAMASSA || CategoriaProduto.REJUNTE);
            }
        },
        m2Embalagem: {
            type: Number,
            min: 0.1,
            required: function (this: IProduto) {
                return this.categoria === (CategoriaProduto.PISO || CategoriaProduto.PORCELANATO);
            }
        }
    },
    { timestamps: true }
);

// Índice para busca rápida por descrição e SKU, cruciais para a busca com $regex
ProdutoSchema.index({ codigoSKU: 1 });
ProdutoSchema.index({ descricao: 1 });

export const Produto: Model<IProduto> = mongoose.models.Produto || mongoose.model<IProduto>('Produto', ProdutoSchema);