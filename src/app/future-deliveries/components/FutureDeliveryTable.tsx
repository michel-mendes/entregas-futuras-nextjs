import Link from "next/link";
import { Eye, Truck, PackageX } from "lucide-react";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { FutureDeliveryStatusBadge } from "./FutureDeliveryStatusBadge";
import { FutureDeliveryItemProps, FutureDeliveryProps, FutureDeliveryStatus } from "@/modules/future-delivery/domain/future-delivery.entity";

interface FutureDeliveryTableProps {
    deliveries: FutureDeliveryProps[];
    isLoading: boolean;
}

export function FutureDeliveryTable({ deliveries, isLoading }: FutureDeliveryTableProps) {

    return (
        <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-secondary">
                    <thead className="border-b border-border bg-subtle/50 text-xs font-semibold uppercase tracking-wider text-tertiary">
                        <tr>
                            <th scope="col" className="px-4 py-3.5">
                                ID / Date
                            </th>
                            <th scope="col" className="px-4 py-3.5">
                                Customer Name
                            </th>
                            <th scope="col" className="px-4 py-3.5 min-w-[200px]">
                                Progress
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
                            <tr>
                                <td colSpan={5} className="px-4 py-8 text-center text-tertiary">
                                    <div className="inline-flex items-center gap-2">
                                        <Truck className="h-5 w-5 animate-bounce text-brand" />
                                        <span>Loading future deliveries...</span>
                                    </div>
                                </td>
                            </tr>
                        ) : deliveries.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-4 py-8 text-center text-tertiary">
                                    <div className="flex flex-col items-center justify-center gap-2">
                                        <PackageX className="h-8 w-8 text-tertiary/60" />
                                        <p className="font-medium">
                                            No future deliveries found for the selected filters.
                                        </p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            deliveries.map((delivery) => {
                                const formattedDelivered = Number(
                                    delivery.totalDeliveredItems ?? 0
                                ).toLocaleString(undefined, { maximumFractionDigits: 2 });

                                const formattedPurchased = Number(
                                    delivery.totalPurchasedItems ?? 0
                                ).toLocaleString(undefined, { maximumFractionDigits: 2 });

                                const progressLabel = `${formattedDelivered} / ${formattedPurchased} delivered`;
                                const formattedDate = new Date(
                                    delivery.createdAt
                                ).toLocaleDateString("pt-BR");

                                return (
                                    <tr
                                        key={delivery.id}
                                        className="transition hover:bg-subtle/40"
                                    >
                                        <td className="whitespace-nowrap px-4 py-3.5 font-medium text-primary">
                                            #{delivery.id}
                                            <span className="ml-1 text-xs font-normal text-tertiary">
                                                ({formattedDate})
                                            </span>
                                        </td>
                                        <td className="px-4 py-3.5 font-medium text-primary">
                                            {delivery.customer.name}
                                        </td>
                                        <td className="px-4 py-3.5">
                                            <ProgressBar
                                                percentual={delivery.progressPercentage ?? 0}
                                                label={progressLabel}
                                            />
                                        </td>
                                        <td className="px-4 py-3.5">
                                            <FutureDeliveryStatusBadge status={delivery.status as FutureDeliveryStatus} />
                                        </td>
                                        <td className="px-4 py-3.5 text-right">
                                            <Link
                                                href={`/future-deliveries/${delivery.id}`}
                                                className="inline-flex items-center gap-1 rounded-md border border-border px-2.5 py-1.5 text-xs font-semibold text-secondary transition hover:bg-subtle hover:text-primary focus:outline-none focus:ring-2 focus:ring-brand/20"
                                            >
                                                <Eye className="h-3.5 w-3.5" />
                                                Open
                                            </Link>
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