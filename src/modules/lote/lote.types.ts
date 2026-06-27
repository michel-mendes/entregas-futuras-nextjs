import { Types } from "mongoose";

export interface ILote {
    ativo: boolean;                 // Status do lote (é inativado quando zerado em estoque)
    
    idProduto: Types.ObjectId;
    idDeposito: Types.ObjectId;

    // Especificação do lote
    dataProducao?: Date;
    numeroLote?: string;
    bitola: number;
    tonalidade: number;

    // Controle de estoque
    quantidadeInicial: number;      // Quantidade de entrada quando o lote foi cadastrado
    quantidadeAtual: number;        // Quantidade em estoque físico
    quantidadeReservada: number;    // Quantidade reservada para entrega

    // Dados adicionais
    localizacaoDetalhada?: string;   // Complemento para localização, ex: "Corredor 3", "Mesanino 2"...
    observacoes?: string;            // Utilizado para anotações extras, ex: "Caixa rasgada", "Ponta de estoque"...

    createdAt: Date;
    updatedAt: Date;
}