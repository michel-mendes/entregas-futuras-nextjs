"use client";

import { FormField } from "@/components/ui/FormField";
import { Switch } from "@/components/ui/Switch";
import { getCategoryFriendlyNames, ProductCategory, ProductProps } from "@/modules/product/domain/product.entity";
import { ChevronLeft, LoaderCircle, Lock, Info, Save } from "lucide-react";
import { useMemo } from "react";
import { Controller, UseFormReturn } from "react-hook-form";

interface ProductFormProps {
    formMethods: UseFormReturn<ProductProps>;
    onSubmit: (data: ProductProps) => void;
    onCancel: () => void;
    isEditing?: boolean;
    skuReadOnly?: string;
}

export function ProductForm({
    formMethods,
    onSubmit,
    onCancel,
    isEditing = false,
    skuReadOnly = ""
}: ProductFormProps) {
    const {
        register,
        handleSubmit,
        watch,
        control,
        formState: { errors, isSubmitting }
    } = formMethods;

    const selectedCategory = watch("category");

    const categoryNames = useMemo(() => {
        return [...getCategoryFriendlyNames()];
    }, []);

    const isM2Required = [ProductCategory.FLOOR_TILE, ProductCategory.PORCELAIN_TILE].includes(selectedCategory);
    const isWeightRequired = [
        ProductCategory.FLOOR_TILE,
        ProductCategory.PORCELAIN_TILE,
        ProductCategory.MORTAR,
        ProductCategory.GROUT,
    ].includes(selectedCategory);

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="bg-surface border border-border rounded-2xl overflow-hidden">

                {/* Seção: Identificação */}
                <div className="px-5 py-4 border-b border-border-subtle">
                    <h2 className="text-xs font-semibold text-tertiary uppercase tracking-wider">Product identification</h2>
                </div>

                <div className="p-5 space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                        {/* SKU Code (Editável na criação, bloqueado na edição) */}
                        {isEditing ? (
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-medium text-primary">SKU Code</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        disabled
                                        value={skuReadOnly}
                                        className="w-full bg-subtle border border-border-subtle rounded-xl px-3.5 py-2.5 text-sm text-disabled font-mono cursor-not-allowed pr-10"
                                    />
                                    <div className="absolute inset-y-0 right-3 flex items-center text-disabled pointer-events-none">
                                        <Lock className="w-4 h-4" />
                                    </div>
                                </div>
                                <span className="flex items-center gap-1 text-xs text-tertiary">
                                    <Info className="w-3.5 h-3.5" />
                                    Locked system integrity.
                                </span>
                            </div>
                        ) : (
                            <FormField
                                label="SKU Code"
                                required
                                error={errors.skuCode?.message}
                            >
                                <input
                                    {...register("skuCode")}
                                    type="text"
                                    placeholder="e.g.: PIS-001"
                                    className="w-full bg-surface border border-border rounded-xl px-3.5 py-2.5 text-sm text-primary placeholder:text-tertiary focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all"
                                />
                            </FormField>
                        )}

                        <FormField
                            label="Category"
                            required
                            error={errors.category?.message}
                        >
                            <select
                                {...register("category")}
                                className="w-full bg-surface border border-border rounded-xl px-3.5 py-2.5 text-sm text-primary placeholder:text-tertiary focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all"
                            >
                                <option value="">Select a category...</option>
                                {categoryNames.map(category => (
                                    <option key={category.name} value={`${category.name}`}>
                                        {category.friendlyName}
                                    </option>
                                ))}
                            </select>
                        </FormField>

                        <FormField
                            label="Product name"
                            required
                            error={errors.name?.message}
                            className="md:col-span-2"
                        >
                            <input
                                {...register("name")}
                                type="text"
                                placeholder="e.g.: Porcelain tile 70x70"
                                className="w-full bg-surface border border-border rounded-xl px-3.5 py-2.5 text-sm text-primary placeholder:text-tertiary focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all"
                            />
                        </FormField>

                        <FormField
                            label="Image URL"
                            error={errors.imageUrl?.message}
                            hint="Paste storage link (S3, Cloudinary...)."
                            className="md:col-span-2"
                        >
                            <input
                                {...register("imageUrl")}
                                type="url"
                                placeholder="https://example.com/image.jpg"
                                className="w-full bg-surface border border-border rounded-xl px-3.5 py-2.5 text-sm text-primary placeholder:text-tertiary focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all"
                            />
                        </FormField>

                    </div>
                </div>

                {/* Seção: Preços */}
                <div className="px-5 py-4 border-t border-b border-border-subtle bg-subtle/50">
                    <h2 className="text-xs font-semibold text-tertiary uppercase tracking-wider">Product prices</h2>
                </div>

                <div className="p-5">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <FormField
                            label="Cost price"
                            required
                            error={errors.priceCost?.message}
                        >
                            <input
                                {...register("priceCost", { valueAsNumber: true })}
                                type="number"
                                step={0.01}
                                placeholder="0,00"
                                className="w-full bg-surface border border-border rounded-xl px-3.5 py-2.5 text-sm text-primary placeholder:text-tertiary focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all"
                            />
                        </FormField>

                        <FormField
                            label="Full pay price"
                            required
                            error={errors.priceCash?.message}
                        >
                            <input
                                {...register("priceCash", { valueAsNumber: true })}
                                type="number"
                                step={0.01}
                                placeholder="0,00"
                                className="w-full bg-surface border border-border rounded-xl px-3.5 py-2.5 text-sm text-primary placeholder:text-tertiary focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all"
                            />
                        </FormField>

                        <FormField
                            label="Installments price"
                            required
                            error={errors.priceInstallments?.message}
                        >
                            <input
                                {...register("priceInstallments", { valueAsNumber: true })}
                                type="number"
                                step={0.01}
                                placeholder="0,00"
                                className="w-full bg-surface border border-border rounded-xl px-3.5 py-2.5 text-sm text-primary placeholder:text-tertiary focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all"
                            />
                        </FormField>
                    </div>
                </div>

                {/* Seção: Dados Técnicos (Condicional) */}
                {(isWeightRequired || isM2Required) && (
                    <>
                        <div className="px-5 py-4 border-t border-b border-border-subtle bg-subtle/50">
                            <h2 className="text-xs font-semibold text-tertiary uppercase tracking-wider">Package data</h2>
                        </div>

                        <div className="p-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {isWeightRequired && (
                                    <FormField
                                        label="Package weight (kg)"
                                        required
                                        error={errors.packageData?.weightKg?.message}
                                    >
                                        <input
                                            {...register("packageData.weightKg", { valueAsNumber: true })}
                                            type="number"
                                            step={0.01}
                                            placeholder="0,00"
                                            className="w-full bg-surface border border-border rounded-xl px-3.5 py-2.5 text-sm text-primary placeholder:text-tertiary focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all"
                                        />
                                    </FormField>
                                )}

                                {isM2Required && (
                                    <FormField
                                        label="Coverage area per package (m²)"
                                        required
                                        error={errors.packageData?.areaM2?.message}
                                    >
                                        <input
                                            {...register("packageData.areaM2", { valueAsNumber: true })}
                                            type="number"
                                            step={0.01}
                                            placeholder="0,00"
                                            className="w-full bg-surface border border-border rounded-xl px-3.5 py-2.5 text-sm text-primary placeholder:text-tertiary focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all"
                                        />
                                    </FormField>
                                )}
                            </div>
                        </div>
                    </>
                )}

                {/* Seção: Configurações */}
                <div className="px-5 py-4 border-t border-b border-border-subtle bg-subtle/50">
                    <h2 className="text-xs font-semibold text-tertiary uppercase tracking-wider">Configurations</h2>
                </div>

                <div className="p-5">
                    <div className="bg-subtle rounded-xl border border-border-subtle px-4 py-3.5">
                        <Controller
                            name="active"
                            control={control}
                            render={({ field }) => (
                                <Switch
                                    checked={!!field.value}
                                    onChange={field.onChange}
                                    label="Product status (Active / Inactive)"
                                    description="Inactive products can be hidden in the listing."
                                />
                            )}
                        />
                    </div>
                </div>

                {/* Rodapé de Ações */}
                <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 px-5 py-4 border-t border-border-subtle bg-subtle/30">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border border-border bg-surface text-secondary hover:text-primary hover:border-brand-border hover:bg-brand-muted transition-all"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium bg-brand hover:bg-brand/90 active:scale-95 text-white shadow-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none transition-all"
                    >
                        {isSubmitting ? (
                            <>
                                <LoaderCircle className="w-4 h-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4" />
                                Save product
                            </>
                        )}
                    </button>
                </div>

            </div>
        </form>
    );
}