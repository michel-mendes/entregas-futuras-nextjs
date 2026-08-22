"use client";

import { useEffect, useId, useState, type ChangeEvent, } from "react";
import { useWarehouses } from "@/hooks/useWarehouses";
import { WarehouseStatusFilter } from "@/modules/warehouse/domain/warehouse.repository";
import { IWarehouseProps } from "@/modules/warehouse/domain/warehouse.entity";

type WarehouseSelectorProps = {
    value?: string | null;
    onChange: (warehouseId: string | undefined) => void;
    onBlur?: () => void;
    label?: string;
    placeholder?: string;
    error?: string;
    hint?: string;
    disabled?: boolean;
    required?: boolean;
    statusFilter?: WarehouseStatusFilter;
};

const PAGE_SIZE = 10;
const SEARCH_DELAY = 300;

function useDebouncedValue(value: string, delay: number): string {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const timeoutId = window.setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            window.clearTimeout(timeoutId);
        };
    }, [delay, value]);

    return debouncedValue;
}

function isWarehouseWithId(
    warehouse: IWarehouseProps,
): warehouse is IWarehouseProps & { id: string } {
    return typeof warehouse.id === "string" && warehouse.id.length > 0;
}

function getWarehouseStatus(warehouse: IWarehouseProps): "Active" | "Inactive" {
    return warehouse.isActive ?? true ? "Active" : "Inactive";
}

export function WarehouseSelector({
    value,
    onChange,
    onBlur,
    label = "Warehouse",
    placeholder = "Select a warehouse",
    error,
    hint = "Search by warehouse name.",
    disabled = false,
    required = false,
    statusFilter = "ALL",
}: WarehouseSelectorProps) {
    const generatedId = useId();
    const selectId = `warehouse-selector-${generatedId}`;
    const searchId = `${selectId}-search`;
    const errorId = `${selectId}-error`;
    const hintId = `${selectId}-hint`;

    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);

    const debouncedSearch = useDebouncedValue(search, SEARCH_DELAY);

    const warehousesQuery = useWarehouses({
        page,
        limit: PAGE_SIZE,
        name: debouncedSearch.trim() || undefined,
        status: statusFilter,
    });

    useEffect(() => {
        setPage(1);
    }, [debouncedSearch, statusFilter]);

    const warehouses = (warehousesQuery.data?.data ?? []).filter(
        isWarehouseWithId,
    );

    const metadata = warehousesQuery.data?.meta;
    const currentPage = metadata?.paginaAtual ?? page;
    const totalPages = Math.max(metadata?.totalPaginas ?? 1, 1);

    const selectedWarehouseExists = warehouses.some(
        (warehouse) => warehouse.id === value,
    );

    const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
        const nextValue = event.target.value;

        onChange(nextValue.length > 0 ? nextValue : undefined);
    };

    const describedBy = [
        hint ? hintId : "",
        error ? errorId : "",
    ]
        .filter(Boolean)
        .join(" ") || undefined;

    return (
        <div className="space-y-1.5">
            <label
                htmlFor={selectId}
                className="block text-sm font-medium text-primary"
            >
                {label}
                {required ? (
                    <span className="ml-1 text-brand" aria-hidden="true">
                        *
                    </span>
                ) : null}
            </label>

            <div className="relative">
                <input
                    id={searchId}
                    type="search"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search warehouses..."
                    disabled={disabled}
                    aria-label="Search warehouses"
                    className={[
                        "mb-2 w-full rounded-lg border bg-surface px-3 py-2.5 text-sm",
                        "text-primary outline-none transition placeholder:text-tertiary",
                        "focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60",
                        error
                            ? "border-red-400 focus:border-red-500 focus:ring-red-500/20"
                            : "border-border focus:border-brand focus:ring-brand/20",
                    ].join(" ")}
                />

                <select
                    id={selectId}
                    value={value ?? ""}
                    onChange={handleChange}
                    onBlur={onBlur}
                    disabled={disabled || warehousesQuery.isPending}
                    required={required}
                    aria-invalid={error ? "true" : "false"}
                    aria-describedby={describedBy}
                    className={[
                        "w-full appearance-none rounded-lg border bg-surface px-3 py-2.5 pr-10",
                        "text-sm text-primary outline-none transition",
                        "focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60",
                        error
                            ? "border-red-400 focus:border-red-500 focus:ring-red-500/20"
                            : "border-border focus:border-brand focus:ring-brand/20",
                    ].join(" ")}
                >
                    <option value="">
                        {warehousesQuery.isPending ? "Loading warehouses..." : placeholder}
                    </option>

                    {value && !selectedWarehouseExists ? (
                        <option value={value}>
                            Selected warehouse — unavailable in current results
                        </option>
                    ) : null}

                    {warehouses.map((warehouse) => (
                        <option key={warehouse.id} value={warehouse.id}>
                            {warehouse.name} — {warehouse.sector} (
                            {getWarehouseStatus(warehouse)})
                        </option>
                    ))}
                </select>

                <span
                    aria-hidden="true"
                    className="pointer-events-none absolute bottom-3 right-3 text-tertiary"
                >
                    ▾
                </span>
            </div>

            {hint && !error ? (
                <p id={hintId} className="text-xs text-tertiary">
                    {hint}
                </p>
            ) : null}

            {error ? (
                <p id={errorId} className="text-xs text-red-600" role="alert">
                    {error}
                </p>
            ) : null}

            {warehousesQuery.isError ? (
                <p className="text-xs text-red-600" role="alert">
                    Unable to load warehouses: {warehousesQuery.error.message}
                </p>
            ) : null}

            {!warehousesQuery.isPending &&
                !warehousesQuery.isError &&
                warehouses.length === 0 ? (
                <p className="text-xs text-tertiary">
                    No warehouses match the current search.
                </p>
            ) : null}

            <div className="flex items-center justify-between pt-1">
                <span className="text-xs text-tertiary">
                    {metadata?.totalRegistros ?? 0} warehouse
                    {(metadata?.totalRegistros ?? 0) === 1 ? "" : "s"} available
                </span>

                {totalPages > 1 ? (
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => setPage((current) => current - 1)}
                            disabled={
                                currentPage <= 1 ||
                                disabled ||
                                warehousesQuery.isFetching
                            }
                            className="rounded-md border border-border px-2.5 py-1 text-xs font-medium text-secondary transition hover:bg-subtle disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            Previous
                        </button>

                        <span className="min-w-16 text-center text-xs text-tertiary">
                            {currentPage} / {totalPages}
                        </span>

                        <button
                            type="button"
                            onClick={() => setPage((current) => current + 1)}
                            disabled={
                                currentPage >= totalPages ||
                                disabled ||
                                warehousesQuery.isFetching
                            }
                            className="rounded-md border border-border px-2.5 py-1 text-xs font-medium text-secondary transition hover:bg-subtle disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            Next
                        </button>
                    </div>
                ) : null}
            </div>
        </div>
    );
}