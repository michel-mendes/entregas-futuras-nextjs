import { FutureDeliveryStatus } from "@/modules/future-delivery/domain/future-delivery.entity";

interface FutureDeliveryStatusBadgeProps {
    status: FutureDeliveryStatus;
}

export function FutureDeliveryStatusBadge({ status }: FutureDeliveryStatusBadgeProps) {

    const getStatusStyles = (statusKey: FutureDeliveryStatus) => {
        switch (statusKey.toUpperCase()) {
            case FutureDeliveryStatus.PENDING:
                return "bg-amber-50 text-amber-700 border-amber-200/60";
            case FutureDeliveryStatus.COMPLETED:
                return "bg-emerald-50 text-emerald-700 border-emerald-200/60";
            case FutureDeliveryStatus.PARTIAL:
                return "bg-sky-50 text-sky-700 border-sky-200/60";
            case FutureDeliveryStatus.CANCELLED:
                return "bg-rose-50 text-rose-700 border-rose-200/60";
            default:
                return "bg-gray-50 text-gray-700 border-gray-200";
        }
    };

    return (
        <span
            className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider ${getStatusStyles(status)}`}
        >
            {status}
        </span>
    );

}