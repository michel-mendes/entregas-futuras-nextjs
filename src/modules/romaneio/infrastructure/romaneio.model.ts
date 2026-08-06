import { Schema, model, models, Model } from "mongoose";
import { IRomaneio, IItemRomaneio, IDadosDestinatario, StatusRomaneio } from "../romaneio.types";

const DadosDestinatarioSchema = new Schema<IDadosDestinatario>({
    nome: { type: String, required: true, trim: true },
    endereco: { type: String, required: true, trim: true },
    telefone: { type: String, required: true, trim: true },
}, { _id: false });

const ItemRomaneioSchema = new Schema<IItemRomaneio>({
    idProduto: { type: Schema.Types.ObjectId, ref: "Produto", required: true },
    idLote: { type: Schema.Types.ObjectId, ref: "Lote", required: false },
    quantidade: { type: Number, required: true, min: 0.01 },
    observacoesItem: { type: String, trim: true, required: false }
});

const RomaneioSchema = new Schema<IRomaneio>({
    idEntregaFutura: { type: Schema.Types.ObjectId, ref: "EntregaFutura", required: true },
    idVenda: { type: String, required: true },
    tipoVenda: { type: String, required: true },
    numeroEntrega: { type: String, required: true },
    dataEntrega: { type: Date, required: true },
    destinatario: { type: DadosDestinatarioSchema, required: true },
    status: { type: String, enum: Object.values(StatusRomaneio), default: StatusRomaneio.CRIADO },
    obervacoes: { type: String, trim: true, required: false },
    itens: [ItemRomaneioSchema]
}, { timestamps: true });

// Indices
RomaneioSchema.index({ idEntregaFutura: 1 });
RomaneioSchema.index({ status: 1, dataEntrega: 1 });
RomaneioSchema.index({ numeroEntrega: 1 }, { unique: true });

export const Romaneio: Model<IRomaneio> = models.Romaneio || model<IRomaneio>("Romaneio", RomaneioSchema);