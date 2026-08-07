import { RomaneioEntity, StatusRomaneio } from "./romaneio.entity";

export interface ListarRomaneiosParams {
    pagina: number;
    limite: number;
    idEntregaFutura?: string;
    status?: StatusRomaneio;
}

export interface RespostaListarRomaneios {
    dados: RomaneioEntity[];
    totalPaginas: number;
    totalRegistros: number;
}

export interface IRomaneioRepository {
    listarTodos(params: ListarRomaneiosParams): Promise<RespostaListarRomaneios>;
    localizarPorId(id: string): Promise<RomaneioEntity | null>;
    localizarPorIdVenda(idVenda: string): Promise<RomaneioEntity | null>;
    salvar(romaneio: RomaneioEntity): Promise<RomaneioEntity>;
    atualizar(romaneio: RomaneioEntity): Promise<RomaneioEntity>;
    deletar(id: string): Promise<void>;
};