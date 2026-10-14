'use client';

import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { FormField } from '@/components/ui/FormField';
import { CreateFutureDeliveryInput } from '@/modules/future-delivery/application/future-delivery.validator';

interface CustomerSectionProps {
    register: UseFormRegister<CreateFutureDeliveryInput>;
    errors: FieldErrors<CreateFutureDeliveryInput>;
    inputClass: (hasError: boolean) => string;
}

export function NewFutureDeliveryCustomerSection({ register, errors, inputClass }: CustomerSectionProps) {
    return (
        <div className="bg-surface border border-border rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-border-subtle bg-subtle/30">
                <h2 className="text-xs font-semibold text-tertiary uppercase">Customer Details</h2>
            </div>
            <div className="p-4 space-y-3">
                <FormField label="Full Name / Company Name" required error={errors.customer?.name?.message}>
                    <input
                        {...register('customer.name')}
                        className={inputClass(!!errors.customer?.name)}
                        placeholder="John Doe / Acme Corp"
                    />
                </FormField>
                <div className="grid grid-cols-2 gap-3">
                    <FormField label="Tax ID (CPF / CNPJ)" required error={errors.customer?.document?.message}>
                        <input
                            {...register('customer.document')}
                            className={inputClass(!!errors.customer?.document)}
                            placeholder="Numbers only"
                        />
                    </FormField>
                    <FormField label="Phone Number" required error={errors.customer?.phone?.message}>
                        <input
                            {...register('customer.phone')}
                            className={inputClass(!!errors.customer?.phone)}
                            placeholder="(00) 00000-0000"
                        />
                    </FormField>
                </div>
            </div>
        </div>
    );
}