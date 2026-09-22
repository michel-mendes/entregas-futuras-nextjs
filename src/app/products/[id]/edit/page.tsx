"use client";

import { useToast } from "@/components/ui/ToastNotifier";
import { productsApi } from "@/modules/product/presentation/product.api";
import { ProductForm } from "@/components/ui/ProductForm";
import { CreateProductInput, UpdateProductInput, UpdateProductSchema } from "@/modules/product/application/product.validator";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft, Edit3, LoaderCircle } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export default function EditProductPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;
    const { toastNotify } = useToast();

    const [isLoading, setIsLoading] = useState(true);
    const [skuReadOnly, setSkuReadOnly] = useState("");

    const formMethods = useForm<UpdateProductInput>({
        resolver: zodResolver(UpdateProductSchema),
    });

    const { reset } = formMethods;

    useEffect(() => {
        if (!id) return;

        const loadProduct = async () => {
            try {
                const product = (await productsApi.getProductById(id)).data;
                if (!product) throw new Error("Product not found");

                setSkuReadOnly(product.skuCode);
                reset({
                    skuCode: product.skuCode,
                    name: product.name,
                    imageUrl: product.imageUrl,
                    priceCost: product.priceCost,
                    priceCash: product.priceCash,
                    priceInstallments: product.priceInstallments,
                    category: product.category,
                    packageData: product.packageData,
                    active: product.active,
                });
            } catch (error: any) {
                toastNotify({
                    title: "Error",
                    description: error.message ?? "Could not load product data.",
                    variant: "destructive",
                });
            } finally {
                setIsLoading(false);
            }
        };

        loadProduct();
    }, [id, reset, toastNotify]);

    const onSubmit = async (productData: CreateProductInput) => {
        try {
            await productsApi.updateProduct(id, productData);
            toastNotify({
                title: "Product updated",
                description: `Product ${productData.name} successfully updated.`
            });
            setTimeout(() => router.push("/products"), 1500);
        } catch (error: any) {
            toastNotify({
                title: "Oops...",
                description: error.message ?? `Something went wrong, try again later.`,
                variant: "destructive"
            });
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-canvas flex items-center justify-center">
                <div className="flex items-center gap-2 text-primary text-sm font-medium">
                    <LoaderCircle className="w-5 h-5 animate-spin text-brand" />
                    Loading product data...
                </div>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-canvas">
            <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 space-y-5">

                {/* Header */}
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="flex items-center justify-center w-9 h-9 rounded-xl bg-surface border border-border text-secondary hover:text-primary hover:border-brand-border hover:bg-brand-muted transition-all shrink-0"
                        title="Back"
                    >
                        <ChevronLeft />
                    </button>

                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-brand-muted border border-brand-border text-brand shrink-0">
                            <Edit3 />
                        </div>
                        <div>
                            <h1 className="text-lg font-semibold text-primary leading-tight tracking-tight">
                                Edit product
                            </h1>
                            <p className="font-mono text-xs text-tertiary mt-0.5 uppercase tracking-wider">
                                SKU: {skuReadOnly}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Form Component */}
                <ProductForm
                    formMethods={formMethods as any}
                    onSubmit={onSubmit}
                    onCancel={() => router.back()}
                    isEditing={true}
                    skuReadOnly={skuReadOnly}
                />

            </div>
        </main>
    );
}