"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCreateBatch } from "@/hooks/useCreateBatch";

export default function NovoLotePage() {
    const router = useRouter();
    const { mutate, isPending, isError, error } = useCreateBatch();

    const [form, setForm] = useState({
        idProduto: "",
        idDeposito: "",
        bitola: "",
        tonalidade: "",
        quantidadeInicial: "",
        numeroLote: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        mutate({
            gauge: Number(form.bitola),
            shade: Number(form.tonalidade),
            initialQuantity: Number(form.quantidadeInicial),
            batchNumber: form.numeroLote,
            productId: form.idProduto,
            warehouseId: form.idDeposito
        }, {
            onSuccess: () => {
                // Redireciona de volta para a listagem após o sucesso
                router.push("/batches");
            }
        });
    };

    return (
        <main className="p-6 max-w-lg mx-auto">
            <h1 className="text-2xl font-bold mb-4">Cadastrar Novo Lote</h1>

            {isError && <div className="p-4 bg-red-100 text-red-700 mb-4">{error.message}</div>}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {/* Nota: Em produção, idProduto e idDeposito deverão ser Selects/Comboboxes buscando de suas respectivas APIs. 
                    Usar input text aqui é apenas uma ponte temporária para viabilizar testes. */}
                <div>
                    <label className="block mb-1">ID do Produto (MongoDB ObjectId)</label>
                    <input required name="idProduto" value={form.idProduto} onChange={handleChange} className="border p-2 w-full" />
                </div>

                <div>
                    <label className="block mb-1">ID do Depósito (MongoDB ObjectId)</label>
                    <input required name="idDeposito" value={form.idDeposito} onChange={handleChange} className="border p-2 w-full" />
                </div>

                <div className="flex gap-4">
                    <div className="flex-1">
                        <label className="block mb-1">Bitola</label>
                        <input required type="number" name="bitola" value={form.bitola} onChange={handleChange} className="border p-2 w-full" />
                    </div>
                    <div className="flex-1">
                        <label className="block mb-1">Tonalidade</label>
                        <input required type="number" name="tonalidade" value={form.tonalidade} onChange={handleChange} className="border p-2 w-full" />
                    </div>
                </div>

                <div>
                    <label className="block mb-1">Quantidade Inicial</label>
                    <input required type="number" name="quantidadeInicial" value={form.quantidadeInicial} onChange={handleChange} className="border p-2 w-full" />
                </div>

                <div>
                    <label className="block mb-1">Número do Lote (Opcional)</label>
                    <input name="numeroLote" value={form.numeroLote} onChange={handleChange} className="border p-2 w-full" />
                </div>

                <button
                    type="submit"
                    disabled={isPending}
                    className="bg-blue-600 text-white p-3 mt-4 disabled:bg-blue-300"
                >
                    {isPending ? "Salvando..." : "Salvar Lote"}
                </button>
            </form>
        </main>
    );
}