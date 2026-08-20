import { WarehouseEntity } from "./warehouse.entity";

export type WarehouseStatusFilter = "ACTIVE" | "INACTIVE" | "ALL";

export interface ListWarehousesParams {
    page: number;
    limit: number;
    name?: string;
    sector?: string;
    status?: WarehouseStatusFilter;
}

export interface ListWarehousesResponse {
    data: WarehouseEntity[];
    totalPages: number;
    totalRecords: number;
}

export interface IWarehouseRepository {
    findAll(params: ListWarehousesParams): Promise<ListWarehousesResponse>;
    findById(id: string): Promise<WarehouseEntity | null>;
    findByName(name: string): Promise<WarehouseEntity | null>;
    create(warehouse: WarehouseEntity): Promise<WarehouseEntity>;
    update(warehouse: WarehouseEntity): Promise<WarehouseEntity>;
    delete(id: string): Promise<void>;
}