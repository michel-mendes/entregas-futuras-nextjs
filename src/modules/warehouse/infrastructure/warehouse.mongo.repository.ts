import { Model, QueryFilter, Schema } from "mongoose";
import { WarehouseEntity } from "../domain/warehouse.entity";
import { IWarehouseDocument } from "./warehouse.model";
import { IWarehouseRepository, ListWarehousesParams, ListWarehousesResponse } from "../domain/warehouse.repository";

export class WarehouseMongooseRepository implements IWarehouseRepository {

    constructor(private readonly model: Model<IWarehouseDocument>) { }

    private toDomain(doc: IWarehouseDocument): WarehouseEntity {
        return new WarehouseEntity({
            id: doc._id.toString(),
            name: doc.name,
            sector: doc.sector,
            isActive: doc.isActive,
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt
        });
    }

    async findAll(params: ListWarehousesParams): Promise<ListWarehousesResponse> {
        const { page, limit, name, sector, status } = params;
        const skip = (page - 1) * limit;

        const query: QueryFilter<IWarehouseDocument> = {};

        if (name) {
            query.name = { $regex: name, $options: "i" };
        }

        if (sector) {
            query.sector = { $regex: sector, $options: "i" };
        }

        if (status && status !== "ALL") {
            query.isActive = status === "ACTIVE";
        }

        const [data, totalRecords] = await Promise.all([
            this.model.find(query).skip(skip).limit(limit).lean().exec(),
            this.model.countDocuments(query).exec()
        ]);

        return {
            data: data.map(doc => this.toDomain(doc)),
            totalPages: Math.ceil(totalRecords / limit),
            totalRecords
        };
    }

    async findById(id: string): Promise<WarehouseEntity | null> {
        const doc = await this.model.findById(id).lean().exec();
        if (!doc) return null;

        return this.toDomain(doc);
    }

    async findByName(name: string): Promise<WarehouseEntity | null> {
        const doc = await this.model.findOne({ name }).lean().exec();
        if (!doc) return null;

        return this.toDomain(doc);
    }

    async create(warehouse: WarehouseEntity): Promise<WarehouseEntity> {
        const props = warehouse.toObject();

        const { id, ...dataToSave } = props;

        const createdDoc = await this.model.create(dataToSave);
        return this.toDomain(createdDoc);
    }

    async update(warehouse: WarehouseEntity): Promise<WarehouseEntity> {
        const props = warehouse.toObject();

        const { id, ...dataToUpdate } = props;

        if (!id) {
            throw new Error("Cannot update a warehouse without an ID.");
        }

        const updatedDoc = await this.model
            .findByIdAndUpdate(id, dataToUpdate, { new: true })
            .lean()
            .exec();

        if (!updatedDoc) {
            throw new Error(`Warehouse with ID ${id} not found.`);
        }

        return this.toDomain(updatedDoc);
    }

    async delete(id: string): Promise<void> {
        const objectId = new Schema.Types.ObjectId(id);
        const result = await this.model.deleteOne({ _id: objectId }).exec();

        if (result.deletedCount === 0) {
            throw new Error(`Warehouse with ID ${id} not found.`);
        }
    }
}