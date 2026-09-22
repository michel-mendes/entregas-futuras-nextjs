import { AppError } from '@/lib/errors/AppError';
import { ProductEntity, ProductProps } from '../../domain/product.entity';
import { ProductRepository } from '../../domain/product.repository';
import { CreateProductInput } from '../product.validator';

export class CreateProductUseCase {
    constructor(private readonly productRepository: ProductRepository) { }

    async execute(input: CreateProductInput): Promise<ProductProps> {
        const exists = await this.productRepository.existsBySkuCode(input.skuCode);
        if (exists) {
            throw AppError.Conflict('SKU code already exists.');
        }

        const product = new ProductEntity({
            skuCode: input.skuCode,
            name: input.name,
            imageUrl: input.imageUrl,
            priceCost: input.priceCost,
            priceCash: input.priceCash,
            priceInstallments: input.priceInstallments,
            category: input.category,
            active: input.active,
            packageData: input.packageData,
            createdAt: new Date(),
        });

        const createdProduct = await this.productRepository.save(product);

        if (!createdProduct) throw AppError.InternalError('Unknown error while product creation.')

        return createdProduct.toObject();
    }
}