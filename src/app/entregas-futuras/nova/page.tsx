'use client';

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { criarEntregaFuturaSchema, CriarEntregaFuturaInput } from '@/modules/entrega-futura/entrega-futura.validator';
import { entregaFuturaApi } from '@/modules/entrega-futura/entrega-futura.api';
import { ProductAutocomplete } from '@/components/ui/ProductAutocomplete';
import { IconChevronLeft, IconSave, IconSpinner } from '@/components/ui/Icons';
import { NotificationBanner } from '@/components/ui/NotificationBanner';
import { FormField } from '@/components/ui/FormField';

export default function NovaEntregaFuturaPage() {
    const router = useRouter();
    const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    const {
        register,
        handleSubmit,
        control,
        formState: { errors, isSubmitting },
    } = useForm<CriarEntregaFuturaInput>({
        resolver: zodResolver(criarEntregaFuturaSchema),
        defaultValues: {
            itens: []
        }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "itens"
    });

    const onSubmit = async (data: CriarEntregaFuturaInput) => {
        try {
            await entregaFuturaApi.criar(data);
            setNotification({ type: 'success', message: 'Entrega Futura registrada com sucesso!' });
            setTimeout(() => router.push('/entregas-futuras'), 1500);
        } catch (error: any) {
            setNotification({ type: 'error', message: error.message ?? 'Erro ao registrar entrega futura.' });
        }
    };

    // Estilo utilitário de input
    const inputClass = (hasError: boolean) =>
        `w-full bg-surface border rounded-xl px-3 py-2 text-sm text-primary placeholder:text-tertiary focus:outline-none focus:ring-2 transition-all ${hasError ? 'border-red-400 focus:ring-red-200' : 'border-border focus:ring-brand/20'
        }`;

    return (
        <div className="min-h-screen bg-canvas">
            <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4">

                {/* Header */}
                <div className="flex items-center gap-3">
                    <button onClick={() => router.back()} className="flex items-center justify-center w-9 h-9 rounded-xl bg-surface border border-border text-secondary hover:text-primary hover:border-brand-border transition-all">
                        <IconChevronLeft />
                    </button>
                    <div>
                        <h1 className="text-lg font-semibold text-primary">Registrar Entrega Futura</h1>
                        <p className="text-xs text-tertiary">Módulo de depósito e logística</p>
                    </div>
                </div>

                {notification && <NotificationBanner notification={notification} onDismiss={() => setNotification(null)} />}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                    {/* Grid Principal: Cliente e Endereço */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

                        {/* Seção Cliente */}
                        <div className="bg-surface border border-border rounded-xl overflow-hidden">
                            <div className="px-4 py-3 border-b border-border-subtle bg-subtle/30">
                                <h2 className="text-xs font-semibold text-tertiary uppercase">Dados do Cliente</h2>
                            </div>
                            <div className="p-4 space-y-3">
                                <FormField label="Nome / Razão Social" required error={errors.cliente?.nome?.message}>
                                    <input {...register('cliente.nome')} className={inputClass(!!errors.cliente?.nome)} placeholder="Nome completo" />
                                </FormField>
                                <div className="grid grid-cols-2 gap-3">
                                    <FormField label="CPF / CNPJ" required error={errors.cliente?.documento?.message}>
                                        <input {...register('cliente.documento')} className={inputClass(!!errors.cliente?.documento)} placeholder="Apenas números" />
                                    </FormField>
                                    <FormField label="Telefone" required error={errors.cliente?.telefone?.message}>
                                        <input {...register('cliente.telefone')} className={inputClass(!!errors.cliente?.telefone)} placeholder="(DD) 90000-0000" />
                                    </FormField>
                                </div>
                            </div>
                        </div>

                        {/* Seção Endereço */}
                        <div className="bg-surface border border-border rounded-xl overflow-hidden">
                            <div className="px-4 py-3 border-b border-border-subtle bg-subtle/30">
                                <h2 className="text-xs font-semibold text-tertiary uppercase">Endereço de Entrega</h2>
                            </div>
                            <div className="p-4 space-y-3">
                                <div className="grid grid-cols-3 gap-3">
                                    <FormField label="CEP" required error={errors.enderecoEntrega?.cep?.message}>
                                        <input {...register('enderecoEntrega.cep')} className={inputClass(!!errors.enderecoEntrega?.cep)} placeholder="00000-000" />
                                    </FormField>
                                    <FormField label="Cidade" required className="col-span-2" error={errors.enderecoEntrega?.cidade?.message}>
                                        <input {...register('enderecoEntrega.cidade')} className={inputClass(!!errors.enderecoEntrega?.cidade)} />
                                    </FormField>
                                </div>
                                <div className="grid grid-cols-4 gap-3">
                                    <FormField label="Logradouro" required className="col-span-3" error={errors.enderecoEntrega?.logradouro?.message}>
                                        <input {...register('enderecoEntrega.logradouro')} className={inputClass(!!errors.enderecoEntrega?.logradouro)} placeholder="Rua, Av, etc" />
                                    </FormField>
                                    <FormField label="Número" required error={errors.enderecoEntrega?.numero?.message}>
                                        <input {...register('enderecoEntrega.numero')} className={inputClass(!!errors.enderecoEntrega?.numero)} />
                                    </FormField>
                                </div>
                                <div className="grid grid-cols-3 gap-3">
                                    <FormField label="Bairro" required className="col-span-2" error={errors.enderecoEntrega?.bairro?.message}>
                                        <input {...register('enderecoEntrega.bairro')} className={inputClass(!!errors.enderecoEntrega?.bairro)} />
                                    </FormField>
                                    <FormField label="UF" required error={errors.enderecoEntrega?.uf?.message}>
                                        <input {...register('enderecoEntrega.uf')} maxLength={2} className={inputClass(!!errors.enderecoEntrega?.uf)} placeholder="SP" />
                                    </FormField>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Seção de Itens (O Carrinho) */}
                    <div className="bg-surface border border-border rounded-xl overflow-hidden">
                        <div className="px-4 py-3 border-b border-border-subtle bg-subtle/30 flex justify-between items-center">
                            <h2 className="text-xs font-semibold text-tertiary uppercase">Itens da Entrega</h2>
                        </div>

                        <div className="p-4 border-b border-border-subtle">
                            <FormField label="Adicionar Produto" error={errors.itens?.root?.message}>
                                <ProductAutocomplete
                                    onSelect={(produto) => {
                                        // Evitar duplicidade cega (se o cara já botou na lista, foque no item em vez de duplicar. Deixei simples aqui, mas avalie a regra de negócio)
                                        append({
                                            produtoId: produto.id,
                                            descricao: produto.descricao,
                                            quantidadeComprada: 1
                                        });
                                    }}
                                />
                            </FormField>
                        </div>

                        {/* Lista de Itens Adicionados */}
                        {fields.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-subtle/50 text-xs text-tertiary uppercase">
                                        <tr>
                                            <th className="px-4 py-3 font-medium">Produto</th>
                                            <th className="px-4 py-3 font-medium w-32">Qtd. Comprada</th>
                                            <th className="px-4 py-3 font-medium w-16 text-center">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border-subtle">
                                        {fields.map((field, index) => (
                                            <tr key={field.id} className="hover:bg-subtle/30 transition-colors">
                                                <td className="px-4 py-2 text-primary font-medium">
                                                    {field.descricao}
                                                    {errors.itens?.[index]?.produtoId && (
                                                        <span className="block text-xs text-red-500">{errors.itens[index]?.produtoId?.message}</span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-2">
                                                    <input
                                                        type="number"
                                                        step="0.01"
                                                        {...register(`itens.${index}.quantidadeComprada`, { valueAsNumber: true })}
                                                        className={inputClass(!!errors.itens?.[index]?.quantidadeComprada)}
                                                    />
                                                    {errors.itens?.[index]?.quantidadeComprada && (
                                                        <span className="block text-xs text-red-500 mt-1">{errors.itens[index]?.quantidadeComprada?.message}</span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-2 text-center">
                                                    <button
                                                        type="button"
                                                        onClick={() => remove(index)}
                                                        className="text-red-500 hover:text-red-700 p-1.5 rounded-md hover:bg-red-50 transition-colors"
                                                        title="Remover item"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="p-8 text-center text-sm text-tertiary">
                                Nenhum item adicionado à entrega ainda.
                            </div>
                        )}
                    </div>

                    {/* Footer de Ações */}
                    <div className="flex justify-end gap-3 pt-2">
                        <button type="button" onClick={() => router.back()} className="px-4 py-2 rounded-xl text-sm font-medium border border-border bg-surface text-secondary hover:bg-subtle transition-all">
                            Cancelar
                        </button>
                        <button type="submit" disabled={isSubmitting || fields.length === 0} className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-medium bg-brand hover:bg-brand/90 text-white disabled:opacity-50 transition-all">
                            {isSubmitting ? <><IconSpinner /> Salvando...</> : <><IconSave /> Registrar Entrega</>}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}