'use client';

import { use } from 'react';
import { IconSpinner } from '@/components/ui/Icons';
import { useFutureDeliveryView } from './future-delivery-view.hook';
import { FutureDeliveryHeader } from './components/FutureDeliveryHeader';
import { CustomerDetailsCard } from './components/CustomerDetailsCard';
import { DeliveryAddressCard } from './components/DeliveryAddressCard';
import { DeliveryBalancesTable } from './components/DeliveryBalancesTable';
import { DeliveryReceiptPanel } from './components/DeliveryReceiptPanel';
import { ConfirmReceiptModal } from './components/ConfirmDeliveryReceiptModal';

export default function ViewFutureDeliveryPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);

    const {
        delivery,
        itemsToDeliver,
        loading,
        submitting,
        isConfirmModalOpen,
        validationErrors,
        setIsConfirmModalOpen,
        addToReceipt,
        removeFromReceipt,
        updateReceiptQuantity,
        updateReceiptNotes,
        handleOpenConfirmation,
        handleConfirmFinalize,
    } = useFutureDeliveryView(id);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center text-tertiary">
                <IconSpinner />
                <span className="ml-2">Loading delivery details...</span>
            </div>
        );
    }

    if (!delivery) {
        return (
            <div className="p-8 text-center text-red-500 font-medium">
                Delivery record not found.
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-canvas pb-12">
            <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 py-6 space-y-4">
                <FutureDeliveryHeader delivery={delivery} />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <CustomerDetailsCard customer={delivery.customer} />
                    <DeliveryAddressCard address={delivery.deliveryAddress} />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <div className="lg:col-span-2">
                        <DeliveryBalancesTable
                            items={delivery.items}
                            itemsToDeliver={itemsToDeliver}
                            onAddToDeliveryReceipt={addToReceipt}
                        />
                    </div>

                    <div className="lg:col-span-1">
                        <DeliveryReceiptPanel
                            itemsToDeliver={itemsToDeliver}
                            validationErrors={validationErrors}
                            submitting={submitting}
                            onRemoveItem={removeFromReceipt}
                            onUpdateQuantity={updateReceiptQuantity}
                            onUpdateNotes={updateReceiptNotes}
                            onSubmit={handleOpenConfirmation}
                        />
                    </div>
                </div>
            </div>

            <ConfirmReceiptModal
                isOpen={isConfirmModalOpen}
                submitting={submitting}
                customer={delivery.customer}
                address={delivery.deliveryAddress}
                itemsToDeliver={itemsToDeliver}
                onClose={() => setIsConfirmModalOpen(false)}
                onConfirm={handleConfirmFinalize}
            />
        </div>
    );
}