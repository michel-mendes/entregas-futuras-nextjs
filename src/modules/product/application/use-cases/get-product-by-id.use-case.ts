import { AppError } from '@/lib/errors/AppError';
import { ProductProps } from '../../domain/product.entity';
import { ProductRepository } from '../../domain/product.repository';

export class GetProductByIdUseCase {
    constructor(private readonly productRepository: ProductRepository) { }

    async execute(id: string): Promise<ProductProps> {
        const product = await this.productRepository.findById(id);

        if (!product) {
            throw AppError.NotFound(`Product not found with id: ${id}`);
        }
        
        return product.toObject();
    }
}