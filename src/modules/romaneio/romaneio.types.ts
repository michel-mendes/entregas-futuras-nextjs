import { Types } from "mongoose";

export enum StatusRomaneio {
    CRIADO = "CRIADO",
    CONCLUIDO = "CONCLUIDO",
    CANCELADO = "CANCELADO"
};

export interface IDadosDestinatario {
    nome: string,
    telefone: string,
    endereco: string
};

export interface IItemRomaneio {
    _id?: Types.ObjectId,
    idProduto: Types.ObjectId,
    idLote: Types.ObjectId,
    quantidade: number,
    observacoesItem?: string
};

export interface IRomaneio {
    idEntregaFutura: Types.ObjectId,
    idVenda: string,
    tipoVenda: string,
    numeroEntrega: string,
    dataEntrega: Date,
    destinatario: IDadosDestinatario,
    status: StatusRomaneio,
    obervacoes?: string,
    itens: IItemRomaneio[],
    createdAt: Date,
    updatedAt: Date
};