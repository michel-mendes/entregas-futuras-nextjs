import React, { FormEvent } from "react";
import { Search, RotateCcw, User, FileText, Filter } from "lucide-react";
import { FutureDeliveryFilter } from "@/modules/future-delivery/domain/future-delivery.repository";
import {
    FriendlyStatusData,
    FutureDeliveryStatus,
} from "@/modules/future-delivery/domain/future-delivery.entity";

interface FutureDeliveryFiltersProps {
    draftFilters: FutureDeliveryFilter;
    setDraftFilters: React.Dispatch<React.SetStateAction<FutureDeliveryFilter>>;
    statusesNames: FriendlyStatusData[];
    onApplyFilters: (e: React.SubmitEvent<HTMLFormElement>) => void;
    onClearFilters: () => void;
}

export function FutureDeliveryFilters({
    draftFilters,
    setDraftFilters,
    statusesNames,
    onApplyFilters,
    onClearFilters,
}: FutureDeliveryFiltersProps) {
    return (
        <section className="rounded-xl border border-border bg-surface p-4 shadow-sm">
            <form
                onSubmit={onApplyFilters}
                className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-[1fr_1fr_200px_auto]"
            >
                {/* Input Customer Name */}
                <div>
                    <label
                        htmlFor="customer-name-filter"
                        className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-tertiary"
                    >
                        <User className="h-3.5 w-3.5" />
                        Customer
                    </label>
                    <input
                        id="customer-name-filter"
                        type="text"
                        placeholder="Customer name..."
                        autoComplete="off"
                        value={draftFilters.customerName ?? ""}
                        onChange={(e) =>
                            setDraftFilters((prev) => ({
                                ...prev,
                                customerName: e.target.value,
                            }))
                        }
                        className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
                    />
                </div>

                {/* Input Customer Document */}
                <div>
                    <label
                        htmlFor="customer-doc-filter"
                        className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-tertiary"
                    >
                        <FileText className="h-3.5 w-3.5" />
                        Document (CPF/CNPJ)
                    </label>
                    <input
                        id="customer-doc-filter"
                        type="text"
                        placeholder="Only numbers"
                        autoComplete="off"
                        value={draftFilters.customerDocument ?? ""}
                        onChange={(e) =>
                            setDraftFilters((prev) => ({
                                ...prev,
                                customerDocument: e.target.value,
                            }))
                        }
                        className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
                    />
                </div>

                {/* Select Status */}
                <div>
                    <label
                        htmlFor="status-filter"
                        className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-tertiary"
                    >
                        <Filter className="h-3.5 w-3.5" />
                        Status
                    </label>
                    <select
                        id="status-filter"
                        value={draftFilters.status ?? ""}
                        onChange={(e) =>
                            setDraftFilters((prev) => ({
                                ...prev,
                                status: e.target.value as FutureDeliveryStatus,
                            }))
                        }
                        className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
                    >
                        {statusesNames.map((status) => (
                            <option key={status.name} value={status.name}>
                                {status.friendlyName}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Action Buttons */}
                <div className="flex items-end gap-2">
                    <button
                        type="button"
                        onClick={onClearFilters}
                        className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-border px-3 py-2.5 text-sm font-medium text-secondary transition hover:bg-subtle focus:outline-none focus:ring-2 focus:ring-border"
                    >
                        <RotateCcw className="h-4 w-4" />
                        Clear
                    </button>

                    <button
                        type="submit"
                        className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-secondary px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-primary focus:outline-none focus:ring-2 focus:ring-secondary/20"
                    >
                        <Search className="h-4 w-4" />
                        Apply
                    </button>
                </div>
            </form>
        </section>
    );
}