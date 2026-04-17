import mongoose, { Schema, Model } from 'mongoose';
import { IEntregaFutura, IItemEntregaFutura, StatusEntrega } from './entrega-futura.types';

const ItemEntregaFuturaSchema = new Schema<IItemEntregaFutura>({
    produtoId: { type: Schema.Types.ObjectId, ref: 'Produto', required: true },
    descricao: { type: String, required: true },
    quantidadeComprada: { type: Number, required: true, min: 0.001 }, // mínimo de "0.001" pois pisos e porcelanatos são vendidos por "m²"
    quantidadeEntregue: { type: Number, required: true, default: 0, min: 0 },
});

const EntregaFuturaSchema = new Schema<IEntregaFutura>(
    {
        cliente: {
            nome: { type: String, required: true, trim: true },
            documento: { type: String, required: true, trim: true },
            telefone: { type: String, required: true, trim: true },
        },
        enderecoEntrega: {
            cep: { type: String, required: true },
            logradouro: { type: String, required: true },
            numero: { type: String, required: true },
            complemento: { type: String },
            bairro: { type: String, required: true },
            cidade: { type: String, required: true },
            uf: { type: String, required: true, uppercase: true, minlength: 2, maxlength: 2 },
        },
        status: {
            type: String,
            enum: Object.values(StatusEntrega),
            default: StatusEntrega.PENDENTE,
        },
        itens: [ItemEntregaFuturaSchema],
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// Índices para performance em busca
EntregaFuturaSchema.index({ 'cliente.nome': 1 })
EntregaFuturaSchema.index({ 'cliente.documento': 1 });
EntregaFuturaSchema.index({ status: 1 });
EntregaFuturaSchema.index({ createdAt: -1 });


// v--- VIRTUALS PARA CÁLCULO DE PROGRESSO ---v

EntregaFuturaSchema.virtual('totalPecasCompradas').get(function () {
    const totalUnidadesCompradas = this.itens.reduce((total, item) => total + item.quantidadeComprada, 0);

    return totalUnidadesCompradas
});

EntregaFuturaSchema.virtual('totalPecasEntregues').get(function () {
    const totalUnidadesEntregues = this.itens.reduce((total, item) => total + item.quantidadeEntregue, 0);

    return totalUnidadesEntregues
});

EntregaFuturaSchema.virtual('progressoPercentual').get(function () {

    const totalComprado = this.totalPecasCompradas;
    if (totalComprado === 0) return 0;
    const totalEntregue = this.totalPecasEntregues;

    return Number(((totalEntregue / totalComprado) * 100).toFixed(2));
});

export const EntregaFutura: Model<IEntregaFutura> = mongoose.models.EntregaFutura || mongoose.model<IEntregaFutura>('EntregaFutura', EntregaFuturaSchema);