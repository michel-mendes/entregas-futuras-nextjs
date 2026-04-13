'use client';

import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useParams } from 'next/navigation';
import { UpdateProdutoDTO, UpdateProdutoInput } from '@/dtos/produto.dto';
import { CategoriaProduto } from '@/types/produto.types';
import { produtosApi } from '@/services/api/produtos.api';

// ─── Ícones ───────────────────────────────────────────────────────────────────

function IconEdit() {
    return (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
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

function IconLock() {
    return (
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
    );
}

function IconImage() {
    return (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
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

function IconWarning() {
    return (
        <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
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
                className={`relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full border-2 transition-all duration-200 ${checked
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

// ─── Notificação inline ───────────────────────────────────────────────────────

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

// ─── Preview de imagem com fallback via estado ────────────────────────────────

function ImagePreview({ url }: { url?: string }) {
    const [broken, setBroken] = useState(false);

    if (!url) return null;

    if (broken) {
        return (
            <div
                className="w-16 h-16 flex-shrink-0 rounded-xl border border-red-200 bg-red-50 flex items-center justify-center text-red-400"
                title="URL inválida ou inacessível"
            >
                <IconImage />
            </div>
        );
    }

    return (
        <img
            src={url}
            alt="Pré-visualização"
            onError={() => setBroken(true)}
            className="w-16 h-16 flex-shrink-0 object-cover rounded-xl border border-border bg-subtle"
        />
    );
}

// ─── Estado de erro fatal ─────────────────────────────────────────────────────

function FatalError({ message, onBack }: { message: string; onBack: () => void }) {
    return (
        <div className="min-h-screen bg-canvas flex items-center justify-center px-4">
            <div className="w-full max-w-md bg-surface border border-border rounded-2xl p-6 text-center space-y-4">
                <div className="flex justify-center text-red-500">
                    <IconWarning />
                </div>
                <div>
                    <p className="font-semibold text-primary">Erro ao carregar produto</p>
                    <p className="text-sm text-tertiary mt-1">{message}</p>
                </div>
                <button
                    onClick={onBack}
                    className="inline-flex items-center gap-2 text-sm font-medium text-brand border border-brand-border bg-brand-muted hover:bg-brand hover:text-white px-4 py-2 rounded-xl transition-all"
                >
                    <IconChevronLeft />
                    Voltar para a lista
                </button>
            </div>
        </div>
    );
}

// ─── Skeleton de loading ──────────────────────────────────────────────────────

function LoadingSkeleton() {
    return (
        <div className="min-h-screen bg-canvas">
            <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 space-y-5">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-subtle animate-pulse" />
                    <div className="w-10 h-10 rounded-xl bg-subtle animate-pulse" />
                    <div className="space-y-1.5">
                        <div className="w-36 h-4 rounded bg-subtle animate-pulse" />
                        <div className="w-48 h-3 rounded bg-subtle animate-pulse" />
                    </div>
                </div>
                <div className="bg-surface border border-border rounded-2xl overflow-hidden">
                    <div className="px-5 py-4 border-b border-border-subtle">
                        <div className="w-28 h-3 rounded bg-subtle animate-pulse" />
                    </div>
                    <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-5">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="space-y-2">
                                <div className="w-24 h-3 rounded bg-subtle animate-pulse" />
                                <div className="w-full h-10 rounded-xl bg-subtle animate-pulse" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── Página: Editar Produto ───────────────────────────────────────────────────

export default function EditarProdutoPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;

    const [isLoading, setIsLoading] = useState(true);
    const [errorInicial, setErrorInicial] = useState<string | null>(null);
    const [codigoSkuReadOnly, setCodigoSkuReadOnly] = useState('');
    const [notification, setNotification] = useState<Notification | null>(null);

    const {
        register,
        handleSubmit,
        watch,
        reset,
        control,
        formState: { errors, isSubmitting },
    } = useForm<UpdateProdutoInput>({
        resolver: zodResolver(UpdateProdutoDTO),
    });

    const categoriaSelecionada = watch('categoria');
    const urlImagemAtual = watch('urlImagem');

    const exigeM2 =
        categoriaSelecionada &&
        [CategoriaProduto.PISO, CategoriaProduto.PORCELANATO].includes(
            categoriaSelecionada as CategoriaProduto
        );
    const exigePeso =
        categoriaSelecionada &&
        [
            CategoriaProduto.PISO,
            CategoriaProduto.PORCELANATO,
            CategoriaProduto.ARGAMASSA,
            CategoriaProduto.REJUNTE,
        ].includes(categoriaSelecionada as CategoriaProduto);

    useEffect(() => {
        if (!id) return;

        const carregarProduto = async () => {
            try {
                const produto = await produtosApi.buscarPorId(id);
                setCodigoSkuReadOnly(produto.codigoSKU);
                reset({
                    descricao: produto.descricao,
                    urlImagem: produto.urlImagem,
                    precoVista: produto.precoVista,
                    precoPrazo: produto.precoPrazo,
                    categoria: produto.categoria as CategoriaProduto,
                    pesoEmbalagemKg: produto.pesoEmbalagemKg,
                    m2Embalagem: produto.m2Embalagem,
                    ativo: produto.ativo,
                });
            } catch (error: any) {
                setErrorInicial(error.message ?? 'Erro desconhecido ao carregar produto.');
            } finally {
                setIsLoading(false);
            }
        };

        carregarProduto();
    }, [id, reset]);

    const onSubmit = async (data: UpdateProdutoInput) => {
        try {
            await produtosApi.atualizar(id, data);
            setNotification({ type: 'success', message: 'Produto atualizado com sucesso!' });
            setTimeout(() => router.push('/produtos'), 1500);
        } catch (error: any) {
            setNotification({ type: 'error', message: error.message ?? 'Erro ao atualizar produto.' });
        }
    };

    if (isLoading) return <LoadingSkeleton />;
    if (errorInicial) return <FatalError message={errorInicial} onBack={() => router.push('/produtos')} />;

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
                            <IconEdit />
                        </div>
                        <div>
                            <h1 className="text-lg font-semibold text-primary leading-tight tracking-tight">
                                Editar Produto
                            </h1>
                            <p className="font-mono text-xs text-tertiary mt-0.5 uppercase tracking-wider">
                                {codigoSkuReadOnly}
                            </p>
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

                                {/* SKU (bloqueado) */}
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-medium text-primary">Código SKU</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            disabled
                                            value={codigoSkuReadOnly}
                                            className="w-full bg-subtle border border-border-subtle rounded-xl px-3.5 py-2.5 text-sm text-disabled font-mono cursor-not-allowed pr-10"
                                            title="O SKU não pode ser alterado por integridade do sistema legado."
                                        />
                                        <div className="absolute inset-y-0 right-3 flex items-center text-disabled pointer-events-none">
                                            <IconLock />
                                        </div>
                                    </div>
                                    <span className="flex items-center gap-1 text-xs text-tertiary">
                                        <IconInfo />
                                        Bloqueado por integridade do sistema legado.
                                    </span>
                                </div>

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
                                        className={inputClass(!!errors.descricao)}
                                    />
                                </FormField>

                                {/* URL Imagem com preview */}
                                <div className="flex flex-col gap-1.5 md:col-span-2">
                                    <label className="text-sm font-medium text-primary">
                                        URL da Imagem
                                    </label>
                                    <div className="flex items-center gap-3">
                                        <input
                                            {...register('urlImagem')}
                                            type="url"
                                            placeholder="https://exemplo.com/imagem-piso.jpg"
                                            className={`${inputClass(!!errors.urlImagem)} flex-1`}
                                        />
                                        <ImagePreview url={urlImagemAtual} />
                                    </div>
                                    <span className="flex items-center gap-1 text-xs text-tertiary">
                                        <IconInfo />
                                        Altere o link para atualizar a imagem do produto.
                                    </span>
                                    {errors.urlImagem && (
                                        <span className="text-xs text-red-600 font-medium">
                                            {errors.urlImagem.message}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Seção: Precificação */}
                        <div className="px-5 py-4 border-t border-b border-border-subtle bg-subtle/50">
                            <h2 className="text-xs font-semibold text-tertiary uppercase tracking-wider">Precificação</h2>
                        </div>
                        <div className="p-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <FormField label="Preço à Vista (R$)" required error={errors.precoVista?.message}>
                                    <input
                                        {...register('precoVista', { valueAsNumber: true })}
                                        type="number"
                                        step="0.01"
                                        placeholder="0,00"
                                        className={inputClass(!!errors.precoVista)}
                                    />
                                </FormField>

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
                                        Atualizando…
                                    </>
                                ) : (
                                    <>
                                        <IconSave />
                                        Salvar Alterações
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