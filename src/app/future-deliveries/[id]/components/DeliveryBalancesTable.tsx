import { FutureDeliveryItemProps } from '@/modules/future-delivery/domain/future-delivery.entity';
import { DeliveryReceiptItem } from '../future-delivery-view.types';

interface DeliveryBalancesTableProps {
    items: FutureDeliveryItemProps[];
    itemsToDeliver: DeliveryReceiptItem[];
    onAddToDeliveryReceipt: (item: FutureDeliveryItemProps) => void;
}

export function DeliveryBalancesTable({
    items,
    itemsToDeliver,
    onAddToDeliveryReceipt,
}: DeliveryBalancesTableProps) {
    return (
        <div className="bg-surface border border-border rounded-xl overflow-hidden flex flex-col h-full">
            <div className="px-4 py-3 border-b border-border-subtle bg-subtle/30">
                <h2 className="text-xs font-semibold text-tertiary uppercase">
                    Delivery Balances
                </h2>
            </div>
            <div className="overflow-x-auto flex-1">
                <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-subtle/50 text-xs text-tertiary uppercase border-b border-border-subtle">
                        <tr>
                            <th className="px-4 py-3 font-medium">Product</th>
                            <th className="px-4 py-3 font-medium text-right">Purchased</th>
                            <th className="px-4 py-3 font-medium text-right">Delivered</th>
                            <th className="px-4 py-3 font-medium text-right">Pending</th>
                            <th className="px-4 py-3 font-medium text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border-subtle">
                        {items.map((item) => {
                            const inReceipt = itemsToDeliver.some((r) => r.itemId === item.id);
                            const remaining = item.purchasedQuantity - item.deliveredQuantity;
                            const isOut = remaining <= 0;

                            const displayProductId = item.productId
                                ? item.productId.slice(-6).toUpperCase()
                                : 'N/A';

                            return (
                                <tr key={item.id ?? item.productId} className="hover:bg-subtle/20 transition-colors">
                                    <td className="px-4 py-2 max-w-2">
                                        <span className="block font-medium text-primary whitespace-break-spaces">{item.description}</span>
                                        <span className="text-xs text-tertiary font-mono">ID: {displayProductId}</span>
                                    </td>
                                    <td className="px-4 py-2 text-right text-secondary w-0">
                                        {Number(item.purchasedQuantity).toLocaleString('en-US', { maximumFractionDigits: 2 })}
                                    </td>
                                    <td className="px-4 py-2 text-right text-green-600 font-medium w-0">
                                        {Number(item.deliveredQuantity).toLocaleString('en-US', { maximumFractionDigits: 2 })}
                                    </td>
                                    <td className="px-4 py-2 text-right font-bold text-primary w-0">
                                        {Number(remaining).toLocaleString('en-US', { maximumFractionDigits: 2 })}
                                    </td>
                                    <td className="px-4 py-2 text-center w-0">
                                        <button
                                            onClick={() => onAddToDeliveryReceipt(item)}
                                            disabled={inReceipt || isOut}
                                            className="px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all disabled:opacity-40 disabled:cursor-not-allowed border-brand text-brand hover:bg-brand hover:text-white cursor-pointer"
                                        >
                                            {inReceipt ? 'Queued' : isOut ? 'Completed' : 'Add'}
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}