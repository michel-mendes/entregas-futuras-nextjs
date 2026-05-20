'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { CreateProdutoDTO, CreateProdutoInput } from '@/modules/produto/produto.dto';
import { CategoriaProduto } from '@/modules/produto/produto.types';
import { produtosApi } from '@/modules/produto/produtos.api';
import { IconChevronLeft, IconInfo, IconPackagePlus, IconSave, IconSpinner } from '@/components/ui/Icons';
import { INotification, NotificationBanner } from '@/components/ui/NotificationBanner';
import { FormField } from '@/components/ui/FormField';

// ─── Switch Ativo/Inativo ─────────────────────────────────────────────────────

interface SwitchProps {
    checked: boolean;
    onChange: (value: boolean) => void;
    label: string;
    description?: string;
}

function Switch({ checked, onChange, label, description }: SwitchProps) {
    return (
        <button
            type="button"
            role="switch"
            aria-checked={checked}
            onClick={() => onChange(!checked)}
            className="flex items-center justify-between w-full gap-4 group focus:outline-none"
        >
            <div className="text-left">
                <span className="text-sm font-medium text-primary block">{label}</span>
                {description && (
                    <span className="text-xs text-tertiary mt-0.5 block">{description}</span>
                )}
            </div>
            <div
                className={`relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full border-2 transition-all duration-200 focus-within:ring-2 focus-within:ring-brand/20 ${checked
                        ? 'bg-brand border-brand'
                        : 'bg-subtle border-border'
                    }`}
            >
                <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 ${checked ? 'translate-x-5' : 'translate-x-0.5'
                        }`}
                />
            </div>
        </button>
    );
}

// ─── Campo de formulário padronizado ─────────────────────────────────────────



// ─── Classes de input reutilizáveis ──────────────────────────────────────────

function inputClass(hasError: boolean) {
    return [
        'w-full bg-surface border rounded-xl px-3.5 py-2.5 text-sm text-primary',
        'placeholder:text-tertiary',
        'focus:outline-none focus:ring-2 transition-all',
        hasError
            ? 'border-red-400 focus:ring-red-200 focus:border-red-400'
            : 'border-border focus:ring-brand/20 focus:border-brand',
    ].join(' ');
}


// ─── Página: Novo Produto ─────────────────────────────────────────────────────

export default function NovoProdutoPage() {
    const router = useRouter();
    const [notification, setNotification] = useState<INotification | null>(null);

    const {
        register,
        handleSubmit,
        watch,
        control,
        formState: { errors, isSubmitting },
    } = useForm<CreateProdutoInput>({
        resolver: zodResolver(CreateProdutoDTO),
        defaultValues: {
            ativo: true,
            categoria: CategoriaProduto.GERAL,
        },
    });

    const categoriaSelecionada = watch('categoria');

    const exigeM2 = [CategoriaProduto.PISO, CategoriaProduto.PORCELANATO].includes(categoriaSelecionada);
    const exigePeso = [
        CategoriaProduto.PISO,
        CategoriaProduto.PORCELANATO,
        CategoriaProduto.ARGAMASSA,
        CategoriaProduto.REJUNTE,
    ].includes(categoriaSelecionada);

    const onSubmit = async (data: CreateProdutoInput) => {
        try {
            await produtosApi.criar(data);
            setNotification({ type: 'success', message: 'Produto cadastrado com sucesso!' });
            setTimeout(() => router.push('/produtos'), 1500);
        } catch (error: any) {
            setNotification({ type: 'error', message: error.message ?? 'Erro ao cadastrar produto.' });
        }
    };

    return (
        <div className="min-h-screen bg-canvas">
            <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 space-y-5">

                {/* ── Header ─────────────────────────────────────────────── */}
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="flex items-center justify-center w-9 h-9 rounded-xl bg-surface border border-border text-secondary hover:text-primary hover:border-brand-border hover:bg-brand-muted transition-all flex-shrink-0"
                        title="Voltar"
                    >
                        <IconChevronLeft />
                    </button>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-brand-muted border border-brand-border text-brand flex-shrink-0">
                            <IconPackagePlus />
                        </div>
                        <div>
                            <h1 className="text-lg font-semibold text-primary leading-tight tracking-tight">
                                Novo Produto
                            </h1>
                            <p className="text-xs text-tertiary mt-0.5">Preencha os dados para cadastrar</p>
                        </div>
                    </div>
                </div>

                {/* ── Notificação ─────────────────────────────────────────── */}
                {notification && (
                    <NotificationBanner
                        notification={notification}
                        onDismiss={() => setNotification(null)}
                    />
                )}

                {/* ── Formulário ──────────────────────────────────────────── */}
                <div className="bg-surface border border-border rounded-2xl overflow-hidden">

                    {/* Seção: Identificação */}
                    <div className="px-5 py-4 border-b border-border-subtle">
                        <h2 className="text-xs font-semibold text-tertiary uppercase tracking-wider">Identificação</h2>
                    </div>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="p-5 space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                                {/* SKU */}
                                <FormField label="Código SKU" required error={errors.codigoSKU?.message}>
                                    <input
                                        {...register('codigoSKU')}
                                        type="text"
                                        placeholder="Ex: PIS-001"
                                        className={inputClass(!!errors.codigoSKU)}
                                    />
                                </FormField>

                                {/* Categoria */}
                                <FormField label="Categoria" required error={errors.categoria?.message}>
                                    <select
                                        {...register('categoria')}
                                        className={inputClass(!!errors.categoria)}
                                    >
                                        <option value="">Selecione uma categoria…</option>
                                        {Object.values(CategoriaProduto).map((cat) => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </FormField>

                                {/* Descrição */}
                                <FormField
                                    label="Descrição do Produto"
                                    required
                                    error={errors.descricao?.message}
                                    className="md:col-span-2"
                                >
                                    <input
                                        {...register('descricao')}
                                        type="text"
                                        placeholder="Ex: Porcelanato Polido 70x70"
                                        className={inputClass(!!errors.descricao)}
                                    />
                                </FormField>

                                {/* URL Imagem */}
                                <FormField
                                    label="URL da Imagem"
                                    error={errors.urlImagem?.message}
                                    hint="Cole o link armazenado no storage (S3, Cloudinary, etc)."
                                    className="md:col-span-2"
                                >
                                    <input
                                        {...register('urlImagem')}
                                        type="url"
                                        placeholder="https://exemplo.com/imagem-piso.jpg"
                                        className={inputClass(!!errors.urlImagem)}
                                    />
                                </FormField>
                            </div>
                        </div>

                        {/* Seção: Precificação */}
                        <div className="px-5 py-4 border-t border-b border-border-subtle bg-subtle/50">
                            <h2 className="text-xs font-semibold text-tertiary uppercase tracking-wider">Precificação</h2>
                        </div>
                        <div className="p-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                                {/* Preço à Vista */}
                                <FormField label="Preço à Vista (R$)" required error={errors.precoVista?.message}>
                                    <input
                                        {...register('precoVista', { valueAsNumber: true })}
                                        type="number"
                                        step="0.01"
                                        placeholder="0,00"
                                        className={inputClass(!!errors.precoVista)}
                                    />
                                </FormField>

                                {/* Preço a Prazo */}
                                <FormField label="Preço a Prazo (R$)" required error={errors.precoPrazo?.message}>
                                    <input
                                        {...register('precoPrazo', { valueAsNumber: true })}
                                        type="number"
                                        step="0.01"
                                        placeholder="0,00"
                                        className={inputClass(!!errors.precoPrazo)}
                                    />
                                </FormField>
                            </div>
                        </div>

                        {/* Seção: Dados Técnicos (condicional) */}
                        {(exigePeso || exigeM2) && (
                            <>
                                <div className="px-5 py-4 border-t border-b border-border-subtle bg-subtle/50">
                                    <h2 className="text-xs font-semibold text-tertiary uppercase tracking-wider">Dados Técnicos</h2>
                                </div>
                                <div className="p-5">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        {exigePeso && (
                                            <FormField
                                                label="Peso da Embalagem (kg)"
                                                required
                                                error={errors.pesoEmbalagemKg?.message}
                                            >
                                                <input
                                                    {...register('pesoEmbalagemKg', { valueAsNumber: true })}
                                                    type="number"
                                                    step="0.01"
                                                    placeholder="0,00"
                                                    className={inputClass(!!errors.pesoEmbalagemKg)}
                                                />
                                            </FormField>
                                        )}
                                        {exigeM2 && (
                                            <FormField
                                                label="Metragem da Embalagem (m²)"
                                                required
                                                error={errors.m2Embalagem?.message}
                                            >
                                                <input
                                                    {...register('m2Embalagem', { valueAsNumber: true })}
                                                    type="number"
                                                    step="0.01"
                                                    placeholder="0,00"
                                                    className={inputClass(!!errors.m2Embalagem)}
                                                />
                                            </FormField>
                                        )}
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Seção: Configurações */}
                        <div className="px-5 py-4 border-t border-b border-border-subtle bg-subtle/50">
                            <h2 className="text-xs font-semibold text-tertiary uppercase tracking-wider">Configurações</h2>
                        </div>
                        <div className="p-5">
                            <div className="bg-subtle rounded-xl border border-border-subtle px-4 py-3.5">
                                <Controller
                                    name="ativo"
                                    control={control}
                                    render={({ field }) => (
                                        <Switch
                                            checked={!!field.value}
                                            onChange={field.onChange}
                                            label="Produto Ativo"
                                            description="Produtos inativos não aparecem no ponto de venda."
                                        />
                                    )}
                                />
                            </div>
                        </div>

                        {/* ── Rodapé de Ações ────────────────────────────── */}
                        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 px-5 py-4 border-t border-border-subtle bg-subtle/30">
                            <button
                                type="button"
                                onClick={() => router.back()}
                                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border border-border bg-surface text-secondary hover:text-primary hover:border-brand-border hover:bg-brand-muted transition-all"
                            >
                                <IconChevronLeft />
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium bg-brand hover:bg-brand/90 active:scale-95 text-white shadow-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none transition-all"
                            >
                                {isSubmitting ? (
                                    <>
                                        <IconSpinner />
                                        Salvando…
                                    </>
                                ) : (
                                    <>
                                        <IconSave />
                                        Salvar Produto
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}