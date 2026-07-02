export interface CriarLoteDTO {
    idProduto: string;
    idDeposito: string;
    dataProducao?: Date;
    numeroLote?: string;
    bitola: number;
    tonalidade: number;
    quantidadeInicial: number;
    localizacaoDetalhada?: string;
    observacoes?: string;
};

export interface LoteRespostaApiDTO {
    id: string;
    idProduto: string;
    idDeposito: string;
    ativo: boolean;
    dataProducao?: Date;
    numeroLote?: string;
    bitola: number;
    tonalidade: number;
    quantidadeInicial: number;
    quantidadeAtual: number;
    quantidadeReservada: number;
    quantidadeDisponivel: number; // Campo calculado sendo exposto de forma limpa
    localizacaoDetalhada?: string;
    observacoes?: string;
    createdAt: Date;
    updatedAt?: Date;
}