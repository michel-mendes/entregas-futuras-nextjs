import { connectToDatabase } from "@/lib/db/mongoose";
import { IDepositoRepository } from "./deposito.domain.repository";
import { DepositoEntity } from "./deposito.entity";
import { Deposito } from "./deposito.model";
import { DepositoMapper } from "./deposito.mapper";
import { CreateDepositoDTO, UpdateDepositoDTO } from "./deposito.dto";

export class MongoDepositoRepository implements IDepositoRepository {

    async localizarPorId(id: string): Promise<DepositoEntity | null> {
        await connectToDatabase();

        const deposito = await Deposito.findById(id).lean().exec();
        if (!deposito) return null;

        const depositoMapeado = DepositoMapper.toDomain(deposito);
        return depositoMapeado;
    }

    async listar(filtros: Partial<DepositoEntity> = {}): Promise<DepositoEntity[]> {
        await connectToDatabase();

        const query = DepositoMapper.toDatabaseQuery(filtros);
        const depositos = await Deposito.find(query).lean().exec();

        const depositosMapeados = depositos.map(deposito => DepositoMapper.toDomain(deposito));
        return depositosMapeados;
    }

    async criar(dados: CreateDepositoDTO): Promise<DepositoEntity> {
        await connectToDatabase();

        const novoDeposito = new Deposito(dados);
        const depositoSalvo = await novoDeposito.save();

        const depositoMapeado = DepositoMapper.toDomain(depositoSalvo);
        return depositoMapeado;
    }

    async atualizar(id: string, dados: Partial<UpdateDepositoDTO>): Promise<DepositoEntity | null> {
        await connectToDatabase();

        const depositoAtualizado = await Deposito.findByIdAndUpdate(id, dados, { returnDocument: "after" }).lean().exec();
        if (!depositoAtualizado) return null;

        const depositoMapeado = DepositoMapper.toDomain(depositoAtualizado);
        return depositoMapeado;
    }

    async deletar(id: string): Promise<boolean> {
        await connectToDatabase();

        const resultado = await Deposito.findByIdAndUpdate(id, { ativo: false, deletedAt: new Date(Date.now()) }).exec();
        return resultado !== null;
    }

}