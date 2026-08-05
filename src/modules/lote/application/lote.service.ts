import { PaginatedResponse } from "@/types/pagination.types";
import { ILoteRepository, ListarLotesParams } from "../domain/lote.repository";
import { MongoLoteRepository } from "../infrastructure/lote.mongo.repository";
import { LotePresenter } from "./lote.presenter";
import { LoteRespostaApiDTO } from "./lote.dto";
import z from "zod";
import { criarLoteSchemaValidacao } from "./lote.validator";
import { LoteEntity } from "../domain/lote.entity";

export class LoteService {
    constructor(private readonly loteRepository: ILoteRepository) { }

    async criarLote(dados: z.infer<typeof criarLoteSchemaValidacao>): Promise<LoteRespostaApiDTO> {
        const novoLoteEntity = new LoteEntity({
            id: "",
            idProduto: dados.idProduto,
            idDeposito: dados.idDeposito,
            bitola: dados.bitola,
            tonalidade: dados.tonalidade,
            quantidadeInicial: dados.quantidadeInicial,
            quantidadeAtual: dados.quantidadeInicial,
            quantidadeReservada: 0,
            numeroLote: dados.numeroLote,
            ativo: true,
        });

        const loteCriado = await this.loteRepository.criar({
            idProduto: novoLoteEntity.idProduto,
            idDeposito: novoLoteEntity.idDeposito,
            bitola: novoLoteEntity.bitola,
            tonalidade: novoLoteEntity.tonalidade,
            quantidadeInicial: novoLoteEntity.quantidadeInicial,
            numeroLote: novoLoteEntity.numeroLote,
            localizacaoDetalhada: novoLoteEntity.localizacaoDetalhada,
            observacoes: novoLoteEntity.observacoes
        });

        return LotePresenter.toJSON(loteCriado);
    }
    
    /**
     * Lista lotes com paginação e limite de resultados por página.
     */
    async listarLotes({ limite, pagina }: ListarLotesParams): Promise<PaginatedResponse<LoteRespostaApiDTO>> {
        const parametrosValidados: ListarLotesParams = {
            limite: Math.max(1, limite),
            pagina: Math.max(1, pagina)
        };
        
        const resposta = await this.loteRepository.listar(parametrosValidados);
        const lotesJson = resposta.dados.map(loteEntity => LotePresenter.toJSON(loteEntity))

        return {
            data: lotesJson,
            meta: {
                totalPaginas: resposta.totalPaginas,
                totalRegistros: resposta.totalRegistros,
                paginaAtual: pagina,
                itensPorPagina: limite,
                temPaginaAnterior: pagina > 1,
                temProximaPagina: pagina < resposta.totalPaginas
            }
        };
    }
}

// Factory para criação do serviço de lotes com injeção de dependência
export function makeLoteService(): LoteService {
    const repositorioLotes = new MongoLoteRepository();
    const loteService = new LoteService(repositorioLotes);

    return loteService;
}