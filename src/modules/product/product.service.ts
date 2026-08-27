import { produtoRepository } from '@/modules/produto/produto.repository';
import { CreateProdutoInput, ListarProdutosInput, UpdateProdutoInput } from '@/modules/produto/produto.dto';
import { PaginatedResponse } from '@/types/pagination.types';
import { IProduto } from '@/modules/produto/produto.types';
import { AppError } from '@/lib/errors/AppError';
import { ProdutoMapper } from './produto.mapper';

export class ProdutoService {

    async buscarProdutoPorId(id: string) {
        const produto = await produtoRepository.findById(id);

        if (!produto) throw AppError.NotFound("Produto não encontrado")

        return ProdutoMapper.toHttp(produto);
    }

    async listarProdutos(params: ListarProdutosInput): Promise<PaginatedResponse<IProduto>> {
        const { dados, totalRegistros } = await produtoRepository.findAllPaginated(params);

        const totalPaginas = Math.ceil(totalRegistros / params.limit);

        return {
            data: ProdutoMapper.toHttpArray(dados),
            meta: {
                totalRegistros,
                totalPaginas,
                paginaAtual: params.page,
                itensPorPagina: params.limit,
                temPaginaAnterior: params.page > 1,
                temProximaPagina: params.page < totalPaginas,
            }
        };
    }

    async criarProduto(data: CreateProdutoInput) {
        const produtoExistente = await produtoRepository.findBySKU(data.codigoSKU);

        if (produtoExistente) {
            throw AppError.Conflict(`O SKU ${data.codigoSKU} já está cadastrado no sistema.`)
        }

        const produtoCriado = await produtoRepository.create(data);

        return ProdutoMapper.toHttp(produtoCriado);
    }

    async atualizarProduto(id: string, data: UpdateProdutoInput) {
        const produtoExistente = await produtoRepository.findById(id);

        if (!produtoExistente) throw AppError.NotFound("Produto não encontrado para atualização")

        const produtoAtualizado = await produtoRepository.update(id, data);

        return ProdutoMapper.toHttp(produtoAtualizado);
    }

    async desativarProduto(id: string) {
        const produtoExistente = await produtoRepository.findById(id);

        if (!produtoExistente) throw AppError.NotFound("Produto não encontrado")

        const produtoDesativado = await produtoRepository.softDelete(id)

        return ProdutoMapper.toHttp(produtoDesativado);
    }
}

export const produtoService = new ProdutoService();