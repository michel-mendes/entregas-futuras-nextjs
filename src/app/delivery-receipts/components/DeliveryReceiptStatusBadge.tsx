import { DeliveryReceiptStatus } from "@/modules/delivery-receipt/domain/delivery-receipt.entity";

interface DeliveryReceiptStatusBadgeProps {
    status: DeliveryReceiptStatus;
}

export function DeliveryReceiptStatusBadge({ status }: DeliveryReceiptStatusBadgeProps) {
    const getStatusStyles = (statusKey: DeliveryReceiptStatus) => {
        switch (statusKey?.toUpperCase()) {
            case DeliveryReceiptStatus.CREATED:
                return "bg-sky-50 text-sky-700 border-sky-200/60";
            case DeliveryReceiptStatus.COMPLETED:
                return "bg-emerald-50 text-emerald-700 border-emerald-200/60";
            case DeliveryReceiptStatus.CANCELLED:
                return "bg-rose-50 text-rose-700 border-rose-200/60";
            default:
                return "bg-gray-50 text-gray-700 border-gray-200";
        }
    };

    return (
        <span
            className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider ${getStatusStyles(
                status
            )}`}
        >
            {status}
        </span>
    );
}