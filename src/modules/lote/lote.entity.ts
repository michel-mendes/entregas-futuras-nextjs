export interface LoteEntity {
    id: string;
    ativo: boolean;
    idProduto: string;
    idDeposito: string;
    dataProducao?: Date;
    numeroLote?: string;
    bitola: number;
    tonalidade: number;
    quantidadeInicial: number;
    quantidadeAtual: number;
    quantidadeReservada: number;
    localizacaoDetalhada?: string;
    observacoes?: string;
    createdAt: Date;
    updatedAt?: Date;
}