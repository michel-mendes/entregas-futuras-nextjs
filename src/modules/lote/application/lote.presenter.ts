import { LoteEntity } from "../domain/lote.entity";
import { LoteRespostaApiDTO } from "./lote.dto";

export class LotePresenter {
    static toJSON(entity: LoteEntity): LoteRespostaApiDTO {
        return {
            id: entity.id,
            idProduto: entity.idProduto,
            idDeposito: entity.idDeposito,
            ativo: entity.ativo,
            dataProducao: entity.dataProducao,
            numeroLote: entity.numeroLote,
            bitola: entity.bitola,
            tonalidade: entity.tonalidade,
            quantidadeInicial: entity.quantidadeInicial,
            quantidadeAtual: entity.quantidadeAtual,
            quantidadeReservada: entity.quantidadeReservada,
            quantidadeDisponivel: entity.quantidadeDisponivel,
            localizacaoDetalhada: entity.localizacaoDetalhada,
            observacoes: entity.observacoes,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
        };
    }
}