import { DeliveryReceiptEntity, DeliveryReceiptStatus } from './delivery-receipt.entity';

export type DeliveryReceiptStatusFilter = DeliveryReceiptStatus | 'ALL';

export interface DeliveryReceiptFilter {
    page: number;
    limit: number;
    futureDeliveryId?: string;
    saleId?: string;
    deliveryNumber?: string;
    recipientName?: string;
    status?: DeliveryReceiptStatusFilter;
    startDate?: Date;
    endDate?: Date;
}

export interface FindAllDeliveryReceiptsResponse {
    data: DeliveryReceiptEntity[];
    totalPages: number;
    totalRecords: number;
}

export interface DeliveryReceiptRepository {
    findById(id: string): Promise<DeliveryReceiptEntity | null>;
    findByFutureDeliveryId(futureDeliveryId: string): Promise<DeliveryReceiptEntity[]>;
    findBySaleId(saleId: string): Promise<DeliveryReceiptEntity[]>;
    findAll(filter: DeliveryReceiptFilter): Promise<FindAllDeliveryReceiptsResponse>;
    save(deliveryReceipt: DeliveryReceiptEntity): Promise<DeliveryReceiptEntity>;
    cancel(id: string): Promise<DeliveryReceiptEntity | null>;
}