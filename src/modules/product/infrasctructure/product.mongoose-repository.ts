import { ProductModel, ProductDocument } from './product.model';
import { ProductEntity, ProductCategory, PackageData } from '../domain/product.entity';
import { ProductRepository, ProductFilter, ProductStatusFilter, FindAllProductsResponse } from '../domain/product.repository';
import { QueryFilter } from 'mongoose';

export class MongooseProductRepository implements ProductRepository {
    constructor(private readonly productModel: typeof ProductModel) { }

    // --------------------------------------------------------------
    // Helper methods for converting between Mongoose documents and domain entities
    // --------------------------------------------------------------

    private toEntity(doc: ProductDocument): ProductEntity {
        const packageData: PackageData | undefined = doc.packageData
            ? {
                weightKg: doc.packageData.weightKg,
                areaM2: doc.packageData.areaM2,
            }
            : undefined;

        return new ProductEntity({
            id: doc._id.toString(),
            skuCode: doc.skuCode,
            name: doc.name,
            imageUrl: doc.imageUrl,
            priceCost: doc.priceCost,
            priceCash: doc.priceCash,
            priceInstallments: doc.priceInstallments,
            category: doc.category,
            active: doc.active,
            packageData,
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt,
            deletedAt: doc.deletedAt,
        });
    }

    private toDocumentProps(props: ReturnType<ProductEntity['toObject']>) {
        return {
            skuCode: props.skuCode,
            name: props.name,
            imageUrl: props.imageUrl,
            priceCost: props.priceCost,
            priceCash: props.priceCash,
            priceInstallments: props.priceInstallments,
            category: props.category,
            active: props.active,
            packageData: props.packageData
                ? {
                    weightKg: props.packageData.weightKg,
                    areaM2: props.packageData.areaM2,
                }
                : undefined,
            createdAt: props.createdAt,
            updatedAt: props.updatedAt,
            deletedAt: props.deletedAt,
        };
    }

    // --------------------------------------------------------------
    // Implementation of ProductRepository interface methods
    // --------------------------------------------------------------

    async findById(id: string): Promise<ProductEntity | null> {
        const doc = await this.productModel.findById(id, undefined, { deletedAt: { $exists: false } }).lean(true);

        if (!doc) {
            return null;
        }

        return this.toEntity(doc);
    }

    async findBySkuCode(skuCode: string): Promise<ProductEntity | null> {
        const doc = await this.productModel.findOne({ skuCode, deletedAt: { $exists: false } }).lean(true);

        if (!doc) {
            return null;
        }

        return this.toEntity(doc);
    }

    async findAll(filter: ProductFilter): Promise<FindAllProductsResponse> {
        const page = Math.max(1, filter.page || 1);
        const limit = Math.max(1, filter.limit || 10);
        const skip = (page - 1) * limit;

        const query: QueryFilter<ProductDocument> = {
            deletedAt: {
                $exists: false
            },
        };

        if (filter.active && filter.active !== 'ALL') {
            query.active = (filter.active === 'ACTIVE') ? true : false;
        }

        if (filter.skuCode) {
            query.skuCode = filter.skuCode;
        }

        if (filter.category && filter.category !== "ALL") {
            query.category = filter.category;
        }

        if (filter.name) {
            query.name = { $regex: filter.name, $options: 'i' };
        }

        const [docs, totalRecords] = await Promise.all([
            this.productModel.find(query)
                .sort({ name: -1 })
                .skip(skip)
                .limit(limit)
                .lean()
                .exec(),
            this.productModel.countDocuments(query).exec()
        ]);

        const totalPages = Math.ceil(totalRecords / limit);

        return {
            data: docs.map((doc) => this.toEntity(doc)),
            totalPages,
            totalRecords
        };
    }

    // --------------------------------------------------------------
    // Save method: Inserts or updates a product in the database
    // based on its existence
    // --------------------------------------------------------------
    async save(product: ProductEntity): Promise<ProductEntity | null> {
        const props = product.toObject();

        const existing = await this.productModel.findOne({
            skuCode: props.skuCode,
            deletedAt: { $exists: false },
        });

        if (existing) {
            // Update existing product
            const updatedProduct = await this.productModel.findByIdAndUpdate(
                existing._id,
                {
                    $set: this.toDocumentProps(props),
                },
                { new: true }
            );

            return updatedProduct ? this.toEntity(updatedProduct) : null;
        } else {
            // Insert new product
            const newProduct = await this.productModel.create(this.toDocumentProps(props));
            return newProduct ? this.toEntity(newProduct) : null;
        }
    }

    async softDelete(id: string): Promise<void> {
        await this.productModel.findByIdAndUpdate(
            id, { deletedAt: { $exists: false } },
            {
                $set: {
                    active: false,
                    deletedAt: new Date(),
                    updatedAt: new Date(),
                },
            }
        );
    }

    async existsBySkuCode(skuCode: string): Promise<boolean> {
        const doc = await this.productModel.findOne(
            {
                skuCode,
                deletedAt: { $exists: false },
            },
            { _id: 1 }
        ).lean(true).exec();

        return !!doc;
    }
}