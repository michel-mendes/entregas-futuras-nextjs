import { useRouter } from 'next/navigation';
import { FutureDeliveryProps, FutureDeliveryStatus } from '@/modules/future-delivery/domain/future-delivery.entity';
import { IconChevronLeft } from '@/components/ui/Icons';
import { ProgressBar } from '@/components/ui/ProgressBar';

interface FutureDeliveryHeaderProps {
    delivery: FutureDeliveryProps;
}

export function FutureDeliveryHeader({ delivery }: FutureDeliveryHeaderProps) {
    const router = useRouter();
    const isCompleted = delivery.status === FutureDeliveryStatus.COMPLETED;
    const displayId = delivery.id ? delivery.id.slice(-6).toUpperCase() : 'N/A';

    const formattedDate = new Date(delivery.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });

    return (
        <div className="flex items-center justify-between gap-4 bg-surface p-4 border border-border rounded-xl">
            <div className="flex items-center gap-3">
                <button
                    onClick={() => router.back()}
                    className="flex items-center justify-center w-9 h-9 rounded-xl bg-subtle border border-border text-secondary hover:text-primary transition-all cursor-pointer"
                >
                    <IconChevronLeft />
                </button>
                <div>
                    <div className="flex items-center gap-2">
                        <h1 className="text-lg font-semibold text-primary uppercase">
                            Delivery #{displayId}
                        </h1>
                        <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wide uppercase ${isCompleted ? 'bg-green-100 text-green-700' : 'bg-brand-muted text-brand'
                                }`}
                        >
                            {delivery.status ? delivery.status.replace('_', ' ') : 'PENDING'}
                        </span>
                    </div>
                    <p className="text-xs text-tertiary">Registered on {formattedDate}</p>
                </div>
            </div>
            <div className="w-48 sm:w-64">
                <ProgressBar
                    percentual={delivery.progressPercentage ?? 0}
                    label={`${Number(delivery.totalDeliveredItems ?? 0).toLocaleString('en-US', { maximumFractionDigits: 2 })} of ${Number(delivery.totalPurchasedItems ?? 0).toLocaleString('en-US', { maximumFractionDigits: 2 })} delivered`}
                />
            </div>
        </div>
    );
}