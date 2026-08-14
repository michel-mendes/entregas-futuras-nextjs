import { IRomaneioProps, RomaneioEntity, StatusRomaneio } from "./romaneio.entity";

export interface ListarRomaneiosParams {
    pagina: number;
    limite: number;
    status?: StatusRomaneio | "TODOS";
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
    criar(romaneio: RomaneioEntity): Promise<RomaneioEntity>;
    atualizar(romaneio: RomaneioEntity): Promise<RomaneioEntity>;
    deletar(id: string): Promise<void>;
};