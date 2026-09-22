import { AppError } from '@/lib/errors/AppError';
import { ProductRepository } from '../../domain/product.repository';

export class DeleteProductUseCase {
    constructor(private readonly productRepository: ProductRepository) { }

    async execute(id: string): Promise<void> {
        const product = await this.productRepository.findById(id);

        if (!product) {
            throw AppError.NotFound(`Product not found with id: ${id}`);
        }

        await this.productRepository.softDelete(id);
    }
}