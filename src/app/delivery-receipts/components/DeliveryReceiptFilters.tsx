import React, { SubmitEvent } from "react";
import {
    Search,
    RotateCcw,
    User,
    Calendar,
    Hash,
    Filter,
    ListFilter,
} from "lucide-react";
import {
    DeliveryReceiptFilter,
    DeliveryReceiptStatusFilter,
} from "@/modules/delivery-receipt/domain/delivery-receipt.repository";
import { FriendlyDeliveryReceiptStatusFilterName } from "@/modules/delivery-receipt/domain/delivery-receipt.entity";

interface DeliveryReceiptFiltersProps {
    draftFilters: DeliveryReceiptFilter;
    setDraftFilters: React.Dispatch<React.SetStateAction<DeliveryReceiptFilter>>;
    statusesNames: FriendlyDeliveryReceiptStatusFilterName[];
    onApplyFilters: (e: SubmitEvent<HTMLFormElement>) => void;
    onClearFilters: () => void;
}

export function DeliveryReceiptFilters({
    draftFilters,
    setDraftFilters,
    statusesNames,
    onApplyFilters,
    onClearFilters,
}: DeliveryReceiptFiltersProps) {
    const formatDateForInput = (date?: Date) => {
        if (!date || isNaN(date.getTime())) return "";
        return date.toISOString().slice(0, 10);
    };

    return (
        <section className="rounded-xl border border-border bg-surface p-4 shadow-sm">
            <form
                onSubmit={onApplyFilters}
                className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-6"
            >
                {/* Start Date */}
                <div>
                    <label
                        htmlFor="start-date-filter"
                        className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-tertiary"
                    >
                        <Calendar className="h-3.5 w-3.5" />
                        Start Date
                    </label>
                    <input
                        id="start-date-filter"
                        type="date"
                        value={formatDateForInput(draftFilters.startDate)}
                        onChange={(e) =>
                            setDraftFilters((prev) => ({
                                ...prev,
                                startDate: e.target.value ? new Date(e.target.value) : undefined,
                            }))
                        }
                        className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
                    />
                </div>

                {/* End Date */}
                <div>
                    <label
                        htmlFor="end-date-filter"
                        className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-tertiary"
                    >
                        <Calendar className="h-3.5 w-3.5" />
                        End Date
                    </label>
                    <input
                        id="end-date-filter"
                        type="date"
                        value={formatDateForInput(draftFilters.endDate)}
                        onChange={(e) =>
                            setDraftFilters((prev) => ({
                                ...prev,
                                endDate: e.target.value ? new Date(e.target.value) : undefined,
                            }))
                        }
                        className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
                    />
                </div>

                {/* Delivery Number */}
                <div>
                    <label
                        htmlFor="delivery-number-filter"
                        className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-tertiary"
                    >
                        <Hash className="h-3.5 w-3.5" />
                        Receipt No.
                    </label>
                    <input
                        id="delivery-number-filter"
                        type="text"
                        placeholder="e.g. REC-001"
                        autoComplete="off"
                        value={draftFilters.deliveryNumber ?? ""}
                        onChange={(e) =>
                            setDraftFilters((prev) => ({
                                ...prev,
                                deliveryNumber: e.target.value,
                            }))
                        }
                        className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
                    />
                </div>

                {/* Customer Name */}
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
                        placeholder="Recipient name..."
                        autoComplete="off"
                        value={draftFilters.recipientName ?? ""}
                        onChange={(e) =>
                            setDraftFilters((prev) => ({
                                ...prev,
                                recipientName: e.target.value,
                            }))
                        }
                        className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
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
                        value={draftFilters.status ?? "ALL"}
                        onChange={(e) =>
                            setDraftFilters((prev) => ({
                                ...prev,
                                status: e.target.value as DeliveryReceiptStatusFilter,
                            }))
                        }
                        className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20 cursor-pointer"
                    >
                        <option value="ALL">All statuses</option>
                        {statusesNames.map((status) => (
                            <option key={status.name} value={status.name}>
                                {status.friendlyName}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Limit / Page size */}
                <div>
                    <label
                        htmlFor="limit-filter"
                        className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-tertiary"
                    >
                        <ListFilter className="h-3.5 w-3.5" />
                        Results
                    </label>
                    <select
                        id="limit-filter"
                        value={draftFilters.limit ?? 10}
                        onChange={(e) =>
                            setDraftFilters((prev) => ({
                                ...prev,
                                limit: Number(e.target.value),
                            }))
                        }
                        className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20 cursor-pointer"
                    >
                        <option value={10}>10 per page</option>
                        <option value={30}>30 per page</option>
                        <option value={70}>70 per page</option>
                    </select>
                </div>

                {/* Action Buttons */}
                <div className="flex items-end gap-2 md:col-span-2 lg:col-span-6 lg:justify-end">
                    <button
                        type="button"
                        onClick={onClearFilters}
                        className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-border px-4 py-2 text-sm font-medium text-secondary transition hover:bg-subtle focus:outline-none focus:ring-2 focus:ring-border cursor-pointer"
                    >
                        <RotateCcw className="h-4 w-4" />
                        Clear
                    </button>

                    <button
                        type="submit"
                        className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-secondary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary focus:outline-none focus:ring-2 focus:ring-secondary/20 cursor-pointer"
                    >
                        <Search className="h-4 w-4" />
                        Apply Filters
                    </button>
                </div>
            </form>
        </section>
    );
}