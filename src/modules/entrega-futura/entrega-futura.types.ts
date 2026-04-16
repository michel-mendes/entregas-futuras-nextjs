import { Types, Document } from 'mongoose';

export enum StatusEntrega {
    PENDENTE = 'PENDENTE',
    PARCIAL = 'PARCIAL',
    CONCLUIDA = 'CONCLUIDA',
    CANCELADA = 'CANCELADA',
}

export interface IItemEntregaFutura {
    _id?: string;
    produtoId: Types.ObjectId;
    descricao: string; // campo imutável para consistência de dados e histórico correto
    quantidadeComprada: number;
    quantidadeEntregue: number;
}

export interface IEntregaFutura extends Document {
    cliente: {
        nome: string;
        documento: string; // CPF ou CNPJ
        telefone: string;
    };
    enderecoEntrega: {
        cep: string;
        logradouro: string;
        numero: string;
        complemento?: string;
        bairro: string;
        cidade: string;
        uf: string;
    };
    status: StatusEntrega;
    itens: IItemEntregaFutura[];
    dataCriacao: Date;
    dataAtualizacao: Date;

    // Campos virtuais
    progressoPercentual: number;
    totalPecasCompradas: number;
    totalPecasEntregues: number;
}