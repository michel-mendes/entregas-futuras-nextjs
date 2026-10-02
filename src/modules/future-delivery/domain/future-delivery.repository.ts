import { FutureDeliveryEntity, FutureDeliveryStatus } from './future-delivery.entity';

export type FutureFutureDeliveryStatusFilter = FutureDeliveryStatus | "ALL";

export interface FutureDeliveryFilter {
    page: number;
    limit: number;
    customerName?: string;
    customerDocument?: string;
    status?: FutureFutureDeliveryStatusFilter;
    startDate?: Date;
    endDate?: Date;
}

export interface FindAllFutureDeliveriesResponse {
    data: FutureDeliveryEntity[];
    totalPages: number;
    totalRecords: number;
}

export interface FutureDeliveryRepository {
    findById(id: string): Promise<FutureDeliveryEntity | null>;
    findByCustomerDocument(document: string): Promise<FutureDeliveryEntity[]>;
    findAll(filter: FutureDeliveryFilter): Promise<FindAllFutureDeliveriesResponse>;
    save(delivery: FutureDeliveryEntity): Promise<FutureDeliveryEntity>;
}