import { ChevronLeft, ChevronRight } from "lucide-react";

interface FutureDeliveryFooterProps {
    totalRecords: number;
    currentPage: number;
    totalPages: number;
    isFetching: boolean;
    onPageChange: (page: number) => void;
}

export function FutureDeliveryFooter({
    totalRecords,
    currentPage,
    totalPages,
    isFetching,
    onPageChange,
}: FutureDeliveryFooterProps) {
    const pageLabel = `Page ${currentPage} of ${Math.max(totalPages, 1)}`;
    const totalDeliveriesLabel = `${totalRecords} deliver${totalRecords === 1 ? "y" : "ies"} found`;

    return (
        <footer className="flex flex-col gap-3 rounded-xl border border-border bg-surface px-4 py-3 text-sm text-secondary sm:flex-row sm:items-center sm:justify-between shadow-sm">
            <span>{totalDeliveriesLabel}</span>

            <div className="flex items-center justify-between gap-3 sm:justify-end">
                <span aria-live="polite" className="text-xs text-tertiary font-medium">
                    {pageLabel}
                </span>

                <div className="flex gap-2">
                    <button
                        type="button"
                        disabled={currentPage <= 1 || isFetching}
                        onClick={() => onPageChange(currentPage - 1)}
                        className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-xs font-semibold transition hover:bg-subtle disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        <ChevronLeft className="h-3.5 w-3.5" />
                        Previous
                    </button>

                    <button
                        type="button"
                        disabled={currentPage >= totalPages || isFetching}
                        onClick={() => onPageChange(currentPage + 1)}
                        className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-xs font-semibold transition hover:bg-subtle disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        Next
                        <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                </div>
            </div>
        </footer>
    );
}