import { IProduto } from '@/modules/produto/produto.types';
import { PaginatedResponse } from '@/types/pagination.types';
import { CreateProdutoInput, UpdateProdutoInput } from '@/modules/produto/produto.dto';

const BASE_URL = '/api/produtos';

export const produtosApi = {

    async listar(params: { page: number; limit: number; apenasAtivos: boolean; termoBusca?: string }): Promise<PaginatedResponse<IProduto>> {

        const url = new URL(BASE_URL, window.location.origin);
        url.searchParams.append('page', params.page.toString());
        url.searchParams.append('limit', params.limit.toString());
        url.searchParams.append('apenasAtivos', String(params.apenasAtivos.valueOf()));

        if (params.termoBusca) url.searchParams.append('termoBusca', params.termoBusca);

        const response = await fetch(url.toString());
        if (!response.ok) throw new Error('Falha ao buscar produtos');

        return response.json();
    },

    async buscarPorId(id: string): Promise<IProduto> {
        const response = await fetch(`${BASE_URL}/${id}`);

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.erro || 'Falha ao buscar os dados do produto.');
        }

        return response.json();
    },

    async criar(data: CreateProdutoInput): Promise<IProduto> {
        const response = await fetch(BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.erro || 'Falha ao cadastrar o produto.');
        }

        return response.json();
    },

    async atualizar(id: string, data: UpdateProdutoInput): Promise<IProduto> {
        const response = await fetch(`${BASE_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.erro || 'Falha ao atualizar o produto.');
        }

        return response.json();
    },

    async inativar(id: string): Promise<void> {
        const response = await fetch(`${BASE_URL}/${id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Falha ao inativar produto');
    }
};