import { Schema, Types, model, models, Model, Document } from "mongoose";
import { IDestinatario, IItemRomaneioProps, IRomaneioProps, StatusRomaneio } from "../domain/romaneio.entity";

export interface IRomaneioDocument extends Omit<IRomaneioProps, "idEntregaFutura">, Document {
    idEntregaFutura: Types.ObjectId;
}

export interface IItemRomaneioDocument extends Omit<IItemRomaneioProps, "idProduto">, Document {
    idProduto: Types.ObjectId;
}

export interface IDestinatarioDocument extends IDestinatario, Document {}

const DestinatarioSchema = new Schema<IDestinatarioDocument>({
    nome: { type: String, required: true, trim: true },
    endereco: { type: String, required: true, trim: true },
    telefone: { type: String, required: true, trim: true },
}, { _id: false });

const ItemRomaneioSchema = new Schema<IItemRomaneioDocument>({
    idProduto: { type: Types.ObjectId, ref: "Produto", required: true },
    idLote: { type: Types.ObjectId, ref: "Lote", required: false },
    quantidade: { type: Number, required: true, min: 0.01 },
    observacoesItem: { type: String, trim: true, required: false }
});

const RomaneioSchema = new Schema<IRomaneioDocument>({
    idEntregaFutura: { type: Types.ObjectId, ref: "EntregaFutura", required: true },
    idVenda: { type: String, required: true },
    tipoVenda: { type: String, required: true },
    numeroEntrega: { type: String, required: true },
    dataEntrega: { type: Date, required: true },
    destinatario: { type: DestinatarioSchema, required: true },
    status: { type: String, enum: Object.values(StatusRomaneio), default: StatusRomaneio.CRIADO },
    observacoes: { type: String, trim: true, required: false },
    itens: [ItemRomaneioSchema]
}, { timestamps: true });

// Indices
RomaneioSchema.index({ idEntregaFutura: 1 });
RomaneioSchema.index({ status: 1, dataEntrega: 1 });
RomaneioSchema.index({ numeroEntrega: 1 }, { unique: true });

export const RomaneioModel: Model<IRomaneioDocument> = models.Romaneio || model<IRomaneioDocument>("Romaneio", RomaneioSchema);