import { Types, QueryFilter } from 'mongoose';
import { DeliveryReceiptModel, DeliveryReceiptDocument } from './delivery-receipt.model';
import { DeliveryReceiptEntity } from '../domain/delivery-receipt.entity';
import {
    DeliveryReceiptRepository,
    DeliveryReceiptFilter,
    FindAllDeliveryReceiptsResponse,
} from '../domain/delivery-receipt.repository';

export class MongooseDeliveryReceiptRepository implements DeliveryReceiptRepository {
    constructor(private readonly deliveryReceiptModel: typeof DeliveryReceiptModel) { }

    // --------------------------------------------------------------
    // Data Mapper: Converts Mongoose Documents <-> Domain Entities
    // --------------------------------------------------------------

    private toEntity(doc: DeliveryReceiptDocument): DeliveryReceiptEntity {
        return new DeliveryReceiptEntity({
            id: doc._id.toString(),
            futureDeliveryId: doc.futureDeliveryId.toString(),
            saleId: doc.saleId,
            saleType: doc.saleType,
            deliveryNumber: doc.deliveryNumber,
            deliveryDate: doc.deliveryDate,
            recipient: {
                name: doc.recipient.name,
                address: doc.recipient.address,
                phone: doc.recipient.phone,
            },
            status: doc.status,
            notes: doc.notes,
            items: doc.items.map((item) => ({
                id: item._id ? item._id.toString() : undefined,
                productId: item.productId.toString(),
                batchId: item.batchId,
                quantity: item.quantity,
                itemNotes: item.itemNotes,
            })),
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt,
        });
    }

    private toDocumentProps(props: ReturnType<DeliveryReceiptEntity['toObject']>) {
        return {
            futureDeliveryId: new Types.ObjectId(props.futureDeliveryId),
            saleId: props.saleId,
            saleType: props.saleType,
            deliveryNumber: props.deliveryNumber,
            deliveryDate: props.deliveryDate,
            recipient: props.recipient,
            status: props.status,
            notes: props.notes,
            items: props.items.map((item) => ({
                ...(item.id && Types.ObjectId.isValid(item.id) ? { _id: new Types.ObjectId(item.id) } : {}),
                productId: new Types.ObjectId(item.productId),
                batchId: item.batchId,
                quantity: item.quantity,
                itemNotes: item.itemNotes,
            })),
            createdAt: props.createdAt,
            updatedAt: props.updatedAt,
        };
    }

    // --------------------------------------------------------------
    // Repository Interface Implementation
    // --------------------------------------------------------------

    async findById(id: string): Promise<DeliveryReceiptEntity | null> {
        if (!Types.ObjectId.isValid(id)) {
            return null;
        }

        const doc = await this.deliveryReceiptModel.findById(id).lean<DeliveryReceiptDocument>().exec();

        if (!doc) {
            return null;
        }

        return this.toEntity(doc);
    }

    async findByFutureDeliveryId(futureDeliveryId: string): Promise<DeliveryReceiptEntity[]> {
        if (!Types.ObjectId.isValid(futureDeliveryId)) {
            return [];
        }

        const docs = await this.deliveryReceiptModel
            .find({ futureDeliveryId: new Types.ObjectId(futureDeliveryId) })
            .sort({ createdAt: -1 })
            .lean<DeliveryReceiptDocument[]>()
            .exec();

        return docs.map((doc) => this.toEntity(doc));
    }

    async findBySaleId(saleId: string): Promise<DeliveryReceiptEntity[]> {
        const docs = await this.deliveryReceiptModel
            .find({ saleId })
            .sort({ createdAt: -1 })
            .lean<DeliveryReceiptDocument[]>()
            .exec();

        return docs.map((doc) => this.toEntity(doc));
    }

    async findAll(filter: DeliveryReceiptFilter): Promise<FindAllDeliveryReceiptsResponse> {
        const page = Math.max(1, filter.page || 1);
        const limit = Math.max(1, filter.limit || 10);
        const skip = (page - 1) * limit;

        const query: QueryFilter<DeliveryReceiptDocument> = {};

        if (filter.status && filter.status !== 'ALL') {
            query.status = filter.status;
        }

        if (filter.futureDeliveryId && Types.ObjectId.isValid(filter.futureDeliveryId)) {
            query.futureDeliveryId = new Types.ObjectId(filter.futureDeliveryId);
        }

        if (filter.saleId) {
            query.saleId = filter.saleId;
        }

        if (filter.deliveryNumber) {
            query.deliveryNumber = filter.deliveryNumber;
        }

        if (filter.recipientName) {
            query['recipient.name'] = { $regex: filter.recipientName, $options: 'i' };
        }

        if (filter.startDate || filter.endDate) {
            query.createdAt = {};
            if (filter.startDate) {
                query.createdAt.$gte = filter.startDate;
            }
            if (filter.endDate) {
                query.createdAt.$lte = filter.endDate;
            }
        }

        const [docs, totalRecords] = await Promise.all([
            this.deliveryReceiptModel
                .find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean<DeliveryReceiptDocument[]>()
                .exec(),
            this.deliveryReceiptModel.countDocuments(query).exec(),
        ]);

        const totalPages = Math.ceil(totalRecords / limit);

        return {
            data: docs.map((doc) => this.toEntity(doc)),
            totalPages,
            totalRecords,
        };
    }

    async save(deliveryReceipt: DeliveryReceiptEntity): Promise<DeliveryReceiptEntity> {
        const props = deliveryReceipt.toObject();
        const documentProps = this.toDocumentProps(props);

        if (props.id) {
            // Update existing aggregate
            const updatedDoc = await this.deliveryReceiptModel
                .findByIdAndUpdate(
                    props.id,
                    { $set: documentProps },
                    { new: true, runValidators: true }
                )
                .lean<DeliveryReceiptDocument>()
                .exec();

            if (!updatedDoc) {
                throw new Error(`Failed to update Delivery Receipt: Document with ID ${props.id} not found.`);
            }

            return this.toEntity(updatedDoc);
        }

        // Insert new aggregate
        const newDoc = await this.deliveryReceiptModel.create(documentProps);
        return this.toEntity(newDoc.toObject());
    }

    async cancel(id: string): Promise<DeliveryReceiptEntity | null> {
        if (!Types.ObjectId.isValid(id)) {
            return null;
        }

        const updatedDoc = await this.deliveryReceiptModel
            .findByIdAndUpdate(
                id,
                { $set: { status: 'CANCELLED' } },
                { new: true, runValidators: true }
            )
            .lean<DeliveryReceiptDocument>()
            .exec();

        if (!updatedDoc) {
            return null;
        }

        return this.toEntity(updatedDoc);
    }
}