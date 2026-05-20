'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { entregaFuturaApi } from '@/modules/entrega-futura/entrega-futura.api';
import { EntregaFuturaResponseDTO, ItemEntregaResponseDTO } from '@/modules/entrega-futura/entrega-futura.dto';
import { NotificationBanner } from '@/components/ui/NotificationBanner';
import { IconChevronLeft, IconSpinner, IconSave } from '@/components/ui/Icons';
import { ProgressBar } from '@/components/ui/ProgressBar';

interface RomaneioItem {
    itemId: string;
    produtoId: string;
    descricao: string;
    maxPendente: number;
    quantidadeEntregue: number; // Mutável pelo input no carrinho
}

export default function VisualizarEntregaFuturaPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params); // Desempacota a promise de params
    const router = useRouter();

    const [entrega, setEntrega] = useState<EntregaFuturaResponseDTO | null>(null);
    const [romaneio, setRomaneio] = useState<RomaneioItem[]>([]);

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    // Carregar dados
    const fetchEntrega = async () => {
        try {
            setLoading(true);
            const data = await entregaFuturaApi.buscarPorId(id);
            setEntrega(data);
        } catch (err: any) {
            setError(err.message || 'Erro ao carregar dados da entrega.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEntrega();
    }, [id]);

    // ─── Lógica do Romaneio ──────────────────────────────────────────────────

    const adicionarAoRomaneio = (item: ItemEntregaResponseDTO) => {
        if (item.pendente <= 0) return;
        if (romaneio.some(r => r.itemId === item.id)) return;

        setRomaneio(prev => [...prev, {
            itemId: item.id,
            produtoId: item.produtoId,
            descricao: item.descricao,
            maxPendente: item.pendente,
            quantidadeEntregue: item.pendente // Inicia sugerindo o total pendente
        }]);
    };

    const removerDoRomaneio = (itemId: string) => {
        setRomaneio(prev => prev.filter(r => r.itemId !== itemId));
    };

    const atualizarQuantidadeRomaneio = (itemId: string, novaQtd: number, maxPendente: number) => {
        // Validação estrita: não pode ser negativo nem maior que o pendente
        const qtdValida = Math.max(0.001, Math.min(novaQtd, maxPendente));
        setRomaneio(prev => prev.map(r => r.itemId === itemId ? { ...r, quantidadeEntregue: qtdValida } : r));
    };

    const handleSalvarRomaneio = async () => {
        if (romaneio.length === 0) return;

        try {
            setSubmitting(true);
            const payload = romaneio.map(r => ({
                itemId: r.itemId,
                quantidadeEntregue: Number(r.quantidadeEntregue)
            }));

            await entregaFuturaApi.registrarRomaneio(id, payload);
            setNotification({ type: 'success', message: 'Romaneio registrado com sucesso! Saldos atualizados.' });

            // Limpa o carrinho e recarrega os dados do backend
            setRomaneio([]);
            await fetchEntrega();
        } catch (err: any) {
            setNotification({ type: 'error', message: err.message || 'Erro ao registrar romaneio.' });
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return <div className="flex h-screen items-center justify-center text-tertiary"><IconSpinner /> <span className="ml-2">Carregando entrega...</span></div>;
    }

    if (error || !entrega) {
        return <div className="p-8 text-center text-red-500 font-medium">{error || 'Entrega não encontrada'}</div>;
    }

    const isConcluida = entrega.status === 'CONCLUIDA';

    return (
        <div className="min-h-screen bg-canvas pb-12">
            <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 py-6 space-y-4">

                {/* ── Header ─────────────────────────────────────────────── */}
                <div className="flex items-center justify-between gap-4 bg-surface p-4 border border-border rounded-xl">
                    <div className="flex items-center gap-3">
                        <button onClick={() => router.back()} className="flex items-center justify-center w-9 h-9 rounded-xl bg-subtle border border-border text-secondary hover:text-primary transition-all">
                            <IconChevronLeft />
                        </button>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-lg font-semibold text-primary uppercase">Entrega #{entrega.id.slice(-6)}</h1>
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wide uppercase ${isConcluida ? 'bg-green-100 text-green-700' : 'bg-brand-muted text-brand'
                                    }`}>
                                    {entrega.status.replace('_', ' ')}
                                </span>
                            </div>
                            <p className="text-xs text-tertiary">Registrada em {new Date(entrega.dataCriacao).toLocaleDateString('pt-BR')}</p>
                        </div>
                    </div>
                    <div className="w-48 sm:w-64">
                        <ProgressBar percentual={entrega.progressoPercentual} label={`${entrega.totalPecasEntregues} de ${entrega.totalPecasCompradas} entregues`} />
                    </div>
                </div>

                {notification && <NotificationBanner notification={notification} onDismiss={() => setNotification(null)} />}

                {/* ── Info Cards ─────────────────────────────────────────── */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-surface border border-border rounded-xl p-4">
                        <h2 className="text-xs font-semibold text-tertiary uppercase mb-3">Dados do Cliente</h2>
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-primary">{entrega.cliente.nome}</p>
                            <p className="text-xs text-secondary">Documento: <span className="font-mono text-tertiary">{entrega.cliente.documento}</span></p>
                            <p className="text-xs text-secondary">Telefone: <span className="font-mono text-tertiary">{entrega.cliente.telefone}</span></p>
                        </div>
                    </div>
                    <div className="bg-surface border border-border rounded-xl p-4">
                        <h2 className="text-xs font-semibold text-tertiary uppercase mb-3">Endereço de Entrega</h2>
                        <p className="text-sm text-primary leading-relaxed">{entrega.enderecoEntrega}</p>
                    </div>
                </div>

                {/* ── Grid Principal: Lista x Romaneio ───────────────────── */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

                    {/* Coluna da Esquerda: Itens Originais (2/3) */}
                    <div className="lg:col-span-2 bg-surface border border-border rounded-xl overflow-hidden flex flex-col">
                        <div className="px-4 py-3 border-b border-border-subtle bg-subtle/30">
                            <h2 className="text-xs font-semibold text-tertiary uppercase">Saldos da Entrega</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm whitespace-nowrap">
                                <thead className="bg-subtle/50 text-xs text-tertiary uppercase border-b border-border-subtle">
                                    <tr>
                                        <th className="px-4 py-3 font-medium">Produto</th>
                                        <th className="px-4 py-3 font-medium text-right">Comprado</th>
                                        <th className="px-4 py-3 font-medium text-right">Entregue</th>
                                        <th className="px-4 py-3 font-medium text-right">Pendente</th>
                                        <th className="px-4 py-3 font-medium text-center">Ação</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border-subtle">
                                    {entrega.itens.map((item) => {
                                        const inRomaneio = romaneio.some(r => r.itemId === item.id);
                                        const semSaldo = item.pendente <= 0;

                                        return (
                                            <tr key={item.id} className="hover:bg-subtle/20 transition-colors">
                                                <td className="px-4 py-2">
                                                    <span className="block font-medium text-primary">{item.descricao}</span>
                                                    <span className="text-xs text-tertiary font-mono">ID: {item.produtoId.slice(-6).toUpperCase()}</span>
                                                </td>
                                                <td className="px-4 py-2 text-right text-secondary">{item.quantidadeComprada}</td>
                                                <td className="px-4 py-2 text-right text-green-600 font-medium">{item.quantidadeEntregue}</td>
                                                <td className="px-4 py-2 text-right font-bold text-primary">{item.pendente}</td>
                                                <td className="px-4 py-2 text-center">
                                                    <button
                                                        onClick={() => adicionarAoRomaneio(item)}
                                                        disabled={inRomaneio || semSaldo}
                                                        className="px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all disabled:opacity-40 disabled:cursor-not-allowed
                                                        border-brand text-brand hover:bg-brand hover:text-white"
                                                    >
                                                        {inRomaneio ? 'Na Fila' : semSaldo ? 'Zerado' : 'Adicionar'}
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Coluna da Direita: O Romaneio (1/3) */}
                    <div className="bg-surface border border-border rounded-xl flex flex-col h-full shadow-sm">
                        <div className="px-4 py-3 border-b border-border-subtle bg-brand-muted/30 flex justify-between items-center">
                            <h2 className="text-xs font-bold text-brand uppercase">Produção do Romaneio</h2>
                            <span className="text-xs font-medium text-brand">{romaneio.length} itens</span>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[300px]">
                            {romaneio.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-tertiary text-sm text-center">
                                    <svg className="w-10 h-10 mb-2 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                                    </svg>
                                    Nenhum item adicionado ao romaneio de carga.
                                </div>
                            ) : (
                                romaneio.map((r) => (
                                    <div key={r.itemId} className="p-3 border border-border-subtle rounded-lg bg-canvas/50">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="text-sm font-medium text-primary leading-tight pr-4">{r.descricao}</span>
                                            <button onClick={() => removerDoRomaneio(r.itemId)} className="text-tertiary hover:text-red-500 transition-colors">
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>
                                        <div className="flex items-center justify-between mt-2">
                                            <span className="text-xs text-secondary">Máx: {r.maxPendente}</span>
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs text-tertiary">Qtd a enviar:</span>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    value={r.quantidadeEntregue}
                                                    onChange={(e) => atualizarQuantidadeRomaneio(r.itemId, Number(e.target.value), r.maxPendente)}
                                                    className="w-20 px-2 py-1 text-sm text-right border border-border rounded focus:border-brand focus:ring-1 focus:ring-brand outline-none"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Footer Ações Romaneio */}
                        <div className="p-4 border-t border-border-subtle bg-subtle/50">
                            <button
                                onClick={handleSalvarRomaneio}
                                disabled={romaneio.length === 0 || submitting}
                                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-brand hover:bg-brand/90 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                            >
                                {submitting ? <IconSpinner /> : <IconSave />}
                                {submitting ? 'Registrando...' : 'Finalizar Romaneio'}
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}