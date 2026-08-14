import { PaginatedResponse } from "@/types/pagination.types";
import { IRomaneioRepository, ListarRomaneiosParams } from "../domain/romaneio.repository";
import { IRomaneioProps, RomaneioEntity, StatusRomaneio } from "../domain/romaneio.entity";
import { MongoRomaneioRepository } from "../infrastructure/romaneio.mongo.repository";
import { CreateRomaneioDTO } from "../presentation/romaneio.validation";

export class RomaneioService {
    constructor(private readonly romaneioRepository: IRomaneioRepository) { }

    async criarRomaneio(dados: CreateRomaneioDTO): Promise<IRomaneioProps> {
        const novoRomaneioEntity = new RomaneioEntity({
            idEntregaFutura: dados.idEntregaFutura,
            idVenda: dados.idVenda,
            tipoVenda: dados.tipoVenda,
            observacoes: dados.observacoes,
            destinatario: { ...dados.destinatario },
            itens: [ ...dados.itens ],
            dataEntrega: new Date(),
            numeroEntrega: crypto.randomUUID(),
            status: StatusRomaneio.CRIADO,
        });

        const loteCriado = await this.romaneioRepository.criar(novoRomaneioEntity);

        return loteCriado.toObject();
    };

    async listarRomaneios({ pagina, limite, status }: ListarRomaneiosParams): Promise<PaginatedResponse<IRomaneioProps>> {
        const resposta = await this.romaneioRepository.listarTodos({ pagina, limite, status });
        const romaneiosJson = resposta.dados.map(entity => entity.toObject());

        return {
            data: romaneiosJson,
            meta: {
                totalPaginas: resposta.totalPaginas,
                totalRegistros: resposta.totalRegistros,
                paginaAtual: pagina,
                itensPorPagina: limite,
                temPaginaAnterior: pagina > 1,
                temProximaPagina: pagina < resposta.totalPaginas
            }
        };
    };
};

// Factory para serviço de romaneios...
export function makeRomaneioService(): RomaneioService {
    const romaneiosRepository = new MongoRomaneioRepository();
    const romaneiosService = new RomaneioService(romaneiosRepository);

    return romaneiosService;
}