import { IconSpinner, IconSave } from '@/components/ui/Icons';
import { DeliveryReceiptItem } from '../future-delivery-view.types';

interface DeliveryReceiptPanelProps {
    itemsToDeliver: DeliveryReceiptItem[];
    validationErrors: Record<string, string>;
    submitting: boolean;
    onRemoveItem: (itemId: string) => void;
    onUpdateQuantity: (itemId: string, qty: number | string) => void;
    onUpdateNotes: (itemId: string, obs: string) => void;
    onSubmit: () => void;
}

export function DeliveryReceiptPanel({
    itemsToDeliver,
    validationErrors,
    submitting,
    onRemoveItem,
    onUpdateQuantity,
    onUpdateNotes,
    onSubmit,
}: DeliveryReceiptPanelProps) {
    return (
        <div className="bg-surface border border-border rounded-xl flex flex-col h-full shadow-sm">
            <div className="px-4 py-3 border-b border-border-subtle bg-brand-muted/30 flex justify-between items-center">
                <h2 className="text-xs font-bold text-brand uppercase">Delivery Receipt Creation</h2>
                <span className="text-xs font-medium text-brand">{itemsToDeliver.length} items</span>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[300px]">
                {itemsToDeliver.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-tertiary text-sm text-center">
                        <svg
                            className="w-10 h-10 mb-2 opacity-20"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={1}
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                        </svg>
                        No items added to the delivery receipt.
                    </div>
                ) : (
                    itemsToDeliver.map((r) => {
                        const error = validationErrors[r.itemId];

                        return (
                            <div
                                key={r.itemId}
                                className={`p-3 border rounded-lg bg-canvas/50 transition-colors ${error ? 'border-red-400 bg-red-50/20' : 'border-border-subtle'
                                    }`}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-sm font-medium text-primary leading-tight pr-4">
                                        {r.description}
                                    </span>
                                    <button
                                        onClick={() => onRemoveItem(r.itemId)}
                                        className="text-tertiary hover:text-red-500 transition-colors"
                                    >
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>

                                <div className="flex items-center justify-between mt-2">
                                    <span className="text-xs text-secondary">
                                        Max: {Number(r.remaining).toLocaleString('en-US', { maximumFractionDigits: 2 })}
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-tertiary">Qty to send:</span>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={r.qtyToDeliver}
                                            onChange={(e) => onUpdateQuantity(r.itemId, e.target.value)}
                                            className="w-20 px-2 py-1 text-sm text-right border border-border rounded focus:border-brand focus:ring-1 focus:ring-brand outline-none"
                                        />
                                    </div>
                                </div>

                                {error && <p className="text-xs text-red-500 mt-1">{error}</p>}

                                <div className="mt-2">
                                    <input
                                        type="text"
                                        placeholder="Notes / Observations..."
                                        autoComplete="off"
                                        value={r.obs}
                                        onChange={(e) => onUpdateNotes(r.itemId, e.target.value)}
                                        className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
                                    />
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            <div className="p-4 border-t border-border-subtle bg-subtle/50">
                <button
                    onClick={onSubmit}
                    disabled={itemsToDeliver.length === 0 || submitting}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-brand hover:bg-brand/90 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm cursor-pointer"
                >
                    {submitting ? <IconSpinner /> : <IconSave />}
                    {submitting ? 'Registering...' : 'Finalize Delivery Receipt'}
                </button>
            </div>
        </div>
    );
}