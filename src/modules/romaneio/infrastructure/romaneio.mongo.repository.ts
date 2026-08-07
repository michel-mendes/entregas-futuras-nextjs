import { IRomaneioRepository, ListarRomaneiosParams, RespostaListarRomaneios } from "../domain/romaneio.repository";
import { RomaneioEntity, IRomaneioProps } from "../domain/romaneio.entity";
import { RomaneioModel, IRomaneioDocument } from "./romaneio.model";
import { Types } from "mongoose";

export class MongoRomaneioRepository implements IRomaneioRepository {

    private toEntity(document: IRomaneioDocument): RomaneioEntity {
        const props: IRomaneioProps = {
            id: document._id.toString(),
            idEntregaFutura: (document.idEntregaFutura instanceof Types.ObjectId)
                ? document.idEntregaFutura.toString()
                : (document.idEntregaFutura as any)._id.toString(),
            idVenda: document.idVenda,
            tipoVenda: document.tipoVenda,
            numeroEntrega: document.numeroEntrega,
            dataEntrega: document.dataEntrega,
            destinatario: document.destinatario,
            status: document.status,
            observacoes: document.observacoes,
            itens: document.itens,
            createdAt: document.createdAt,
            updatedAt: document.updatedAt,
        };

        return new RomaneioEntity(props, props.id);
    };

    private toDocument(romaneio: RomaneioEntity): Partial<IRomaneioDocument> {
        return {
            idEntregaFutura: new Types.ObjectId(romaneio.idEntregaFutura),
            idVenda: romaneio.idVenda,
            tipoVenda: romaneio.tipoVenda,
            numeroEntrega: romaneio.numeroEntrega,
            dataEntrega: romaneio.dataEntrega,
            destinatario: romaneio.destinatario,
            status: romaneio.status,
            observacoes: romaneio.observacoes,
            itens: [...romaneio.itens],
            createdAt: romaneio.createdAt,
            updatedAt: romaneio.updatedAt,
        };
    };

    async listarTodos({ pagina, limite, idEntregaFutura, status }: ListarRomaneiosParams): Promise<RespostaListarRomaneios> {
        const skip = (pagina - 1) * limite;
        const filtro: Record<string, any> = {};

        if (idEntregaFutura) filtro.idEntregaFutura = idEntregaFutura;
        if (status) filtro.status = status;

        const [romaneios, totalRegistros] = await Promise.all([
            RomaneioModel.find(filtro).sort({ dataEntrega: 1, createdAt: 1 }).skip(skip).limit(limite).lean().exec(),
            RomaneioModel.countDocuments(filtro).exec()
        ]);

        const totalPaginas = Math.ceil(totalRegistros / limite);
        const listaRomaneioEntity = romaneios.map(doc => this.toEntity(doc));

        return {
            dados: listaRomaneioEntity,
            totalPaginas,
            totalRegistros
        }
    };

    async localizarPorId(id: string): Promise<RomaneioEntity | null> {
        const document = await RomaneioModel.findById(id).exec();
        return document ? this.toEntity(document) : null;
    };

    async localizarPorIdVenda(idVenda: string): Promise<RomaneioEntity | null> {
        const document = await RomaneioModel.findOne({ idVenda }).exec();
        return document ? this.toEntity(document) : null;
    };

    async salvar(romaneio: RomaneioEntity): Promise<RomaneioEntity> {
        const document = await RomaneioModel.create(this.toDocument(romaneio));
        return this.toEntity(document);
    };

    async atualizar(romaneio: RomaneioEntity): Promise<RomaneioEntity> {
        if (!romaneio.id) throw new Error("O romaneio deve possuir um ID para atualizar.");

        const document = await RomaneioModel.findByIdAndUpdate(
            romaneio.id,
            this.toDocument(romaneio),
            { new: true, runValidators: true }
        ).exec();

        if (!document) throw new Error("Romaneio não encontrado.");
        return this.toEntity(document);
    };

    async deletar(id: string): Promise<void> {
        const result = await RomaneioModel.findByIdAndDelete(id).exec();
        if (!result) throw new Error("Romaneio não encontrado.");
    };

}