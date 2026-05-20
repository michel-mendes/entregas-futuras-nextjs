'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';

import { listarEntregasQuerySchema, ListarEntregasQueryInput } from '@/modules/entrega-futura/entrega-futura.validator';
import { entregaFuturaApi } from '@/modules/entrega-futura/entrega-futura.api';
import { EntregaFuturaResponseDTO } from '@/modules/entrega-futura/entrega-futura.dto';
import { StatusEntrega } from '@/modules/entrega-futura/entrega-futura.types';

import { FormField } from '@/components/ui/FormField';
import { IconSpinner } from '@/components/ui/Icons';
import { IconPackagePlus } from '@/components/ui/Icons';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Pagination } from '@/components/ui/Pagination';

function EntregasFuturasList() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [entregas, setEntregas] = useState<EntregaFuturaResponseDTO[]>([]);
    const [meta, setMeta] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // 1. Inicializar formulário de filtros lendo da URL
    const { register, handleSubmit, reset } = useForm<Partial<ListarEntregasQueryInput>>({
        resolver: zodResolver(listarEntregasQuerySchema),
        defaultValues: {
            pagina: Number(searchParams.get('pagina')) || 1,
            limite: Number(searchParams.get('limite')) || 20,
            nomeCliente: searchParams.get('nomeCliente') || '',
            documentoCliente: searchParams.get('documentoCliente') || '',
            status: (searchParams.get('status') as StatusEntrega) || StatusEntrega.PENDENTE,
        }
    });

    // 2. Fetch de Dados com AbortController
    useEffect(() => {
        const abortController = new AbortController();

        const fetchEntregas = async () => {
            setLoading(true);
            setError(null);
            try {
                // Parse seguro dos params da URL usando o Zod
                const paramsValidados = listarEntregasQuerySchema.parse({
                    pagina: searchParams.get('pagina') || 1,
                    limite: searchParams.get('limite') || 20,
                    status: searchParams.get('status') || StatusEntrega.PENDENTE,
                    nomeCliente: searchParams.get('nomeCliente'),
                    documentoCliente: searchParams.get('documentoCliente'),
                });

                const response = await entregaFuturaApi.listar(paramsValidados, abortController.signal);
                setEntregas(response.data);
                setMeta(response.meta);
            } catch (err: any) {
                if (err.name !== 'AbortError') {
                    setError(err.message || 'Erro ao carregar entregas.');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchEntregas();

        return () => abortController.abort(); // Cancela requisição anterior se a URL mudar rápido
    }, [searchParams]);

    // Atualizar URL ao aplicar filtros
    const onApplyFilters = (data: Partial<ListarEntregasQueryInput>) => {
        const params = new URLSearchParams();

        // Força ir para a página 1 sempre que um filtro de texto/status mudar
        params.set('pagina', '1');
        params.set('limite', String(data.limite));

        if (data.nomeCliente) params.set('nomeCliente', data.nomeCliente);
        if (data.documentoCliente) params.set('documentoCliente', data.documentoCliente);
        if (data.status) params.set('status', data.status);

        router.push(`${pathname}?${params.toString()}`);
    };

    const handlePageChange = (newPage: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('pagina', String(newPage));
        router.push(`${pathname}?${params.toString()}`);
    };

    const inputClass = "w-full bg-surface border border-border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all";

    return (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4">

            {/* Header & Ações */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-lg font-semibold text-primary">Entregas Futuras</h1>
                    <p className="text-xs text-tertiary">Gerenciamento de romaneios e saldos pendentes</p>
                </div>
                <Link
                    href="/entregas-futuras/nova"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-brand hover:bg-brand/90 text-white transition-all shadow-sm"
                >
                    <IconPackagePlus />
                    Nova Entrega
                </Link>
            </div>

            {/* Barra de Filtros */}
            <form onSubmit={handleSubmit(onApplyFilters)} className="bg-surface border border-border rounded-xl p-4 flex flex-col md:flex-row gap-3 items-end">
                <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-3 gap-3">
                    <FormField label="Cliente">
                        <input {...register('nomeCliente')} placeholder="Nome ou Razão Social" className={inputClass} />
                    </FormField>
                    <FormField label="Documento (CPF/CNPJ)">
                        <input {...register('documentoCliente')} placeholder="Somente números" className={inputClass} />
                    </FormField>
                    <FormField label="Status">
                        <select {...register('status')} className={inputClass}>
                            {/* <option value="">Todos</option> */}
                            {Object.values(StatusEntrega).map(status => (
                                <option key={status} value={status}>{status}</option>
                            ))}
                        </select>
                    </FormField>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <button
                        type="button"
                        onClick={() => { reset(); router.push(pathname); }}
                        className="flex-1 md:flex-none px-4 py-1.5 border border-border rounded-lg text-sm text-secondary hover:bg-subtle transition-all"
                    >
                        Limpar
                    </button>
                    <button
                        type="submit"
                        className="flex-1 md:flex-none px-4 py-1.5 bg-secondary text-white rounded-lg text-sm font-medium hover:bg-primary transition-all"
                    >
                        Filtrar
                    </button>
                </div>
            </form>

            {/* Tabela de Dados */}
            <div className="bg-surface border border-border rounded-xl overflow-hidden">
                <div className="overflow-x-auto min-h-[300px]">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-subtle/50 text-xs text-tertiary uppercase border-b border-border-subtle">
                            <tr>
                                <th className="px-4 py-3 font-medium">Cód / Data</th>
                                <th className="px-4 py-3 font-medium">Cliente</th>
                                <th className="px-4 py-3 font-medium">Andamento</th>
                                <th className="px-4 py-3 font-medium text-center">Status</th>
                                <th className="px-4 py-3 font-medium text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-subtle">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-4 py-12 text-center">
                                        <div className="flex justify-center items-center gap-2 text-tertiary">
                                            <IconSpinner /> <span className="text-sm">Carregando dados...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : error ? (
                                <tr>
                                    <td colSpan={5} className="px-4 py-8 text-center text-red-500 text-sm font-medium">
                                        {error}
                                    </td>
                                </tr>
                            ) : entregas.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-4 py-12 text-center text-tertiary text-sm">
                                        Nenhuma entrega encontrada com estes filtros.
                                    </td>
                                </tr>
                            ) : (
                                entregas.map((entrega) => (
                                    <tr key={entrega.id} className="hover:bg-subtle/30 transition-colors group">
                                        <td className="px-4 py-3">
                                            <span className="block font-medium text-primary">#{entrega.id.slice(-6).toUpperCase()}</span>
                                            <span className="text-xs text-tertiary">{new Date(entrega.dataCriacao).toLocaleDateString('pt-BR')}</span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="block text-primary truncate max-w-[200px]" title={entrega.cliente.nome}>{entrega.cliente.nome}</span>
                                            <span className="text-xs text-tertiary">{entrega.cliente.documento}</span>
                                        </td>
                                        <td className="px-4 py-3 w-48">
                                            <ProgressBar
                                                percentual={entrega.progressoPercentual}
                                                label={`${Number(entrega.totalPecasEntregues).toLocaleString(undefined, {maximumFractionDigits: 2})} de ${Number(entrega.totalPecasCompradas).toLocaleString(undefined, {maximumFractionDigits: 2})} entregues`}
                                            />
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold tracking-wide uppercase ${entrega.status === 'CONCLUIDA' ? 'bg-green-100 text-green-700' :
                                                entrega.status === 'PENDENTE' ? 'bg-yellow-100 text-yellow-700' :
                                                    'bg-brand-muted text-brand' // EM_ANDAMENTO
                                                }`}>
                                                {entrega.status.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <button
                                                onClick={() => router.push(`/entregas-futuras/${entrega.id}`)}
                                                className="text-brand text-xs font-semibold hover:underline px-2 py-1"
                                            >
                                                Detalhes / Baixa
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {!loading && meta && (
                    <Pagination
                        currentPage={meta.paginaAtual}
                        totalPages={meta.totalPaginas}
                        onPageChange={handlePageChange}
                    />
                )}
            </div>
        </div>
    );
}

// O wrapper Suspense é OBRIGATÓRIO no App Router ao ler query params no cliente
export default function EntregasFuturasPage() {
    return (
        <Suspense fallback={<div className="p-8 text-center text-sm text-tertiary">Montando interface...</div>}>
            <EntregasFuturasList />
        </Suspense>
    );
}