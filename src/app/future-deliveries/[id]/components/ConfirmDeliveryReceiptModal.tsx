import { IconSpinner } from '@/components/ui/Icons';
import { CustomerProps, DeliveryAddressProps } from '@/modules/future-delivery/domain/future-delivery.entity';
import { DeliveryReceiptItem } from '../future-delivery-view.types';

interface ConfirmReceiptModalProps {
    isOpen: boolean;
    submitting: boolean;
    customer: CustomerProps;
    address: DeliveryAddressProps;
    itemsToDeliver: DeliveryReceiptItem[];
    onClose: () => void;
    onConfirm: () => void;
}

export function ConfirmReceiptModal({
    isOpen,
    submitting,
    customer,
    address,
    itemsToDeliver,
    onClose,
    onConfirm,
}: ConfirmReceiptModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-surface border border-border rounded-xl shadow-lg w-full max-w-lg overflow-hidden flex flex-col">
                <div className="px-6 py-4 border-b border-border-subtle bg-subtle/30">
                    <h3 className="text-base font-semibold text-primary">Confirm Delivery Receipt</h3>
                    <p className="text-xs text-secondary mt-0.5">Review summary before finalizing the dispatch receipt.</p>
                </div>

                <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
                    <div className="text-xs bg-canvas p-3 rounded-lg border border-border-subtle space-y-1">
                        <p className="font-semibold text-primary">Recipient: {customer.name}</p>
                        <p className="text-secondary">{address.street}, {address.number} - {address.city}/{address.state}</p>
                    </div>

                    <div>
                        <h4 className="text-xs font-semibold text-tertiary uppercase mb-2">Items to Deliver</h4>
                        <div className="divide-y divide-border-subtle border border-border-subtle rounded-lg overflow-hidden">
                            {itemsToDeliver.map((item) => (
                                <div key={item.itemId} className="p-3 flex justify-between items-center text-sm">
                                    <div>
                                        <p className="font-medium text-primary">{item.description}</p>
                                        {item.obs && <p className="text-xs text-tertiary italic">"{item.obs}"</p>}
                                    </div>
                                    <div className="text-right font-mono font-semibold text-brand">
                                        Qty: {item.qtyToDeliver}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="px-6 py-4 border-t border-border-subtle bg-subtle/30 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        disabled={submitting}
                        className="px-4 py-2 rounded-lg text-sm font-medium border border-border text-secondary hover:bg-subtle transition-all disabled:opacity-50 cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={submitting}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-brand hover:bg-brand/90 text-white transition-all shadow-sm disabled:opacity-50 cursor-pointer"
                    >
                        {submitting && <IconSpinner />}
                        {submitting ? 'Finalizing...' : 'Confirm and Finalize'}
                    </button>
                </div>
            </div>
        </div>
    );
}