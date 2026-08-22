"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";

import { useToggleWarehouseStatus, useWarehouses } from "@/hooks/useWarehouses";

import {
    ListWarehousesParams,
    WarehouseStatusFilter,
} from "@/modules/warehouse/domain/warehouse.repository";
import { IWarehouseProps } from "@/modules/warehouse/domain/warehouse.entity";
import { WarehouseTable } from "../../components/ui/WarehouseTable";
import { useToast } from "../../components/ui/ToastNotifier";

const PAGE_SIZE = 10;

export default function WarehousesPage() {
    const { toastNotify } = useToast();

    const [filters, setFilters] = useState<ListWarehousesParams>({
        page: 1,
        limit: PAGE_SIZE,
        name: "",
        sector: "",
        status: "ALL",
    });

    const [draftName, setDraftName] = useState("");
    const [draftSector, setDraftSector] = useState("");
    const [draftStatus, setDraftStatus] =
        useState<WarehouseStatusFilter>("ALL");

    const warehousesQuery = useWarehouses(filters);
    const toggleMutation = useToggleWarehouseStatus();

    const warehouses = warehousesQuery.data?.data ?? [];
    const metadata = warehousesQuery.data?.meta;

    const totalPages = metadata?.totalPaginas ?? 1;
    const currentPage = metadata?.paginaAtual ?? filters.page;

    const pageLabel = useMemo(
        () => `Page ${currentPage} of ${Math.max(totalPages, 1)}`,
        [currentPage, totalPages],
    );

    const applyFilters = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        setFilters({
            page: 1,
            limit: PAGE_SIZE,
            name: draftName.trim() || undefined,
            sector: draftSector.trim() || undefined,
            status: draftStatus,
        });
    };

    const clearFilters = () => {
        setDraftName("");
        setDraftSector("");
        setDraftStatus("ALL");
        setFilters({
            page: 1,
            limit: PAGE_SIZE,
            status: "ALL",
        });
    };

    const changePage = (page: number) => {
        if (page < 1 || page > totalPages || page === currentPage) {
            return;
        }

        setFilters((current) => ({
            ...current,
            page,
        }));
    };

    const handleToggleStatus = (warehouse: IWarehouseProps) => {
        if (!warehouse.id) {
            return;
        }

        const activate = !(warehouse.isActive ?? true);

        toggleMutation.mutate(
            {
                id: warehouse.id,
                activate,
            },
            {
                onSuccess: () => {
                    toastNotify({
                        title: "Warehouse status updated",
                        description: `${warehouse.name} is now ${activate ? "active" : "inactive"
                            }.`,
                    });
                },
                onError: (error) => {
                    toastNotify({
                        title: "Unable to update status",
                        description: error.message,
                        variant: "destructive",
                    });
                },
            },
        );
    };

    return (
        <main className="mx-auto w-full max-w-7xl space-y-5 px-4 py-6 sm:px-6 lg:px-8">
            <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-brand">
                        Inventory control
                    </p>
                    <h1 className="mt-1 text-2xl font-semibold text-primary">
                        Warehouses
                    </h1>
                    <p className="mt-1 text-sm text-tertiary">
                        Manage locations, sectors, and operational status.
                    </p>
                </div>

                <Link
                    href="/warehouses/new"
                    className="inline-flex items-center justify-center rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand/90"
                >
                    Add warehouse
                </Link>
            </header>

            <section className="rounded-xl border border-border bg-surface p-4">
                <form
                    onSubmit={applyFilters}
                    className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_1fr_180px_auto]"
                >
                    <div>
                        <label
                            htmlFor="warehouse-search-name"
                            className="text-xs font-semibold uppercase tracking-wide text-tertiary"
                        >
                            Name
                        </label>
                        <input
                            id="warehouse-search-name"
                            value={draftName}
                            onChange={(event) => setDraftName(event.target.value)}
                            placeholder="Search by name"
                            className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="warehouse-search-sector"
                            className="text-xs font-semibold uppercase tracking-wide text-tertiary"
                        >
                            Sector
                        </label>
                        <input
                            id="warehouse-search-sector"
                            value={draftSector}
                            onChange={(event) => setDraftSector(event.target.value)}
                            placeholder="Search by sector"
                            className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="warehouse-status"
                            className="text-xs font-semibold uppercase tracking-wide text-tertiary"
                        >
                            Status
                        </label>
                        <select
                            id="warehouse-status"
                            value={draftStatus}
                            onChange={(event) =>
                                setDraftStatus(event.target.value as WarehouseStatusFilter)
                            }
                            className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                        >
                            <option value="ALL">All statuses</option>
                            <option value="ACTIVE">Active</option>
                            <option value="INACTIVE">Inactive</option>
                        </select>
                    </div>

                    <div className="flex items-end gap-2">
                        <button
                            type="button"
                            onClick={clearFilters}
                            className="flex-1 rounded-lg border border-border px-3 py-2.5 text-sm font-medium text-secondary transition hover:bg-subtle"
                        >
                            Clear
                        </button>

                        <button
                            type="submit"
                            className="flex-1 rounded-lg bg-secondary px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-primary"
                        >
                            Search
                        </button>
                    </div>
                </form>
            </section>

            {warehousesQuery.isError ? (
                <div
                    className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                    role="alert"
                >
                    {warehousesQuery.error.message}
                </div>
            ) : null}

            <WarehouseTable
                warehouses={warehouses}
                isLoading={warehousesQuery.isPending}
                isToggling={toggleMutation.isPending}
                onToggleStatus={handleToggleStatus}
            />

            <footer className="flex flex-col gap-3 rounded-xl border border-border bg-surface px-4 py-3 text-sm text-secondary sm:flex-row sm:items-center sm:justify-between">
                <span>
                    {metadata?.totalRegistros ?? 0} warehouse
                    {(metadata?.totalRegistros ?? 0) === 1 ? "" : "s"} found
                </span>

                <div className="flex items-center justify-between gap-3 sm:justify-end">
                    <span aria-live="polite">{pageLabel}</span>

                    <div className="flex gap-2">
                        <button
                            type="button"
                            disabled={currentPage <= 1 || warehousesQuery.isFetching}
                            onClick={() => changePage(currentPage - 1)}
                            className="rounded-md border border-border px-3 py-1.5 text-xs font-semibold transition hover:bg-subtle disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            Previous
                        </button>

                        <button
                            type="button"
                            disabled={
                                currentPage >= totalPages || warehousesQuery.isFetching
                            }
                            onClick={() => changePage(currentPage + 1)}
                            className="rounded-md border border-border px-3 py-1.5 text-xs font-semibold transition hover:bg-subtle disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </footer>
        </main>
    );
}