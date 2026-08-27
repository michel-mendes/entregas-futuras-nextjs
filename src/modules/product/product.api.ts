import { IProduto } from '@/modules/produto/produto.types';
import { PaginatedResponse } from '@/types/pagination.types';
import { CreateProdutoInput, UpdateProdutoInput } from '@/modules/produto/produto.dto';
import { ApiResponse } from '@/types/api-response.types';

const BASE_URL = '/api/produtos';

// padroniza o lançamento de erros
const extrairErro = (data: any, mensagemPadrao: string) => {
    return new Error(data?.error?.message || mensagemPadrao);
};

export const produtosApi = {

    async listar(params: { page: number; limit: number; apenasAtivos: boolean; termoBusca?: string }): Promise<PaginatedResponse<IProduto>> {
        const url = new URL(BASE_URL, window.location.origin);
        url.searchParams.append('page', params.page.toString());
        url.searchParams.append('limit', params.limit.toString());
        url.searchParams.append('apenasAtivos', String(params.apenasAtivos.valueOf()));

        if (params.termoBusca) url.searchParams.append('termoBusca', params.termoBusca);

        const response = await fetch(url.toString());
        const result: ApiResponse<IProduto[]> = await response.json();

        if (!response.ok || !result.success) {
            throw extrairErro(result, 'Falha ao buscar produtos');
        }

        return {
            data: result.data || [],
            meta: result.meta as any
        };
    },

    async buscarPorId(id: string): Promise<IProduto> {
        const response = await fetch(`${BASE_URL}/${id}`);
        const result: ApiResponse<IProduto> = await response.json();

        if (!response.ok || !result.success) {
            throw extrairErro(result, 'Falha ao buscar os dados do produto.');
        }

        return result.data!;
    },

    async criar(data: CreateProdutoInput): Promise<IProduto> {
        const response = await fetch(BASE_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        const result: ApiResponse<IProduto> = await response.json();

        if (!response.ok || !result.success) {
            throw extrairErro(result, 'Falha ao cadastrar o produto.');
        }

        return result.data!;
    },

    async atualizar(id: string, data: UpdateProdutoInput): Promise<IProduto> {
        const response = await fetch(`${BASE_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        const result: ApiResponse<IProduto> = await response.json();

        if (!response.ok || !result.success) {
            throw extrairErro(result, 'Falha ao atualizar o produto.');
        }

        return result.data!;
    },

    async inativar(id: string): Promise<void> {
        const response = await fetch(`${BASE_URL}/${id}`, { method: 'DELETE' });

        // O DELETE retorna 204 No Content, então não há JSON
        if (!response.ok) {
            // Se falhar (ex: 404), ele terá um corpo JSON com o erro
            const errorData = await response.json().catch(() => ({}));
            throw extrairErro(errorData, 'Falha ao inativar produto');
        }
    }
};