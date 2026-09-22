"use client";

import { useToast } from "@/components/ui/ToastNotifier";
import { CreateProductInput, CreateProductSchema } from "@/modules/product/application/product.validator";
import { ProductCategory } from "@/modules/product/domain/product.entity";
import { productsApi } from "@/modules/product/presentation/product.api";
import { ProductForm } from "@/components/ui/ProductForm";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft, PackagePlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

export default function NewProductPage() {
    const router = useRouter();
    const { toastNotify } = useToast();

    const formMethods = useForm<CreateProductInput>({
        resolver: zodResolver(CreateProductSchema),
        defaultValues: {
            active: true,
            category: ProductCategory.GENERAL
        }
    });

    const onSubmit = async (productData: CreateProductInput) => {
        try {
            await productsApi.createProduct(productData);
            toastNotify({
                title: "New product created",
                description: `Product ${productData.name} successfully created.`
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
                            <PackagePlus />
                        </div>
                        <div>
                            <h1 className="text-lg font-semibold text-primary leading-tight tracking-tight">
                                New product
                            </h1>
                            <p className="text-xs text-tertiary mt-0.5">Fill the form with the product details</p>
                        </div>
                    </div>
                </div>

                {/* Product form component */}
                <ProductForm
                    formMethods={formMethods as any}
                    onSubmit={onSubmit}
                    onCancel={() => router.back()}
                    isEditing={false}
                />

            </div>
        </main>
    );
}