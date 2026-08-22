"use client";

import { useRouter } from "next/navigation";

import { WarehouseForm } from "../../../components/ui/WarehouseForm";
import {
    CreateWarehouseDTO,
} from "@/modules/warehouse/presentation/warehouse.validation";
import { useCreateWarehouse } from "@/hooks/useWarehouses";
import { useToast } from "../../../components/ui/ToastNotifier";

export default function NewWarehousePage() {
    const router = useRouter();
    const { toastNotify } = useToast();
    const createMutation = useCreateWarehouse();

    const handleSubmit = (values: CreateWarehouseDTO) => {
        createMutation.mutate(values, {
            onSuccess: () => {
                toastNotify({
                    title: "Warehouse created",
                    description: "The warehouse is ready to receive inventory.",
                });
                router.push("/warehouses");
            },
            onError: (error) => {
                toastNotify({
                    title: "Unable to create warehouse",
                    description: error.message,
                    variant: "destructive",
                });
            },
        });
    };

    return (
        <main className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6 lg:px-8">
            <div className="mb-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-brand">
                    Warehouse management
                </p>
                <h1 className="mt-1 text-2xl font-semibold text-primary">
                    Add warehouse
                </h1>
                <p className="mt-1 text-sm text-tertiary">
                    Register a new operational storage location.
                </p>
            </div>

            <section className="rounded-xl border border-border bg-surface p-5 sm:p-6">
                <WarehouseForm
                    mode="create"
                    defaultValues={{
                        name: "",
                        sector: "",
                        isActive: true,
                    }}
                    isSubmitting={createMutation.isPending}
                    serverError={createMutation.error?.message}
                    onSubmit={handleSubmit}
                />
            </section>
        </main>
    );
}