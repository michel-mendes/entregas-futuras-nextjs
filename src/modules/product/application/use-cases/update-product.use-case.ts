import { AppError } from '@/lib/errors/AppError';
import { ProductProps } from '../../domain/product.entity';
import { ProductRepository } from '../../domain/product.repository';
import { UpdateProductInput } from '../product.validator';


export class UpdateProductUseCase {
    constructor(private readonly productRepository: ProductRepository) { }

    async execute(id: string, input: UpdateProductInput): Promise<ProductProps> {
        const product = await this.productRepository.findById(id);

        if (!product) {
            throw AppError.NotFound(`Product not found with id: ${id}`);
        }

        if (input.skuCode !== undefined) {
            if (input.skuCode !== product.skuCode) {
                const exists = await this.productRepository.existsBySkuCode(input.skuCode);
                if (exists) {
                    throw AppError.Conflict('SKU code already exists.');
                }
            }
            product.updateSkuCode(input.skuCode);
        }

        if (input.name !== undefined) {
            product.updateDescription(input.name);
        }

        if (
            input.priceCash !== undefined ||
            input.priceInstallments !== undefined ||
            input.priceCost !== undefined
        ) {
            const priceCost = input.priceCost ?? product.priceCost;
            const priceCash = input.priceCash ?? product.priceCash;
            const priceInstallments = input.priceInstallments ?? product.priceInstallments;

            product.updatePrices({priceCost, priceCash, priceInstallments});
        }

        if (input.packageData !== undefined) {
            product.updatePackageData(input.packageData);
        }
        
        if (input.category !== undefined) {
            product.updateCategory(input.category);
        }


        if (input.active !== undefined) {
            if (input.active) {
                product.activate();
            } else {
                product.deactivate();
            }
        }

        await this.productRepository.save(product);

        return product.toObject();
    }
}