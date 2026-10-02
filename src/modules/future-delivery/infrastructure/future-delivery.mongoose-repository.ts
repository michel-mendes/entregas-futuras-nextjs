import { Types, QueryFilter } from 'mongoose';
import { FutureDeliveryModel, FutureDeliveryDocument } from './future-delivery.model';
import { FutureDeliveryEntity } from '../domain/future-delivery.entity';
import {
    FutureDeliveryRepository,
    FutureDeliveryFilter,
    FindAllFutureDeliveriesResponse,
} from '../domain/future-delivery.repository';

export class MongooseFutureDeliveryRepository implements FutureDeliveryRepository {
    constructor(private readonly futureDeliveryModel: typeof FutureDeliveryModel) { }

    // --------------------------------------------------------------
    // Data Mapper: Converts Mongoose Documents <-> Domain Entities
    // --------------------------------------------------------------

    private toEntity(doc: FutureDeliveryDocument): FutureDeliveryEntity {
        return new FutureDeliveryEntity({
            id: doc._id.toString(),
            customer: {
                name: doc.customer.name,
                document: doc.customer.document,
                phone: doc.customer.phone,
            },
            deliveryAddress: {
                zipCode: doc.deliveryAddress.zipCode,
                street: doc.deliveryAddress.street,
                number: doc.deliveryAddress.number,
                complement: doc.deliveryAddress.complement,
                neighborhood: doc.deliveryAddress.neighborhood,
                city: doc.deliveryAddress.city,
                state: doc.deliveryAddress.state,
            },
            status: doc.status,
            items: doc.items.map((item) => ({
                id: item._id ? item._id.toString() : undefined,
                productId: item.productId.toString(),
                description: item.description,
                purchasedQuantity: item.purchasedQuantity,
                deliveredQuantity: item.deliveredQuantity,
            })),
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt,
        });
    }

    private toDocumentProps(props: ReturnType<FutureDeliveryEntity['toObject']>) {
        return {
            customer: props.customer,
            deliveryAddress: props.deliveryAddress,
            status: props.status,
            items: props.items.map((item) => ({
                ...(item.id && Types.ObjectId.isValid(item.id) ? { _id: new Types.ObjectId(item.id) } : {}),
                productId: new Types.ObjectId(item.productId),
                description: item.description,
                purchasedQuantity: item.purchasedQuantity,
                deliveredQuantity: item.deliveredQuantity,
            })),
            createdAt: props.createdAt,
            updatedAt: props.updatedAt,
        };
    }

    // --------------------------------------------------------------
    // Repository Interface Implementation
    // --------------------------------------------------------------

    async findById(id: string): Promise<FutureDeliveryEntity | null> {
        if (!Types.ObjectId.isValid(id)) {
            return null;
        }

        const doc = await this.futureDeliveryModel.findById(id).lean<FutureDeliveryDocument>().exec();

        if (!doc) {
            return null;
        }

        return this.toEntity(doc);
    }

    async findByCustomerDocument(document: string): Promise<FutureDeliveryEntity[]> {
        const docs = await this.futureDeliveryModel
            .find({ 'customer.document': document })
            .sort({ createdAt: -1 })
            .lean<FutureDeliveryDocument[]>()
            .exec();

        return docs.map((doc) => this.toEntity(doc));
    }

    async findAll(filter: FutureDeliveryFilter): Promise<FindAllFutureDeliveriesResponse> {
        const page = Math.max(1, filter.page || 1);
        const limit = Math.max(1, filter.limit || 10);
        const skip = (page - 1) * limit;

        const query: QueryFilter<FutureDeliveryDocument> = {};

        if (filter.status && filter.status !== 'ALL') {
            query.status = filter.status;
        }

        if (filter.customerDocument) {
            query['customer.document'] = filter.customerDocument;
        }

        if (filter.customerName) {
            query['customer.name'] = { $regex: filter.customerName, $options: 'i' };
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
            this.futureDeliveryModel
                .find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean<FutureDeliveryDocument[]>()
                .exec(),
            this.futureDeliveryModel.countDocuments(query).exec(),
        ]);

        const totalPages = Math.ceil(totalRecords / limit);

        return {
            data: docs.map((doc) => this.toEntity(doc)),
            totalPages,
            totalRecords,
        };
    }

    async save(delivery: FutureDeliveryEntity): Promise<FutureDeliveryEntity> {
        const props = delivery.toObject();
        const documentProps = this.toDocumentProps(props);

        if (props.id) {
            // Update existing aggregate
            const updatedDoc = await this.futureDeliveryModel
                .findByIdAndUpdate(
                    props.id,
                    { $set: documentProps },
                    { new: true, runValidators: true }
                )
                .lean<FutureDeliveryDocument>()
                .exec();

            if (!updatedDoc) {
                throw new Error(`Failed to update Future Delivery: Document with ID ${props.id} not found.`);
            }

            return this.toEntity(updatedDoc);
        }

        // Insert new aggregate
        const newDoc = await this.futureDeliveryModel.create(documentProps);
        return this.toEntity(newDoc.toObject());
    }
}