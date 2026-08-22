"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { WarehouseForm } from "../../../components/ui/WarehouseForm";
import {
    UpdateWarehouseDTO,
} from "@/modules/warehouse/presentation/warehouse.validation";
import { IWarehouseProps } from "@/modules/warehouse/domain/warehouse.entity";
import {
    fetchWarehouses,
} from "@/modules/warehouse/infrastructure/warehouse.api.client";
import { useUpdateWarehouse } from "@/hooks/useWarehouses";
import { useToast } from "../../../components/ui/ToastNotifier";

type LoadState = {
    warehouse: IWarehouseProps | null;
    error: string | null;
    isLoading: boolean;
};

export default function EditWarehousePage() {
    const params = useParams<{ id: string }>();
    const router = useRouter();
    const { toastNotify } = useToast();

    const updateMutation = useUpdateWarehouse();

    const [state, setState] = useState<LoadState>({
        warehouse: null,
        error: null,
        isLoading: true,
    });

    useEffect(() => {
        let isMounted = true;

        const loadWarehouse = async () => {
            if (!params.id) {
                return;
            }

            setState({
                warehouse: null,
                error: null,
                isLoading: true,
            });

            try {
                const response = await fetchWarehouses({
                    page: 1,
                    limit: 100,
                });

                const warehouse =
                    response.data?.find((item) => item.id === params.id) ?? null;

                if (!warehouse) {
                    throw new Error("Warehouse not found.");
                }

                if (isMounted) {
                    setState({
                        warehouse,
                        error: null,
                        isLoading: false,
                    });
                }
            } catch (error) {
                if (!isMounted) {
                    return;
                }

                setState({
                    warehouse: null,
                    error:
                        error instanceof Error
                            ? error.message
                            : "Unable to load warehouse.",
                    isLoading: false,
                });
            }
        };

        void loadWarehouse();

        return () => {
            isMounted = false;
        };
    }, [params.id]);

    const handleSubmit = (values: UpdateWarehouseDTO) => {
        updateMutation.mutate(
            {
                id: params.id,
                data: values,
            },
            {
                onSuccess: () => {
                    toastNotify({
                        title: "Warehouse updated",
                        description: "The warehouse details were saved successfully.",
                    });
                    router.push("/warehouses");
                },
                onError: (error) => {
                    toastNotify({
                        title: "Unable to update warehouse",
                        description: error.message,
                        variant: "destructive",
                    });
                },
            },
        );
    };

    if (state.isLoading) {
        return (
            <main className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6 lg:px-8">
                <div className="animate-pulse rounded-xl border border-border bg-surface p-6">
                    <div className="mb-6 h-7 w-48 rounded bg-subtle" />
                    <div className="grid gap-5 md:grid-cols-2">
                        <div className="h-16 rounded bg-subtle" />
                        <div className="h-16 rounded bg-subtle" />
                    </div>
                </div>
            </main>
        );
    }

    if (state.error || !state.warehouse) {
        return (
            <main className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6 lg:px-8">
                <div
                    className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700"
                    role="alert"
                >
                    {state.error ?? "Warehouse not found."}
                </div>
            </main>
        );
    }

    return (
        <main className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6 lg:px-8">
            <div className="mb-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-brand">
                    Warehouse management
                </p>
                <h1 className="mt-1 text-2xl font-semibold text-primary">
                    Edit warehouse
                </h1>
                <p className="mt-1 text-sm text-tertiary">
                    Update the warehouse name and operating sector.
                </p>
            </div>

            <section className="rounded-xl border border-border bg-surface p-5 sm:p-6">
                <WarehouseForm
                    mode="edit"
                    defaultValues={{
                        name: state.warehouse.name,
                        sector: state.warehouse.sector,
                    }}
                    isSubmitting={updateMutation.isPending}
                    serverError={updateMutation.error?.message}
                    onSubmit={handleSubmit}
                />
            </section>
        </main>
    );
}