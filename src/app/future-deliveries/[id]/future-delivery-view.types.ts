import { FutureDeliveryProps } from '@/modules/future-delivery/domain/future-delivery.entity';

export interface DeliveryReceiptItem {
  itemId: string;
  productId: string;
  description: string;
  remaining: number;
  qtyToDeliver: number | string;
  obs: string;
}

export interface FutureDeliveryViewState {
  delivery: FutureDeliveryProps | null;
  itemsToDeliver: DeliveryReceiptItem[];
  loading: boolean;
  submitting: boolean;
  isConfirmModalOpen: boolean;
  validationErrors: Record<string, string>;
}