import { connectToDatabase } from "@/lib/db/mongoose";
import { ILoteRepository } from "../domain/lote.repository";
import { LoteEntity } from "../domain/lote.entity";
import { Lote } from "./lote.model";
import { LoteMapper } from "./lote.mapper";
import { CriarLoteDTO } from "../application/lote.dto";

export class MongoLoteRepository implements ILoteRepository {

    async buscarPorId(id: string): Promise<LoteEntity | null> {
        await connectToDatabase()

        const lote = await Lote.findById(id, { ativo: true }).lean().exec();
        if (!lote) return null

        const loteMapeado = LoteMapper.toDomain(lote);
        return loteMapeado;
    }

    async buscarPorProduto(idProduto: string): Promise<LoteEntity[]> {
        await connectToDatabase();

        const lotes = await Lote.find({ idProduto, ativo: true }).lean().exec();
        
        const lotesMapeados = lotes.map(lote => LoteMapper.toDomain(lote));
        return lotesMapeados;
    }

    async buscarPorDeposito(idDeposito: string): Promise<LoteEntity[]> {
        await connectToDatabase();

        const lotes = await Lote.find({ idDeposito, ativo: true }).lean().exec();
        
        const lotesMapeados = lotes.map(lote => LoteMapper.toDomain(lote));
        return lotesMapeados;
    }

    async criar(dados: CriarLoteDTO): Promise<LoteEntity> {
        await connectToDatabase();

        const dadosNovoLote: Partial<LoteEntity> = {
            ...dados,
            quantidadeAtual: dados.quantidadeInicial,
            quantidadeReservada: 0
        };

        const novoLote = new Lote(dadosNovoLote);
        const loteSalvo = await novoLote.save();
        
        const loteMapeado = LoteMapper.toDomain(loteSalvo)
        return loteMapeado;
    }

    async atualizarSaldo(id: string, variacaoAtual: number, variacaoReservada: number): Promise<LoteEntity | null> {
        await connectToDatabase();

        const loteAtualizado = await Lote.findByIdAndUpdate(id, {
            $inc: {
                quantidadeAtual: variacaoAtual,
                quantidadeReservada: variacaoReservada
            }
        }, { returnDocument: "after" }).lean().exec();
        if (!loteAtualizado) return null;

        const loteMapeado = LoteMapper.toDomain(loteAtualizado);
        return loteMapeado;
    }

}