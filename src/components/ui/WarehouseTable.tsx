"use client";

import Link from "next/link";

import { IWarehouseProps } from "@/modules/warehouse/domain/warehouse.entity";

type WarehouseTableProps = {
    warehouses: IWarehouseProps[];
    isLoading: boolean;
    isToggling: boolean;
    onToggleStatus: (warehouse: IWarehouseProps) => void;
};

function LoadingRows() {
    return (
        <>
            {Array.from({ length: 6 }).map((_, index) => (
                <tr key={index} className="animate-pulse">
                    {Array.from({ length: 4 }).map((__, cellIndex) => (
                        <td key={cellIndex} className="px-4 py-4">
                            <div className="h-4 rounded bg-subtle" />
                        </td>
                    ))}
                </tr>
            ))}
        </>
    );
}

export function WarehouseTable({
    warehouses,
    isLoading,
    isToggling,
    onToggleStatus,
}: WarehouseTableProps) {
    return (
        <div className="overflow-hidden rounded-xl border border-border bg-surface">
            <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                    <caption className="sr-only">Warehouse list</caption>

                    <thead className="border-b border-border-subtle bg-subtle/60 text-xs uppercase tracking-wide text-tertiary">
                        <tr>
                            <th scope="col" className="px-4 py-3 font-semibold">
                                Name
                            </th>
                            <th scope="col" className="px-4 py-3 font-semibold">
                                Sector
                            </th>
                            <th scope="col" className="px-4 py-3 font-semibold">
                                Status
                            </th>
                            <th scope="col" className="px-4 py-3 text-right font-semibold">
                                Actions
                            </th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-border-subtle">
                        {isLoading ? (
                            <LoadingRows />
                        ) : warehouses.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={4}
                                    className="px-4 py-14 text-center text-sm text-tertiary"
                                >
                                    No warehouses found for the selected filters.
                                </td>
                            </tr>
                        ) : (
                            warehouses.map((warehouse) => {
                                const isActive = warehouse.isActive ?? true;

                                return (
                                    <tr
                                        key={warehouse.id ?? `${warehouse.name}-${warehouse.sector}`}
                                        className="transition hover:bg-subtle/40"
                                    >
                                        <td className="whitespace-nowrap px-4 py-4 font-medium text-primary">
                                            {warehouse.name}
                                        </td>

                                        <td className="whitespace-nowrap px-4 py-4 text-secondary">
                                            {warehouse.sector}
                                        </td>

                                        <td className="whitespace-nowrap px-4 py-4">
                                            <span
                                                className={[
                                                    "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold",
                                                    isActive
                                                        ? "bg-emerald-100 text-emerald-700"
                                                        : "bg-slate-100 text-slate-600",
                                                ].join(" ")}
                                            >
                                                {isActive ? "Active" : "Inactive"}
                                            </span>
                                        </td>

                                        <td className="whitespace-nowrap px-4 py-4">
                                            <div className="flex justify-end gap-2">
                                                {warehouse.id ? (
                                                    <Link
                                                        href={`/warehouses/${warehouse.id}`}
                                                        className="rounded-md px-2 py-1.5 text-xs font-semibold text-brand transition hover:bg-brand-muted"
                                                    >
                                                        Edit
                                                    </Link>
                                                ) : null}

                                                {warehouse.id ? (
                                                    <button
                                                        type="button"
                                                        disabled={isToggling}
                                                        onClick={() => onToggleStatus(warehouse)}
                                                        className="rounded-md border border-border px-2 py-1.5 text-xs font-semibold text-secondary transition hover:bg-subtle hover:cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                                                        aria-label={`${isActive ? "Deactivate" : "Activate"} ${warehouse.name}`}
                                                    >
                                                        {isActive ? "Deactivate" : "Activate"}
                                                    </button>
                                                ) : null}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}