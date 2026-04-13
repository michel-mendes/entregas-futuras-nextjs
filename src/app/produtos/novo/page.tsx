'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { CreateProdutoDTO, CreateProdutoInput } from '@/dtos/produto.dto';
import { CategoriaProduto } from '@/types/produto.types';
import { produtosApi } from '@/services/api/produtos.api';

// ─── Ícones ───────────────────────────────────────────────────────────────────

function IconPackagePlus() {
    return (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 12v6m3-3H9" />
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

function IconSave() {
    return (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V7l-4-4z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 3v4H7V3M12 12v6m-3-3h6" />
        </svg>
    );
}

function IconSpinner() {
    return (
        <svg className="w-4 h-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
    );
}

function IconCheckCircle() {
    return (
        <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    );
}

function IconXCircle() {
    return (
        <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    );
}

function IconInfo() {
    return (
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    );
}

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

interface FormFieldProps {
    label: string;
    required?: boolean;
    error?: string;
    hint?: string;
    children: React.ReactNode;
    className?: string;
}

function FormField({ label, required, error, hint, children, className = '' }: FormFieldProps) {
    return (
        <div className={`flex flex-col gap-1.5 ${className}`}>
            <label className="text-sm font-medium text-primary">
                {label}
                {required && <span className="text-brand ml-0.5">*</span>}
            </label>
            {children}
            {hint && !error && (
                <span className="flex items-center gap-1 text-xs text-tertiary">
                    <IconInfo />
                    {hint}
                </span>
            )}
            {error && (
                <span className="text-xs text-red-600 font-medium">{error}</span>
            )}
        </div>
    );
}

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

// ─── Notificação inline (substitui alert) ────────────────────────────────────

interface Notification {
    type: 'success' | 'error';
    message: string;
}

function NotificationBanner({ notification, onDismiss }: { notification: Notification; onDismiss: () => void }) {
    const isSuccess = notification.type === 'success';
    return (
        <div
            className={`flex items-start gap-3 rounded-xl px-4 py-3.5 text-sm font-medium ${isSuccess
                    ? 'bg-green-50 border border-green-200 text-green-800'
                    : 'bg-red-50 border border-red-200 text-red-800'
                }`}
        >
            {isSuccess ? <IconCheckCircle /> : <IconXCircle />}
            <span className="flex-1">{notification.message}</span>
            <button
                type="button"
                onClick={onDismiss}
                className="flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity ml-auto"
            >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
    );
}

// ─── Página: Novo Produto ─────────────────────────────────────────────────────

export default function NovoProdutoPage() {
    const router = useRouter();
    const [notification, setNotification] = useState<Notification | null>(null);

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