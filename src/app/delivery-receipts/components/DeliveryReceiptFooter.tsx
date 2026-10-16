import { ChevronLeft, ChevronRight } from "lucide-react";

interface DeliveryReceiptFooterProps {
    totalRecords: number;
    currentPage: number;
    totalPages: number;
    isFetching: boolean;
    onPageChange: (page: number) => void;
}

export function DeliveryReceiptFooter({
    totalRecords,
    currentPage,
    totalPages,
    isFetching,
    onPageChange,
}: DeliveryReceiptFooterProps) {
    const pageLabel = `Page ${currentPage} of ${Math.max(totalPages, 1)}`;
    const totalReceiptsLabel = `${totalRecords} receipt${totalRecords === 1 ? "" : "s"} found`;

    return (
        <footer className="flex flex-col gap-3 rounded-xl border border-border bg-surface px-4 py-3 text-sm text-secondary sm:flex-row sm:items-center sm:justify-between shadow-sm">
            <span>{totalReceiptsLabel}</span>

            <div className="flex items-center justify-between gap-3 sm:justify-end">
                <span aria-live="polite" className="text-xs font-medium text-tertiary">
                    {pageLabel}
                </span>

                <div className="flex gap-2">
                    <button
                        type="button"
                        disabled={currentPage <= 1 || isFetching}
                        onClick={() => onPageChange(currentPage - 1)}
                        className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-xs font-semibold transition hover:bg-subtle disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
                    >
                        <ChevronLeft className="h-3.5 w-3.5" />
                        Previous
                    </button>

                    <button
                        type="button"
                        disabled={currentPage >= totalPages || isFetching}
                        onClick={() => onPageChange(currentPage + 1)}
                        className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-xs font-semibold transition hover:bg-subtle disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
                    >
                        Next
                        <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                </div>
            </div>
        </footer>
    );
}