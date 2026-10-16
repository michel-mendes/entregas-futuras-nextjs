"use client";

import { Printer, X, FileText } from "lucide-react";

interface DeliveryReceiptPrintToolbarProps {
    receiptNumber?: string;
}

export function DeliveryReceiptPrintToolbar({
    receiptNumber,
}: DeliveryReceiptPrintToolbarProps) {
    const handlePrint = () => {
        window.print();
    };

    const handleClose = () => {
        window.close();
    };

    return (
        <div className="sticky top-0 z-50 flex items-center justify-between border-b border-border bg-surface px-6 py-3 shadow-md print:hidden">
            <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-brand" />
                <span className="text-sm font-semibold text-primary">
                    Print Preview — Receipt {receiptNumber ? `#${receiptNumber}` : ""}
                </span>
            </div>

            <div className="flex items-center gap-3">
                <button
                    type="button"
                    onClick={handleClose}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3.5 py-1.5 text-xs font-semibold text-secondary transition hover:bg-subtle hover:text-primary focus:outline-none focus:ring-2 focus:ring-border cursor-pointer"
                >
                    <X className="h-4 w-4" />
                    Close
                </button>

                <button
                    type="button"
                    onClick={handlePrint}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-brand px-4 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-brand/90 focus:outline-none focus:ring-2 focus:ring-brand/20 cursor-pointer"
                >
                    <Printer className="h-4 w-4" />
                    Print Receipt
                </button>
            </div>
        </div>
    );
}