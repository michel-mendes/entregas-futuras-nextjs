import { CreateDepositoDTO, UpdateDepositoDTO } from "./deposito.dto";
import { DepositoEntity } from "./deposito.entity";

export interface IDepositoRepository {
    localizarPorId(id: string): Promise<DepositoEntity | null>;
    listar(filtros?: Partial<DepositoEntity>): Promise<DepositoEntity[]>;
    criar(dados: CreateDepositoDTO): Promise<DepositoEntity>;
    atualizar(id: string, dados: Partial<UpdateDepositoDTO>): Promise<DepositoEntity | null>;
    deletar(id: string): Promise<boolean>;
}