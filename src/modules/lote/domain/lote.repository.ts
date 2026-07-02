import { CriarLoteDTO } from "../application/lote.dto";
import { LoteEntity } from "./lote.entity";

export interface ListarLotesParams {
    pagina: number;
    limite: number; //Quantidade de resultados por página
};

export interface RespostaListarLotes {
    dados: LoteEntity[],
    totalRegistros: number
};

export interface ILoteRepository {
    listar(params: ListarLotesParams): Promise<RespostaListarLotes>;
    buscarPorId(id: string): Promise<LoteEntity | null>;
    buscarPorProduto(idProduto: string): Promise<LoteEntity[]>;
    buscarPorDeposito(idDeposito: string): Promise<LoteEntity[]>;
    criar(dados: CriarLoteDTO): Promise<LoteEntity>;
    atualizarSaldo(id: string, variacaoAtual: number, variacaoReservada: number): Promise<LoteEntity | null>;
};