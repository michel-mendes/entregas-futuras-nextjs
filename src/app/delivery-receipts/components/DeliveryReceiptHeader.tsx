import { Receipt } from "lucide-react";

export function DeliveryReceiptHeader() {
    return (
        <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-brand">
                    Dispatch & Logistics Management
                </p>
                <h1 className="mt-1 text-2xl font-semibold text-primary flex items-center gap-2">
                    <Receipt />
                    Delivery Receipts
                </h1>
                <p className="mt-1 text-sm text-tertiary">
                    Track, filter, and issue delivery receipts for ongoing or completed shipments.
                </p>
            </div>
        </header>
    );
}