"use client";

import { useBatches } from "@/hooks/useBatches";
import { useState } from "react";

import { PlusCircle } from "lucide-react"
import Link from "next/link";
import { BatchSearchFilters } from "@/modules/batch/domain/batch.repository";

export default function LotesPage() {
    const [filters, setFilters] = useState<BatchSearchFilters>({
        page: 1,
        limit: 10,
        productName: "",
        warehouseName: "",
        status: "ALL"
    });
    const [pagina, setPagina] = useState(1);
    const [limite, setLimite] = useState(10);

    const { data, isLoading, isError, error } = useBatches(filters);

    if (isLoading) return <div>Carregando lotes...</div>
    if (isError) return <div>Erro ao carregar lotes: {error.message}</div>;

    return (
        <main className="p-6">
            <h1 className="text-2xl font-bold mb-4">Estoque de Lotes</h1>

            <Link
                href="/batches/new"
                className="inline-flex items-center justify-center gap-2 bg-brand hover:bg-brand/90 active:scale-95 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all w-full sm:w-auto shadow-sm"
            >
                <PlusCircle />
                Novo Lote
            </Link>

            <table className="min-w-full border-collapse border">
                <thead>
                    <tr>
                        <th className="border p-2">Produto</th>
                        <th className="border p-2">Localização</th>
                        <th className="border p-2">Lote</th>
                        <th className="border p-2">Tonalidade</th>
                        <th className="border p-2">Bitola</th>
                        <th className="border p-2">Qtd Disponível</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        (data && data.data) && data.data.map((lote) => (
                            <tr key={lote.id}>
                                <td className="border p-2">{lote.productName || "N/A"}</td>
                                <td className="border p-2">{`${lote.warehouseName || "N/A"}${lote.detailedLocation ? `(${lote.detailedLocation})` : ""}`}</td>
                                <td className="border p-2">{lote.batchNumber || "N/A"}</td>
                                <td className="border p-2">{lote.shade}</td>
                                <td className="border p-2">{lote.gauge}</td>
                                <td className="border p-2">{lote.currentQuantity - lote.reservedQuantity}</td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>

            {/* Controles de Paginação */}
            <div className="flex gap-4 mt-4">
                <button
                    disabled={data?.meta?.temPaginaAnterior}
                    onClick={() => setPagina(old => Math.max(old - 1, 1))}
                    className="px-4 py-2 bg-gray-200 disabled:opacity-50"
                >
                    Anterior
                </button>
                <span className="py-2">Página {data?.meta?.paginaAtual} de {data?.meta?.totalPaginas}</span>
                <button
                    disabled={!data?.meta?.temProximaPagina}
                    onClick={() => setPagina(old => old + 1)}
                    className="px-4 py-2 bg-gray-200 disabled:opacity-50"
                >
                    Próxima
                </button>
            </div>
        </main>
    );
}