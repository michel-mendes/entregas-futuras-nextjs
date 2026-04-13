import { produtoRepository } from '@/repositories/produto.repository';
import { CreateProdutoInput, ListarProdutosInput, UpdateProdutoInput } from '@/dtos/produto.dto';
import { PaginatedResponse } from '@/types/pagination.types';
import { IProduto } from '@/types/produto.types';

export class ProdutoService {

    async buscarProdutoPorId(id: string) {
        const produto = await produtoRepository.findById(id);

        if (!produto) throw new Error("Produto não encontrado.");

        return produto;
    }

    async listarProdutos(params: ListarProdutosInput): Promise<PaginatedResponse<IProduto>> {
        const { dados, totalRegistros } = await produtoRepository.findAllPaginated(params);

        const totalPaginas = Math.ceil(totalRegistros / params.limit);

        return {
            data: dados,
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
            throw new Error(`O SKU ${data.codigoSKU} já está cadastrado no sistema.`);
        }

        return produtoRepository.create(data);
    }

    async atualizarProduto(id: string, data: UpdateProdutoInput) {
        const produtoExistente = await produtoRepository.findById(id);

        if (!produtoExistente) throw new Error("Produto não encontrado para atualização.");

        return produtoRepository.update(id, data);
    }

    async desativarProduto(id: string) {
        const produtoExistente = await produtoRepository.findById(id);

        if (!produtoExistente) throw new Error("Produto não encontrado.");

        return produtoRepository.softDelete(id);
    }
}

export const produtoService = new ProdutoService();