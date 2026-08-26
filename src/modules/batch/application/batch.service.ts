import { PaginatedResponse } from "@/types/pagination.types";
import { BatchRepository, BatchSearchFilters } from "../domain/batch.repository";
import { CreateBatchDTO } from "./batch.validator";
import { BatchEntity, BatchProps } from "../domain/batch.entity";
import { MongoBatchRepository } from "../infrastructure/batch.mongo.repository";
import { BatchModel } from "../infrastructure/batch.model";
import { Produto } from "@/modules/produto/produto.model";
import { WarehouseModel } from "@/modules/warehouse/infrastructure/warehouse.model";

export class BatchService {
    constructor(private readonly batchRepository: BatchRepository) { }

    async createBatch(data: CreateBatchDTO): Promise<BatchProps> {
        
        const newBatchEntity = new BatchEntity({
            productId: data.productId,
            warehouseId: data.warehouseId,
            gauge: data.gauge,
            shade: data.shade,
            initialQuantity: data.initialQuantity,
            productionDate: data.productionDate,
            batchNumber: data.batchNumber,
            detailedLocation: data.detailedLocation,
            notes: data.notes,
            active: true,
            currentQuantity: data.initialQuantity,
            reservedQuantity: 0,
            createdAt: new Date()
        });

        const createdBatch = await this.batchRepository.create(newBatchEntity);

        return createdBatch.toObject();
    }
    
    async searchBatches(params: BatchSearchFilters): Promise<PaginatedResponse<BatchProps>> {
        const response = await this.batchRepository.search(params);

        const batchesJson = response.data.map(entity => entity.toObject());

        return {
            data: batchesJson,
            meta: {
                totalPaginas: response.totalPages,
                totalRegistros: response.totalRecords,
                paginaAtual: params.page,
                itensPorPagina: params.limit,
                temPaginaAnterior: params.page < response.totalPages,
                temProximaPagina: params.page > 1
            }
        };
    }
}

export function makeBatchService(): BatchService {
    const batchRepository = new MongoBatchRepository(BatchModel, Produto, WarehouseModel);

    return new BatchService(batchRepository);
}