'use client';

import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { FormField } from '@/components/ui/FormField';
import { CreateFutureDeliveryInput } from '@/modules/future-delivery/application/future-delivery.validator';

interface DeliveryAddressSectionProps {
    register: UseFormRegister<CreateFutureDeliveryInput>;
    errors: FieldErrors<CreateFutureDeliveryInput>;
    inputClass: (hasError: boolean) => string;
}

export function NewFutureDeliveryAddressSection({ register, errors, inputClass }: DeliveryAddressSectionProps) {
    return (
        <div className="bg-surface border border-border rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-border-subtle bg-subtle/30">
                <h2 className="text-xs font-semibold text-tertiary uppercase">Delivery Address</h2>
            </div>
            <div className="p-4 space-y-3">
                <div className="grid grid-cols-3 gap-3">
                    <FormField label="ZIP Code" required error={errors.deliveryAddress?.zipCode?.message}>
                        <input
                            {...register('deliveryAddress.zipCode')}
                            className={inputClass(!!errors.deliveryAddress?.zipCode)}
                            placeholder="00000-000"
                        />
                    </FormField>
                    <FormField label="City" required className="col-span-2" error={errors.deliveryAddress?.city?.message}>
                        <input
                            {...register('deliveryAddress.city')}
                            className={inputClass(!!errors.deliveryAddress?.city)}
                        />
                    </FormField>
                </div>
                <div className="grid grid-cols-4 gap-3">
                    <FormField label="Street Address" required className="col-span-3" error={errors.deliveryAddress?.street?.message}>
                        <input
                            {...register('deliveryAddress.street')}
                            className={inputClass(!!errors.deliveryAddress?.street)}
                            placeholder="Street, Avenue, etc."
                        />
                    </FormField>
                    <FormField label="Number" required error={errors.deliveryAddress?.number?.message}>
                        <input
                            {...register('deliveryAddress.number')}
                            className={inputClass(!!errors.deliveryAddress?.number)}
                        />
                    </FormField>
                </div>
                <div className="grid grid-cols-3 gap-3">
                    <FormField label="Neighborhood" required className="col-span-2" error={errors.deliveryAddress?.neighborhood?.message}>
                        <input
                            {...register('deliveryAddress.neighborhood')}
                            className={inputClass(!!errors.deliveryAddress?.neighborhood)}
                        />
                    </FormField>
                    <FormField label="State" required error={errors.deliveryAddress?.state?.message}>
                        <input
                            {...register('deliveryAddress.state')}
                            maxLength={2}
                            className={inputClass(!!errors.deliveryAddress?.state)}
                            placeholder="SP"
                        />
                    </FormField>
                </div>
            </div>
        </div>
    );
}