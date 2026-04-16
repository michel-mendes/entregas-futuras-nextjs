import { EntregaFuturaResponseDTO } from "./entrega-futura.dto";
import { IEntregaFutura } from "./entrega-futura.types";

export class EntregaFuturaMapper {

    static mapearParaResponseDTO(entrega: IEntregaFutura): EntregaFuturaResponseDTO {

        const entregaMapeada = {
            id: entrega._id.toString(),
            cliente: entrega.cliente,
            enderecoEntrega: `${entrega.enderecoEntrega.logradouro}, ${entrega.enderecoEntrega.numero} - ${entrega.enderecoEntrega.bairro}, ${entrega.enderecoEntrega.cidade}/${entrega.enderecoEntrega.uf}`,
            status: entrega.status,
            // Se usou .lean(), os virtuals não vêm automaticamente, você precisa recalculá-los ou 
            // injetar a lógica de mapper. Abaixo simula o comportamento dos virtuals em DTO.
            totalPecasCompradas: entrega.itens.reduce((acc: number, item: any) => acc + item.quantidadeComprada, 0),
            totalPecasEntregues: entrega.itens.reduce((acc: number, item: any) => acc + item.quantidadeEntregue, 0),
            progressoPercentual: Number(((entrega.itens.reduce((acc: number, item: any) => acc + item.quantidadeEntregue, 0) /
                entrega.itens.reduce((acc: number, item: any) => acc + item.quantidadeComprada, 0)) * 100).toFixed(2)) || 0,
            itens: entrega.itens.map((item: any) => ({
                ...item,
                id: item._id.toString(),
                produtoId: item.produtoId.toString(),
                pendente: item.quantidadeComprada - item.quantidadeEntregue,
            })),
            dataCriacao: entrega.dataCriacao.toISOString(),
        };

        return entregaMapeada;
    }

    static mapearArrayParaResponseDTO(entregas: IEntregaFutura[]): EntregaFuturaResponseDTO[] {
        const entregasMapeadas = entregas.map(entrega => this.mapearParaResponseDTO(entrega))

        return entregasMapeadas
    }

}