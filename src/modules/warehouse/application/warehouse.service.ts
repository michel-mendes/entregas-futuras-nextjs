import { PaginatedResponse } from "@/types/pagination.types";
import { IWarehouseRepository, ListWarehousesParams } from "../domain/warehouse.repository";
import { WarehouseEntity, IWarehouseProps } from "../domain/warehouse.entity";
import { WarehouseMongooseRepository } from "../infrastructure/warehouse.mongo.repository";
import { WarehouseModel } from "../infrastructure/warehouse.model";
import { CreateWarehouseDTO, UpdateWarehouseDTO } from "../presentation/warehouse.validation";
import { AppError } from "@/lib/errors/AppError";

export class WarehouseService {

    constructor(private readonly warehouseRepository: IWarehouseRepository) { }

    async createWarehouse(data: CreateWarehouseDTO): Promise<IWarehouseProps> {
        
        const existingWarehouse = await this.warehouseRepository.findByName(data.name);
        if (existingWarehouse) {
            throw AppError.Conflict(`A warehouse with the name '${data.name}' already exists.`);
        }

        const newWarehouseEntity = new WarehouseEntity({
            name: data.name,
            sector: data.sector,
            isActive: data.isActive,
        });

        const createdWarehouse = await this.warehouseRepository.create(newWarehouseEntity);

        return createdWarehouse.toObject();
    }

    async listWarehouses(params: ListWarehousesParams): Promise<PaginatedResponse<IWarehouseProps>> {
        const response = await this.warehouseRepository.findAll(params);

        const warehousesJson = response.data.map(entity => entity.toObject());

        return {
            data: warehousesJson,
            meta: {
                totalPaginas: response.totalPages,
                totalRegistros: response.totalRecords,
                paginaAtual: params.page,
                itensPorPagina: params.limit,
                temProximaPagina: params.page < response.totalPages,
                temPaginaAnterior: params.page > 1
            }
        };
    }

    async getWarehouseById(id: string): Promise<IWarehouseProps> {
        const warehouse = await this.warehouseRepository.findById(id);
        if (!warehouse) {
            throw AppError.NotFound(`Warehouse with ID '${id}' not found.`);
        }

        return warehouse.toObject();
    }

    async updateWarehouse(id: string, data: UpdateWarehouseDTO): Promise<IWarehouseProps> {
        const warehouse = await this.warehouseRepository.findById(id);
        if (!warehouse) {
            throw AppError.NotFound(`Warehouse with ID '${id}' not found.`);
        }

        if (warehouse.name !== data.name) {
            const nameCollision = await this.warehouseRepository.findByName(data.name);
            if (nameCollision) {
                throw AppError.Conflict(`A warehouse with the name '${data.name}' already exists.`);
            }
        }

        warehouse.updateDetails(data.name, data.sector);

        const updatedWarehouse = await this.warehouseRepository.update(warehouse);
        return updatedWarehouse.toObject();
    }

    async toggleStatus(id: string, activate: boolean): Promise<IWarehouseProps> {
        const warehouse = await this.warehouseRepository.findById(id);
        if (!warehouse) {
            throw AppError.NotFound(`Warehouse with ID '${id}' not found.`);
        }

        if (activate) {
            warehouse.activate();
        } else {
            warehouse.deactivate();
        }

        const updatedWarehouse = await this.warehouseRepository.update(warehouse);
        return updatedWarehouse.toObject();
    }
}

export function makeWarehouseService(): WarehouseService {
    const warehouseRepository = new WarehouseMongooseRepository(WarehouseModel);
    return new WarehouseService(warehouseRepository);
}