'use client';

import { UseFormRegister, FieldErrors, UseFieldArrayAppend, UseFieldArrayRemove, FieldArrayWithId } from 'react-hook-form';
import { ProductAutocomplete } from '@/components/ui/ProductAutocomplete';
import { FormField } from '@/components/ui/FormField';
import { CreateFutureDeliveryInput } from '@/modules/future-delivery/application/future-delivery.validator';
import { Trash2 } from 'lucide-react';

interface DeliveryItemsSectionProps {
    fields: FieldArrayWithId<CreateFutureDeliveryInput, "items", "id">[];
    append: UseFieldArrayAppend<CreateFutureDeliveryInput, "items">;
    remove: UseFieldArrayRemove;
    register: UseFormRegister<CreateFutureDeliveryInput>;
    errors: FieldErrors<CreateFutureDeliveryInput>;
    inputClass: (hasError: boolean) => string;
}

export function NewFutureDeliveryItemsSection({
    fields,
    append,
    remove,
    register,
    errors,
    inputClass,
}: DeliveryItemsSectionProps) {
    return (
        <div className="bg-surface border border-border rounded-xl">
            <div className="px-4 py-3 border-b border-border-subtle bg-subtle/30 rounded-t-xl">
                <h2 className="text-xs font-semibold text-tertiary uppercase">Delivery Items</h2>
            </div>

            <div className="p-4 border-b border-border-subtle relative z-20">
                <FormField label="Add Product" error={errors.items?.root?.message}>
                    <ProductAutocomplete
                        onSelect={(product) => {
                            append({
                                productId: product.id ?? '',
                                description: product.name,
                                purchasedQuantity: 1,
                                deliveredQuantity: 0,
                            });
                        }}
                    />
                </FormField>
            </div>

            {fields.length > 0 ? (
                <div className="overflow-x-auto rounded-b-xl">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-subtle/50 text-xs text-tertiary uppercase">
                            <tr>
                                <th className="px-4 py-3 font-medium">Product</th>
                                <th className="px-4 py-3 font-medium w-32">Purchased Qty</th>
                                <th className="px-4 py-3 font-medium w-16 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-subtle">
                            {fields.map((field, index) => (
                                <tr key={field.id} className="hover:bg-subtle/30 transition-colors">
                                    <td className="px-4 py-2 text-primary font-medium">
                                        {field.description}
                                        {errors.items?.[index]?.productId && (
                                            <span className="block text-xs text-red-500">
                                                {errors.items[index]?.productId?.message}
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-4 py-2">
                                        <input
                                            type="number"
                                            step="0.01"
                                            {...register(`items.${index}.purchasedQuantity`, { valueAsNumber: true })}
                                            className={inputClass(!!errors.items?.[index]?.purchasedQuantity)}
                                        />
                                        {errors.items?.[index]?.purchasedQuantity && (
                                            <span className="block text-xs text-red-500 mt-1">
                                                {errors.items[index]?.purchasedQuantity?.message}
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-4 py-2 text-center">
                                        <button
                                            type="button"
                                            onClick={() => remove(index)}
                                            className="text-red-500 hover:text-red-700 p-1.5 rounded-md hover:bg-red-50 transition-colors cursor-pointer"
                                            title="Remove item"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="p-8 text-center text-sm text-tertiary">
                    No items added to the delivery yet.
                </div>
            )}
        </div>
    );
}