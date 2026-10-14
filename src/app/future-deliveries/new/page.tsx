'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { futureDeliveriesApi } from '@/modules/future-delivery/presentation/future-delivery.api';
import { CreateFutureDeliverySchema, CreateFutureDeliveryInput } from '@/modules/future-delivery/application/future-delivery.validator';
import { useToast } from '@/components/ui/ToastNotifier';
import { NewFutureDeliveryHeader } from './components/NewFutureDeliveryHeader';
import { NewFutureDeliveryCustomerSection } from './components/NewFutureDeliveryCustomerSection';
import { NewFutureDeliveryAddressSection } from './components/NewFutureDeliveryAddressSection';
import { NewFutureDeliveryItemsSection } from './components/NewFutureDeliveryItemsSection';
import { NewFutureDeliveryFormActions } from './components/NewFutureDeliveryFormActions';

export default function NewFutureDeliveryPage() {
    const router = useRouter();
    const { toastNotify } = useToast();

    const {
        register,
        handleSubmit,
        control,
        formState: { errors, isSubmitting },
    } = useForm<CreateFutureDeliveryInput>({
        resolver: zodResolver(CreateFutureDeliverySchema),
        defaultValues: {
            items: [],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        keyName: 'id',
        name: 'items',
    });

    const onSubmit = async (data: CreateFutureDeliveryInput) => {
        try {
            await futureDeliveriesApi.createFutureDelivery(data);
            toastNotify({
                title: 'New future delivery created',
                description: `Delivery for ${data.customer.name} successfully created.`,
            });
            setTimeout(() => router.push('/future-deliveries'), 1500);
        } catch (error: any) {
            toastNotify({
                title: 'Oops...',
                description: error.message ?? 'Something went wrong, try again later.',
            });
        }
    };

    const inputClass = (hasError: boolean) =>
        `w-full bg-surface border rounded-xl px-3 py-2 text-sm text-primary placeholder:text-tertiary focus:outline-none focus:ring-2 transition-all ${hasError ? 'border-red-400 focus:ring-red-200' : 'border-border focus:ring-brand/20'
        }`;

    return (
        <div className="min-h-screen bg-canvas">
            <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4">
                <NewFutureDeliveryHeader />

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <NewFutureDeliveryCustomerSection register={register} errors={errors} inputClass={inputClass} />
                        <NewFutureDeliveryAddressSection register={register} errors={errors} inputClass={inputClass} />
                    </div>

                    <NewFutureDeliveryItemsSection
                        fields={fields}
                        append={append}
                        remove={remove}
                        register={register}
                        errors={errors}
                        inputClass={inputClass}
                    />

                    <NewFutureDeliveryFormActions isSubmitting={isSubmitting} hasItems={fields.length > 0} />
                </form>
            </div>
        </div>
    );
}