import { LoteEntity } from "./lote.entity";

export class LoteMapper {
    /**
     * Converte um objeto do banco de dados em uma entidade de dompinio pura
     */
    static toDomain(raw: any): LoteEntity {
        if (!raw) {
            throw new Error("Falha no mapeamento do modelo 'Lote': dados do lote nulos ou indefinidos.");
        }

        return {
            id: raw._id ? raw._id.toString() : raw.id?.toString(),
            ativo: Boolean(raw.ativo),

            // Para casos em que o Mongoose fez .populate(), raw.idProduto e raw.idDeposito serão objetos inteiros,
            // nesse caso uso o idProsuto._id, senão uso o o próprio valor de idProduto ou idDeposito
            idProduto: raw.idProduto?._id ? raw.idProduto._id.toString() : raw.idProduto?.toString(),
            idDeposito: raw.idDeposito?._id ? raw.idDeposito._id.toString() : raw.idDeposito?.toString(),

            dataProducao: raw.dataProducao,
            numeroLote: raw.numeroLote,
            bitola: Number(raw.bitola),
            tonalidade: Number(raw.tonalidade),

            quantidadeInicial: Number(raw.quantidadeInicial || 0),
            quantidadeAtual: Number(raw.quantidadeAtual || 0),
            quantidadeReservada: Number(raw.quantidadeReservada || 0),

            localizacaoDetalhada: raw.localizacaoDetalhada,
            observacoes: raw.observacoes,

            createdAt: raw.createdAt,
            updatedAt: raw.updatedAt
        };
    }

}