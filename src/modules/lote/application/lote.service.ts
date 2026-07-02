import { PaginatedResponse } from "@/types/pagination.types";
import { ILoteRepository, ListarLotesParams } from "../domain/lote.repository";
import { MongoLoteRepository } from "../infrastructure/lote.mongo.repository";
import { LotePresenter } from "./lote.presenter";
import { LoteRespostaApiDTO } from "./lote.dto";

export class LoteService {
    constructor(private readonly loteRepository: ILoteRepository) { }

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