import { CriarLoteDTO } from "../application/lote.dto";
import { LoteEntity } from "./lote.entity";

export interface ILoteRepository {
    buscarPorId(id: string): Promise<LoteEntity | null>;
    buscarPorProduto(idProduto: string): Promise<LoteEntity[]>;
    buscarPorDeposito(idDeposito: string): Promise<LoteEntity[]>;
    criar(dados: CriarLoteDTO): Promise<LoteEntity>;
    atualizarSaldo(id: string, variacaoAtual: number, variacaoReservada: number): Promise<LoteEntity | null>;
}