'use client';

import { useState } from 'react';
import { useProdutos } from '@/hooks/useProdutos';
import Link from 'next/link';

// ─── Ícones SVG isolados — sem inline styles, sem magic numbers ───────────────

function IconChevronDown() {
    return (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
    );
}

function IconSearch() {
    return (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
    );
}

function IconPlus() {
    return (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
    );
}

function IconEdit() {
    return (
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
    );
}

function IconChevronLeft() {
    return (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
    );
}

function IconChevronRight() {
    return (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
    );
}

function IconPackage() {
    return (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
    );
}

function IconImage() {
    return (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
    );
}

function IconWarning() {
    return (
        <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
        </svg>
    );
}

function IconEmptyBox() {
    return (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
    );
}

// ─── Thumbnail do produto ─────────────────────────────────────────────────────

function ProductThumbnail({ url, descricao }: { url?: string; descricao: string }) {
    if (url) {
        return (
            <img
                src={url}
                alt={`Imagem de ${descricao}`}
                className="w-10 h-10 rounded-lg object-cover bg-subtle border border-border-subtle flex-shrink-0"
            />
        );
    }

    return (
        <div
            className="w-10 h-10 rounded-lg bg-subtle border border-border-subtle flex items-center justify-center text-disabled flex-shrink-0"
            title="Sem imagem cadastrada"
        >
            <IconImage />
        </div>
    );
}

// ─── Spinner centralizado ─────────────────────────────────────────────────────

function LoadingSpinner() {
    return (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
            <svg
                className="animate-spin w-7 h-7 text-brand"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
            >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
            </svg>
            <span className="text-xs text-tertiary tracking-wide">Carregando produtos…</span>
        </div>
    );
}

// ─── Estado vazio ─────────────────────────────────────────────────────────────

function EmptyState() {
    return (
        <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
            <div className="w-16 h-16 rounded-2xl bg-subtle border border-border flex items-center justify-center text-tertiary">
                <IconEmptyBox />
            </div>
            <div className="space-y-1">
                <p className="text-sm font-medium text-primary">Nenhum produto encontrado</p>
                <p className="text-xs text-tertiary max-w-xs">
                    Tente ajustar o filtro de busca ou cadastre um novo produto.
                </p>
            </div>
            <Link
                href="/produtos/novo"
                className="inline-flex items-center gap-2 text-xs font-medium text-brand border border-brand-border bg-brand-muted hover:bg-brand hover:text-white px-4 py-2 rounded-lg transition-all"
            >
                <IconPlus />
                Cadastrar produto
            </Link>
        </div>
    );
}

// ─── Página principal ─────────────────────────────────────────────────────────

export default function ProdutosPage() {
    const { data, isLoading, error, setPage, handleBuscar } = useProdutos(20);

    const [termoBusca, setTermoBusca] = useState('');
    const [apenasAtivos, setApenasAtivos] = useState(true);

    const atualizarFiltros = (novoTermo: string, novoStatus: boolean) => {
        setTermoBusca(novoTermo);
        setApenasAtivos(novoStatus);
        handleBuscar(novoStatus, novoTermo);
    };

    return (
        <div className="min-h-screen bg-canvas">
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 space-y-5">

                {/* ── Header ───────────────────────────────────────────────── */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                        {/* Ícone de marca com accent brand */}
                        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-brand-muted border border-brand-border text-brand flex-shrink-0">
                            <IconPackage />
                        </div>
                        <div>
                            <h1 className="text-lg font-semibold text-primary leading-tight tracking-tight">
                                Catálogo de Produtos
                            </h1>
                            <p className="text-xs text-tertiary mt-0.5">
                                Gerencie e consulte o portfólio completo
                            </p>
                        </div>
                    </div>

                    <Link
                        href="/produtos/novo"
                        className="inline-flex items-center justify-center gap-2 bg-brand hover:bg-brand/90 active:scale-95 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all w-full sm:w-auto shadow-sm"
                    >
                        <IconPlus />
                        Novo Produto
                    </Link>
                </div>

                <div className='flex gap-2'>
                    {/* ── Barra de busca ───────────────────────────────────────── */}
                    <div className="relative flex-1">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-tertiary">
                            <IconSearch />
                        </div>
                        <input
                            type="text"
                            placeholder="Buscar por SKU ou Descrição…"
                            value={termoBusca}
                            onChange={(e) => atualizarFiltros(e.target.value, apenasAtivos)}
                            className="w-full bg-surface border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm text-primary placeholder:text-tertiary focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all"
                        />
                    </div>

                    <div className="relative shrink-0 sm:w-48">
                        <select
                            value={apenasAtivos.toString()}
                            onChange={(e) => atualizarFiltros(termoBusca, e.target.value === 'true')}
                            className="w-full appearance-none bg-surface border border-border rounded-xl pl-4 pr-10 py-2.5 text-sm text-primary focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all cursor-pointer"
                        >
                            <option value="true">Apenas Ativos</option>
                            <option value="false">Apenas Inativos</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-tertiary">
                            <IconChevronDown />
                        </div>
                    </div>
                </div>

                {/* ── Erro ─────────────────────────────────────────────────── */}
                {error && (
                    <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">
                        <IconWarning />
                        <p>{error}</p>
                    </div>
                )}

                {/* ── Conteúdo principal ───────────────────────────────────── */}
                {isLoading ? (
                    <LoadingSpinner />
                ) : (
                    <>
                        {/* Empty state */}
                        {!data?.data.length && <EmptyState />}

                        {/* ── MOBILE: Cards empilhados (oculto em md+) ─────── */}
                        {!!data?.data.length && (
                            <div className="flex flex-col gap-2 md:hidden">
                                {data.data.map((produto) => (
                                    <Link
                                        key={produto.id}
                                        href={`/produtos/${produto.id}/editar`}
                                        className="group bg-surface border border-border rounded-xl p-4 flex items-center gap-4 hover:border-brand-border hover:shadow-sm active:scale-[0.99] transition-all"
                                    >
                                        <ProductThumbnail url={produto.urlImagem} descricao={produto.descricao} />

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between gap-2">
                                                <span className="font-mono text-xs font-medium text-tertiary uppercase tracking-wider truncate">
                                                    {produto.codigoSKU}
                                                </span>
                                                <span className="flex-shrink-0 text-xs bg-subtle text-secondary px-2 py-0.5 rounded-md">
                                                    {produto.categoria}
                                                </span>
                                            </div>
                                            <p className="text-sm font-medium text-primary mt-0.5 line-clamp-1">
                                                {produto.descricao}
                                            </p>
                                            <p className="font-mono text-sm font-semibold text-brand mt-1">
                                                {produto.precoVista.toLocaleString('pt-BR', {
                                                    style: 'currency',
                                                    currency: 'BRL',
                                                })}
                                            </p>
                                        </div>

                                        {/* Seta indicativa de navegação */}
                                        <div className="flex-shrink-0 text-disabled group-hover:text-brand transition-colors">
                                            <IconChevronRight />
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}

                        {/* ── DESKTOP: Tabela (oculta no mobile) ──────────── */}
                        {!!data?.data.length && (
                            <div className="hidden md:block bg-surface border border-border rounded-xl overflow-hidden">
                                <table className="min-w-full">
                                    <thead>
                                        <tr className="border-b border-border-subtle bg-subtle">
                                            <th className="w-16 px-4 py-3 text-center">
                                                <span className="text-xs font-medium text-tertiary uppercase tracking-wider">
                                                    Img
                                                </span>
                                            </th>
                                            <th className="px-4 py-3 text-left">
                                                <span className="text-xs font-medium text-tertiary uppercase tracking-wider">
                                                    SKU
                                                </span>
                                            </th>
                                            <th className="px-4 py-3 text-left">
                                                <span className="text-xs font-medium text-tertiary uppercase tracking-wider">
                                                    Descrição
                                                </span>
                                            </th>
                                            <th className="px-4 py-3 text-left">
                                                <span className="text-xs font-medium text-tertiary uppercase tracking-wider">
                                                    Categoria
                                                </span>
                                            </th>
                                            <th className="px-4 py-3 text-right">
                                                <span className="text-xs font-medium text-tertiary uppercase tracking-wider">
                                                    Preço à Vista
                                                </span>
                                            </th>
                                            <th className="px-4 py-3 text-center w-24">
                                                <span className="text-xs font-medium text-tertiary uppercase tracking-wider">
                                                    Ação
                                                </span>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border-subtle">
                                        {data.data.map((produto) => (
                                            <tr
                                                key={produto.id}
                                                className="group hover:bg-brand-muted transition-colors"
                                            >
                                                {/* Thumbnail */}
                                                <td className="px-4 py-3">
                                                    <div className="flex justify-center">
                                                        <ProductThumbnail
                                                            url={produto.urlImagem}
                                                            descricao={produto.descricao}
                                                        />
                                                    </div>
                                                </td>

                                                {/* SKU */}
                                                <td className="px-4 py-3 whitespace-nowrap">
                                                    <span className="font-mono text-xs font-medium text-secondary uppercase tracking-wider">
                                                        {produto.codigoSKU}
                                                    </span>
                                                </td>

                                                {/* Descrição */}
                                                <td className="px-4 py-3 max-w-xs lg:max-w-md">
                                                    <p className="text-sm text-primary line-clamp-2">
                                                        {produto.descricao}
                                                    </p>
                                                </td>

                                                {/* Categoria */}
                                                <td className="px-4 py-3 whitespace-nowrap">
                                                    <span className="inline-flex items-center text-xs bg-subtle text-secondary px-2.5 py-1 rounded-md border border-border-subtle">
                                                        {produto.categoria}
                                                    </span>
                                                </td>

                                                {/* Preço */}
                                                <td className="px-4 py-3 whitespace-nowrap text-right">
                                                    <span className="font-mono text-sm font-semibold text-brand">
                                                        {produto.precoVista.toLocaleString('pt-BR', {
                                                            style: 'currency',
                                                            currency: 'BRL',
                                                        })}
                                                    </span>
                                                </td>

                                                {/* Ação */}
                                                <td className="px-4 py-3 text-center">
                                                    <Link
                                                        href={`/produtos/${produto.id}/editar`}
                                                        title={`Editar: ${produto.descricao}`}
                                                        className="inline-flex items-center gap-1.5 text-xs font-medium text-secondary hover:text-brand bg-subtle hover:bg-brand-muted border border-border hover:border-brand-border px-3 py-1.5 rounded-lg transition-all"
                                                    >
                                                        <IconEdit />
                                                        Editar
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* ── Paginação ────────────────────────────────────── */}
                        {data && data.meta.totalPaginas > 1 && (
                            <div className="flex items-center justify-between gap-4 bg-surface border border-border rounded-xl px-4 py-3">
                                <span className="text-xs text-tertiary">
                                    Página{' '}
                                    <span className="font-medium text-primary">{data.meta.paginaAtual}</span>
                                    {' '}de{' '}
                                    <span className="font-medium text-primary">{data.meta.totalPaginas}</span>
                                </span>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                                        disabled={!data.meta.temPaginaAnterior}
                                        className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border border-border bg-subtle text-secondary hover:bg-brand-muted hover:border-brand-border hover:text-brand disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none transition-all"
                                    >
                                        <IconChevronLeft />
                                        Anterior
                                    </button>
                                    <button
                                        onClick={() => setPage((p) => p + 1)}
                                        disabled={!data.meta.temProximaPagina}
                                        className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border border-border bg-subtle text-secondary hover:bg-brand-muted hover:border-brand-border hover:text-brand disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none transition-all"
                                    >
                                        Próxima
                                        <IconChevronRight />
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}