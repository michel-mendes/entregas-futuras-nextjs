import { Schema, Types, model, models, Model, Document } from "mongoose";
import { IDestinatario, IItemRomaneioProps, IRomaneioProps, StatusRomaneio } from "../domain/romaneio.entity";

export interface IRomaneioDocument extends Omit<IRomaneioProps, "idEntregaFutura" | "itens"> {
    _id?: Schema.Types.ObjectId;
    idEntregaFutura: Schema.Types.ObjectId;
    itens: IItemRomaneioDocument[];
}

export interface IItemRomaneioDocument extends Omit<IItemRomaneioProps, "idProduto" | "idLote"> {
    _id?: Schema.Types.ObjectId;
    idProduto: Schema.Types.ObjectId;
    idLote?: Schema.Types.ObjectId;
}

export interface IDestinatarioDocument extends IDestinatario {}

const DestinatarioSchema = new Schema<IDestinatarioDocument>({
    nome: { type: String, required: true, trim: true },
    endereco: { type: String, required: true, trim: true },
    telefone: { type: String, required: false, trim: true },
}, { _id: false });

const ItemRomaneioSchema = new Schema<IItemRomaneioDocument>({
    idProduto: { type: Schema.Types.ObjectId, ref: "Produto", required: true },
    idLote: { type: Schema.Types.ObjectId, ref: "Lote", required: false },
    quantidade: { type: Number, required: true, min: 0.01 },
    observacoesItem: { type: String, trim: true, required: false }
});

const RomaneioSchema = new Schema<IRomaneioDocument>({
    idEntregaFutura: { type: Schema.Types.ObjectId, ref: "EntregaFutura", required: true },
    idVenda: { type: String, required: true },
    tipoVenda: { type: String, required: true },
    numeroEntrega: { type: String, required: true },
    dataEntrega: { type: Date, required: true },
    destinatario: { type: DestinatarioSchema, required: true },
    status: { type: String, enum: Object.values(StatusRomaneio), default: StatusRomaneio.CRIADO },
    observacoes: { type: String, trim: true, required: false },
    itens: { type: [ItemRomaneioSchema], required: true }
}, { timestamps: true });

// Indices
RomaneioSchema.index({ idEntregaFutura: 1 });
RomaneioSchema.index({ status: 1, dataEntrega: 1 });
RomaneioSchema.index({ numeroEntrega: 1 });

export const RomaneioModel: Model<IRomaneioDocument> = models.Romaneio || model<IRomaneioDocument>("Romaneio", RomaneioSchema);