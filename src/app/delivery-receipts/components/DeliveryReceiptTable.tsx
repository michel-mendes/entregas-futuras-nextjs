import { Printer, PackageX, MapPin } from "lucide-react";
import {
    DeliveryReceiptProps,
    DeliveryReceiptStatus,
} from "@/modules/delivery-receipt/domain/delivery-receipt.entity";
import { DeliveryReceiptStatusBadge } from "./DeliveryReceiptStatusBadge";
import { DeliveryReceiptSkeleton } from "./DeliveryReceiptSkeletonLoading";

interface DeliveryReceiptTableProps {
    receipts: DeliveryReceiptProps[];
    isLoading: boolean;
}

export function DeliveryReceiptTable({
    receipts,
    isLoading,
}: DeliveryReceiptTableProps) {
    const handlePrint = (receiptId?: string) => {
        if (!receiptId) return;
        // Opens print route in a new tab
        window.open(`/delivery-receipts/${receiptId}/print`, "_blank", "noopener,noreferrer");
    };

    return (
        <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-secondary">
                    <thead className="border-b border-border bg-subtle/50 text-xs font-semibold uppercase tracking-wider text-tertiary">
                        <tr>
                            <th scope="col" className="px-4 py-3.5">
                                Delivery Date
                            </th>
                            <th scope="col" className="px-4 py-3.5">
                                Receipt No.
                            </th>
                            <th scope="col" className="px-4 py-3.5">
                                Customer Name
                            </th>
                            <th scope="col" className="px-4 py-3.5">
                                Delivery Address
                            </th>
                            <th scope="col" className="px-4 py-3.5">
                                Status
                            </th>
                            <th scope="col" className="px-4 py-3.5 text-right">
                                Actions
                            </th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-border">
                        {isLoading ? (
                            <DeliveryReceiptSkeleton rows={5} />
                        ) : receipts.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-4 py-12 text-center text-tertiary">
                                    <div className="flex flex-col items-center justify-center gap-2">
                                        <PackageX className="h-8 w-8 text-tertiary/60" />
                                        <p className="font-medium">No delivery receipt found.</p>
                                        <p className="text-xs text-tertiary">
                                            Try adjusting your date range or filters.
                                        </p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            receipts.map((receipt) => {
                                const formattedDate = receipt.deliveryDate
                                    ? new Date(receipt.deliveryDate).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "short",
                                        day: "2-digit",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })
                                    : "-";

                                return (
                                    <tr
                                        key={receipt.id}
                                        className="transition hover:bg-subtle/40"
                                    >
                                        <td className="whitespace-nowrap px-4 py-3.5 font-medium text-primary">
                                            {formattedDate}
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-3.5 font-semibold text-brand">
                                            {receipt.deliveryNumber}
                                        </td>
                                        <td className="px-4 py-3.5 font-medium text-primary">
                                            {receipt.recipient?.name ?? "-"}
                                        </td>
                                        <td className="px-4 py-3.5 max-w-xs truncate text-tertiary">
                                            <span className="inline-flex items-center gap-1">
                                                <MapPin className="h-3.5 w-3.5 shrink-0 text-tertiary/70" />
                                                <span className="truncate">{receipt.recipient?.address ?? "-"}</span>
                                            </span>
                                        </td>
                                        <td className="px-4 py-3.5">
                                            <DeliveryReceiptStatusBadge
                                                status={receipt.status as DeliveryReceiptStatus}
                                            />
                                        </td>
                                        <td className="px-4 py-3.5 text-right">
                                            <button
                                                type="button"
                                                onClick={() => handlePrint(receipt.id)}
                                                className="inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 text-xs font-semibold text-secondary transition hover:bg-subtle hover:text-primary focus:outline-none focus:ring-2 focus:ring-brand/20 cursor-pointer"
                                                title="Print Delivery Receipt"
                                            >
                                                <Printer className="h-3.5 w-3.5 text-tertiary" />
                                                Print
                                            </button>
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