import { useState, useEffect, useCallback } from 'react';
import { futureDeliveriesApi } from '@/modules/future-delivery/presentation/future-delivery.api';
import { FutureDeliveryProps, FutureDeliveryItemProps } from '@/modules/future-delivery/domain/future-delivery.entity';
import { useToast } from '@/components/ui/ToastNotifier';
import { DeliveryReceiptItemInput } from '@/modules/delivery-receipt/application/delivery-receipt.validator';
import { DeliveryReceiptItem } from './future-delivery-view.types';
import { DeliveryReceiptFormSchema } from './future-delivery-view.validator';

export function useFutureDeliveryView(id: string) {
  const { toastNotify } = useToast();

  const [delivery, setDelivery] = useState<FutureDeliveryProps | null>(null);
  const [itemsToDeliver, setItemsToDeliver] = useState<DeliveryReceiptItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const fetchDelivery = useCallback(async () => {
    try {
      setLoading(true);
      const response = await futureDeliveriesApi.getFutureDeliveryById(id);
      setDelivery(response.data ?? null);
    } catch (err) {
      toastNotify({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Failed to fetch delivery details.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [id, toastNotify]);

  useEffect(() => {
    fetchDelivery();
  }, [fetchDelivery]);

  const addToReceipt = (item: FutureDeliveryItemProps) => {
    if (!item.id) return;
    const remaining = item.purchasedQuantity - item.deliveredQuantity;
    if (remaining <= 0) return;
    if (itemsToDeliver.some((r) => r.itemId === item.id)) return;

    setItemsToDeliver((prev) => [
      ...prev,
      {
        itemId: item.id!,
        productId: item.productId,
        description: item.description,
        remaining,
        qtyToDeliver: 1,
        obs: '',
      },
    ]);
    setValidationErrors({});
  };

  const removeFromReceipt = (itemId: string) => {
    setItemsToDeliver((prev) => prev.filter((r) => r.itemId !== itemId));
    setValidationErrors((prev) => {
      const copy = { ...prev };
      delete copy[itemId];
      return copy;
    });
  };

  const updateReceiptQuantity = (itemId: string, qty: number | string) => {
    setItemsToDeliver((prev) =>
      prev.map((r) => (r.itemId === itemId ? { ...r, qtyToDeliver: qty } : r))
    );
  };

  const updateReceiptNotes = (itemId: string, obs: string) => {
    setItemsToDeliver((prev) =>
      prev.map((r) => (r.itemId === itemId ? { ...r, obs } : r))
    );
  };

  const validateReceipt = (): boolean => {
    const formattedItems = itemsToDeliver.map((item) => ({
      ...item,
      qtyToDeliver: typeof item.qtyToDeliver === 'string' ? Number(item.qtyToDeliver) : item.qtyToDeliver,
    }));

    const result = DeliveryReceiptFormSchema.safeParse({ items: formattedItems });

    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        if (issue.path.length >= 2) {
          const itemIndex = issue.path[1] as number;
          const targetItem = itemsToDeliver[itemIndex];
          if (targetItem) {
            errors[targetItem.itemId] = issue.message;
          }
        } else {
          errors['general'] = issue.message;
        }
      });
      setValidationErrors(errors);

      toastNotify({
        title: 'Validation Failed',
        description: 'Please correct highlighted errors before proceeding.',
        variant: 'destructive',
      });
      return false;
    }

    setValidationErrors({});
    return true;
  };

  const handleOpenConfirmation = () => {
    if (validateReceipt()) {
      setIsConfirmModalOpen(true);
    }
  };

  const handleConfirmFinalize = async () => {
    if (!delivery || itemsToDeliver.length === 0) return;

    try {
      setSubmitting(true);

      const itemsPayload: DeliveryReceiptItemInput[] = itemsToDeliver.map((r) => ({
        itemId: r.itemId,
        productId: r.productId,
        quantity: typeof r.qtyToDeliver === 'string' ? Number(r.qtyToDeliver) : r.qtyToDeliver,
        itemNotes: r.obs.trim() || undefined,
      }));

      await futureDeliveriesApi.registerPartialDelivery(id, {
        deliveryDate: new Date(),
        deliveryNumber: delivery.id!,
        futureDeliveryId: delivery.id!,
        recipient: {
          name: delivery.customer.name,
          address: `${delivery.deliveryAddress.street}, ${delivery.deliveryAddress.number} - ${delivery.deliveryAddress.city}/${delivery.deliveryAddress.state}`,
          phone: delivery.customer.phone,
        },
        saleId: '1',
        saleType: 'cash',
        notes: '',
        items: itemsPayload,
      });

      toastNotify({
        title: 'Delivery Registered',
        description: 'Delivery receipt successfully generated and recorded.',
      });

      setItemsToDeliver([]);
      setIsConfirmModalOpen(false);
      await fetchDelivery();
    } catch (err) {
      toastNotify({
        title: 'Registration Error',
        description: err instanceof Error ? err.message : 'Failed to register delivery receipt. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return {
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
  };
}