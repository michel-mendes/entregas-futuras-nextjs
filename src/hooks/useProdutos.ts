import { useState, useEffect, useCallback } from 'react';
import { produtosApi } from '@/modules/produto/produtos.api';
import { IProduto } from '@/modules/produto/produto.types';
import { PaginatedResponse } from '@/types/pagination.types';

export function useProdutos(limiteInicial = 20) {
    const [data, setData] = useState<PaginatedResponse<IProduto> | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [page, setPage] = useState(1);
    const [termoBusca, setTermoBusca] = useState('');
    const [apenasAtivos, setApenasAtivos] = useState(true)

    const fetchProdutos = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);

            const result = await produtosApi.listar({ page, limit: limiteInicial, apenasAtivos, termoBusca });

            setData(result);
        } catch (err: any) {
            setError(err.message || 'Erro desconhecido ao carregar dados.');
        } finally {
            setIsLoading(false);
        }
    }, [page, limiteInicial, apenasAtivos, termoBusca]);

    // Dispara a busca quando a página ou o termo de busca mudam
    useEffect(() => {
        // Debounce manual simples para não flodar a API enquanto o usuário digita
        const delay = setTimeout(() => {
            fetchProdutos();
        }, 500);

        return () => clearTimeout(delay);
    }, [fetchProdutos]);

    const handleBuscar = (apenasAtivos: boolean, termo: string) => {
        setApenasAtivos(apenasAtivos);
        setTermoBusca(termo);
        setPage(1);
    };

    const handleInativar = async (id: string) => {
        if (!confirm('Tem certeza que deseja inativar este produto?')) return;

        try {
            await produtosApi.inativar(id);
            await fetchProdutos();
        } catch (err: any) {
            alert(err.message);
        }
    };

    return {
        data,
        isLoading,
        error,
        page,
        setPage,
        handleBuscar,
        handleInativar,
        recarregar: fetchProdutos
    };
}