import { BatchEntity } from "./lote.entity";

export type BatchStatusFilter = "ACTIVE" | "INACTIVE" | "ALL";

export interface BatchSearchFilters {
    page: number;
    limit: number;
    productName?: string;
    warehouseName?: string;
    status?: BatchStatusFilter;
};

export interface SearchBatchResponse {
    data: BatchEntity[],
    totalPages: number,
    totalRecords: number
};

export interface BatchRepository {
    search(filters: BatchSearchFilters): Promise<SearchBatchResponse>;
    findById(id: string): Promise<BatchEntity | null>;
    findByProductId(productId: string): Promise<BatchEntity[]>;
    findByWarehouseId(warehouseId: string): Promise<BatchEntity[]>;
    create(batch: BatchEntity): Promise<BatchEntity>;
    save(batch: BatchEntity): Promise<BatchEntity | null>;
};