import { Model, Types } from 'mongoose';
import { EntregaFutura } from './entrega-futura.model';
import { IEntregaFutura, StatusEntrega } from './entrega-futura.types';

export class EntregaFuturaRepository {
    private readonly model: Model<IEntregaFutura>;

    constructor() {
        this.model = EntregaFutura;
    }


    async criar(dados: Partial<IEntregaFutura>): Promise<IEntregaFutura> {
        const novaEntrega = new this.model(dados);
        return await novaEntrega.save();
    }

    async buscarPorId(id: string): Promise<IEntregaFutura | null> {
        if (!Types.ObjectId.isValid(id)) return null;

        const entrega = await this.model.findById(id).lean().exec();
        return entrega
    }

    async registrarBaixaItem(
        entregaId: string,
        itemId: string,
        quantidadeAdicional: number,
        novoStatus: StatusEntrega
    ): Promise<IEntregaFutura | null> {

        const entregaAtualizada = await this.model.findOneAndUpdate(
            {
                _id: entregaId,
                'itens._id': itemId
            },
            {
                // $inc realiza uma operação atômica de incremento direto no banco
                $inc: { 'itens.$.quantidadeEntregue': quantidadeAdicional },
                $set: { status: novoStatus }
            },
            { new: true, runValidators: true } // new: true retorna o documento atualizado
        ).exec();

        return entregaAtualizada
    }

    async listarPaginado(pagina: number, limite: number, filtros: any = {}): Promise<{ dados: IEntregaFutura[], total: number }> {
        const skip = (pagina - 1) * limite;

        const [dados, total] = await Promise.all([
            this.model.find(filtros).skip(skip).limit(limite).sort({ createdAt: -1 }).lean().exec(),
            this.model.countDocuments(filtros).exec()
        ]);

        return { dados, total };
    }
}