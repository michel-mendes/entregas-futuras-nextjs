import { CriarEntregaFuturaInput, ListarEntregasQueryInput } from './entrega-futura.validator';
import { EntregaFuturaResponseDTO } from './entrega-futura.dto';
import { ApiMetadata, ApiResponse } from '@/types/api-response.types';
import { PaginatedResponse } from '@/types/pagination.types';

const BASE_URL = '/api/entregas-futuras';

const extrairErro = (data: any, mensagemPadrao: string) => {
    return new Error(data?.error?.message || mensagemPadrao);
};

export const entregaFuturaApi = {

    async criar(data: CriarEntregaFuturaInput): Promise<EntregaFuturaResponseDTO> {
        const response = await fetch(BASE_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        const result: ApiResponse<EntregaFuturaResponseDTO> = await response.json();

        if (!response.ok || !result.success) {
            throw extrairErro(result, 'Falha ao registrar entrega futura.');
        }

        return result.data!;
    },

    async listar(params: ListarEntregasQueryInput, signal?: AbortSignal): Promise<PaginatedResponse<EntregaFuturaResponseDTO>> {
        const url = new URL(BASE_URL, window.location.origin);

        // Anexar apenas parâmetros que possuem valor
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                url.searchParams.append(key, String(value));
            }
        });

        const response = await fetch(url.toString(), { signal });
        const result: ApiResponse<EntregaFuturaResponseDTO[]> = await response.json();

        if (!response.ok || !result.success) {
            throw extrairErro(result, 'Falha ao buscar listagem de entregas.');
        }

        return {
            data: result.data || [],
            meta: result.meta as ApiMetadata
        };
    },

    async buscarPorId(id: string): Promise<EntregaFuturaResponseDTO> {
        const url = new URL(`${BASE_URL}/${id}`, window.location.origin);

        const response = await fetch(url.toString());
        const result: ApiResponse<EntregaFuturaResponseDTO> = await response.json();

        if (!response.ok || !result.success) throw extrairErro(result, 'Falha ao buscar entrega.');
        return result.data!;
    },

    async registrarRomaneio(entregaId: string, itens: { itemId: string, quantidadeEntregue: number }[]): Promise<void> {
        const response = await fetch(`${BASE_URL}/${entregaId}/romaneios`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ itens }),
        });
        const result = await response.json();
        if (!response.ok || !result.success) throw extrairErro(result, 'Falha ao registrar romaneio.');
    }
};