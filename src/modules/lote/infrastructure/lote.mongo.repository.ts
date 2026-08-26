import { Model, QueryFilter, Types } from "mongoose";

import { BatchEntity } from "../domain/lote.entity";
import { BatchRepository, BatchSearchFilters, SearchBatchResponse } from "../domain/lote.repository";
import { BatchDocument } from "./lote.model";

import { IWarehouseDocument } from "@/modules/warehouse/infrastructure/warehouse.model";
import { IProduto } from "@/modules/produto/produto.types";

export class MongoBatchRepository implements BatchRepository {
    constructor(
        private readonly batchModel: Model<BatchDocument>,
        private readonly produtoModel: Model<IProduto>,
        private readonly warehouseModel: Model<IWarehouseDocument>
    ) { }

    private toDomain(document: BatchDocument): BatchEntity {
        const entity = new BatchEntity({
            id: document._id.toString(),
            active: document.active,
            productId: (document.productId instanceof Types.ObjectId) ? document.productId.toString() : (document.productId as any)._id.toString(),
            warehouseId: (document.warehouseId instanceof Types.ObjectId) ? document.warehouseId.toString() : (document.warehouseId as any)._id.toString(),
            productName: (document.productId as any)?.descricao || undefined,
            warehouseName: (document.warehouseId as any)?.name || undefined,
            productionDate: document.productionDate,
            batchNumber: document.batchNumber,
            gauge: document.gauge,
            shade: document.shade,
            initialQuantity: document.initialQuantity,
            currentQuantity: document.currentQuantity,
            reservedQuantity: document.reservedQuantity,
            detailedLocation: document.detailedLocation,
            notes: document.notes,
            createdAt: document.createdAt,
            updatedAt: document.updatedAt,
        });
        
        return entity;
    }

    async search(filters: BatchSearchFilters): Promise<SearchBatchResponse> {
        const page = Math.max(1, filters.page || 1);
        const limit = Math.max(1, filters.limit || 10);
        const skip = (page - 1) * limit;

        const query: QueryFilter<BatchDocument> = {};

        if (filters.status === 'ACTIVE') query.active = true;
        else if (filters.status === 'INACTIVE') query.active = false;

        if (filters.productName) {
            const products = await this.produtoModel.find(
                { descricao: { $regex: filters.productName, $options: 'i' } },
                '_id'
            ).lean();

            if (products.length === 0) return this.emptyResponse();

            query.productId = { $in: products.map(p => p._id) };
        }

        if (filters.warehouseName) {
            const warehouses = await this.warehouseModel.find(
                { name: { $regex: filters.warehouseName, $options: 'i' } },
                '_id'
            ).lean();

            if (warehouses.length === 0) return this.emptyResponse();
            
            query.warehouseId = { $in: warehouses.map(w => w._id) };
        }

        const [documents, totalRecords] = await Promise.all([
            this.batchModel.find(query)
                .skip(skip)
                .limit(limit)
                .populate('productId')
                .populate('warehouseId')
                .sort({ createdAt: -1 })
                .lean(),
            this.batchModel.countDocuments(query)
        ]);

        return {
            data: documents.map(this.toDomain),
            totalPages: Math.ceil(totalRecords / limit),
            totalRecords
        };
    }

    async findById(id: string): Promise<BatchEntity | null> {
        const document = await this.batchModel.findById(id).lean().exec();

        return (document) ? this.toDomain(document) : null;
    }

    async findByProductId(productId: string): Promise<BatchEntity[]> {
        const documents = await this.batchModel.find({ productId }).lean().exec();

        return documents.map((document) =>
            this.toDomain(document),
        );
    }

    async findByWarehouseId(warehouseId: string): Promise<BatchEntity[]> {
        const documents = await this.batchModel.find({ warehouseId }).lean().exec();

        return documents.map((document) =>
            this.toDomain(document),
        );
    }

    async create(batch: BatchEntity): Promise<BatchEntity> {
        const props = batch.toObject();
        const { id, ...dataToSave } = props;

        const document = await this.batchModel.create({
            ...dataToSave,
            productId: dataToSave.productId,
            warehouseId: dataToSave.warehouseId,
        });

        return this.toDomain(document);
    }

    async save(batch: BatchEntity): Promise<BatchEntity | null> {
        const document = await this.batchModel.findByIdAndUpdate(
            batch.id,
            batch.toObject(),
            {
                new: true,
                runValidators: true,
            },
        ).lean().exec();

        return (document) ? this.toDomain(document) : null;
    }

    
    // Helpers
    private emptyResponse(): SearchBatchResponse {
        return { data: [], totalPages: 0, totalRecords: 0 };
    }
}