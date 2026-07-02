import { ILoteRepository, ListarLotesParams } from "../domain/lote.repository";
import { MongoLoteRepository } from "../infrastructure/lote.mongo.repository";

export class LoteService {
    constructor(private readonly loteRepository: ILoteRepository) { }

    /**
     * Lista lotes com paginação e limite de resultados por página.
     */
    async listarLotes({ limite, pagina }: ListarLotesParams) {
        const parametrosValidados: ListarLotesParams = {
            limite: Math.max(1, limite),
            pagina: Math.max(1, pagina)
        }
        
        const lotes = await this.loteRepository.listar(parametrosValidados);
        return lotes;
    }
}

// Factory para criação do serviço de lotes com injeção de dependência
export function makeLoteService(): LoteService {
    const repositorioLotes = new MongoLoteRepository();
    const loteService = new LoteService(repositorioLotes);

    return loteService;
}