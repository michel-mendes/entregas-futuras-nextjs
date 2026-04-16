import { EntregaFuturaRepository } from './entrega-futura.repository';
import { CreateEntregaFuturaDTO, UpdateItemEntregaDTO, EntregaFuturaResponseDTO } from './entrega-futura.dto';
import { StatusEntrega } from './entrega-futura.types';
import { AppError } from '@/lib/errors/AppError';
import { Types } from 'mongoose';
import { EntregaFuturaMapper } from './entrega-futura.mapper';

export class EntregaFuturaService {
    private readonly repository: EntregaFuturaRepository;

    constructor(repository: EntregaFuturaRepository = new EntregaFuturaRepository()) {
        this.repository = repository;
    }

    async criarEntrega(dto: CreateEntregaFuturaDTO): Promise<EntregaFuturaResponseDTO> {
        
        // Valida se a entrega possui itens, senão retona erro
        if (!dto.itens || dto.itens.length === 0) {
            throw AppError.BadRequest('Uma entrega futura deve conter pelo menos um item.');
        }

        // Valida se a entrega possui itens com quantidade zerada, sem sim retorna erro
        const itensComQuantidadeCompradaZerada = dto.itens.filter(i => i.quantidadeComprada <= 0);
        if (itensComQuantidadeCompradaZerada.length > 0) {
            throw AppError.BadRequest('A quantidade comprada dos itens deve ser maior que zero.');
        }

        const entregaCriada = await this.repository.criar({
            cliente: dto.cliente,
            enderecoEntrega: dto.enderecoEntrega,
            itens: dto.itens.map(item => {

                if (!Types.ObjectId.isValid(item.produtoId)) {
                    throw AppError.BadRequest(`ID de produto inválido: "${item.produtoId}"`)
                }

                return {
                    ...item,
                    produtoId: new Types.ObjectId(item.produtoId),
                    quantidadeEntregue: 0
                }

            }),
            status: StatusEntrega.PENDENTE,
        });

        return EntregaFuturaMapper.mapearParaResponseDTO(entregaCriada);
    }

    async buscarEntrega(id: string): Promise<EntregaFuturaResponseDTO> {
        const entrega = await this.repository.buscarPorId(id);
        if (!entrega) {
            throw AppError.NotFound('Entrega futura não encontrada.');
        }
        return EntregaFuturaMapper.mapearParaResponseDTO(entrega);
    }

    // Lógica de baixa parcial de prodtuo
    async registrarBaixaParcial(entregaId: string, dto: UpdateItemEntregaDTO): Promise<EntregaFuturaResponseDTO> {

        if (dto.quantidadeEntregue <= 0) {
            throw AppError.BadRequest('A quantidade a ser baixada deve ser maior que zero.');
        }

        const entrega = await this.repository.buscarPorId(entregaId);
        if (!entrega) {
            throw AppError.NotFound('Entrega futura não encontrada.');
        }

        if (entrega.status === StatusEntrega.CONCLUIDA || entrega.status === StatusEntrega.CANCELADA) {
            throw AppError.BadRequest(`Não é possível alterar uma entrega com status "${entrega.status}".`);
        }

        // Encontra o item específico a ser baixado na entrega
        const itemParaDarBaixa = entrega.itens.find((i) => i._id?.toString() === dto.itemId);
        if (!itemParaDarBaixa) {
            throw AppError.NotFound('Item não encontrado nesta entrega.');
        }

        // Validação obrigatória: não pode entregar mais do que o pendente
        const quantidadePendente = itemParaDarBaixa.quantidadeComprada - itemParaDarBaixa.quantidadeEntregue;
        if (dto.quantidadeEntregue > quantidadePendente) {
            throw AppError.BadRequest(`Quantidade solicitada excede o saldo pendente. Restam apenas ${quantidadePendente} unidades.`);
        }

        // Analisa se esta baixa fará a entrega ser concluída por completo
        // Condição: Se o item a dar baixa atingir a cota máxima E os outros itens já estiverem concluídos
        const outrosItensPendentes = entrega.itens.some((i) =>
            i._id?.toString() !== dto.itemId && i.quantidadeEntregue < i.quantidadeComprada
        );

        const esteItemSeraConcluido = (itemParaDarBaixa.quantidadeEntregue + dto.quantidadeEntregue) === itemParaDarBaixa.quantidadeComprada;

        const novoStatus = (!outrosItensPendentes && esteItemSeraConcluido)
            ? StatusEntrega.CONCLUIDA
            : StatusEntrega.PARCIAL;

        const entregaAtualizada = await this.repository.registrarBaixaItem(
            entregaId,
            dto.itemId,
            dto.quantidadeEntregue,
            novoStatus
        );

        if (!entregaAtualizada) {
            throw AppError.InternalError('Falha ao registrar a baixa do item. Tente novamente.');
        }

        return EntregaFuturaMapper.mapearParaResponseDTO(entregaAtualizada);
    }

}