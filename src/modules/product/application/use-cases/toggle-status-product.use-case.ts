import { AppError } from "@/lib/errors/AppError";
import { ProductProps } from "../../domain/product.entity";
import { ProductRepository } from "../../domain/product.repository";

export class ToggleProductStatusUseCase {
    constructor(private readonly productRepository: ProductRepository) {}

    async execute(id: string, activate: boolean): Promise<ProductProps> {
        const product = await this.productRepository.findById(id);

        if (!product) {
            throw AppError.NotFound(`Product not found with id: ${id}`);
        }

        if (activate) {
            product.activate();
        } else {
            product.deactivate();
        }

        await this.productRepository.save(product);

        return product.toObject();
    }
}