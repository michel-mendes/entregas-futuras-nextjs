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
}