import { PaginatedResponse } from '@/types/pagination.types';
import { ProductEntity, ProductCategory, ProductProps } from '../../domain/product.entity';
import { ProductRepository, ProductFilter, FindAllProductsResponse } from '../../domain/product.repository';

export class FindAllProductsUseCase {
    constructor(private readonly productRepository: ProductRepository) { }

    async execute(input: ProductFilter): Promise<PaginatedResponse<ProductProps>> {

        const response = await this.productRepository.findAll(input);
        const products = response.data.map(entity => entity.toObject());
        
        return {
            data: products,
            meta: {
                totalPaginas: response.totalPages,
                totalRegistros: response.totalRecords,
                paginaAtual: input.page,
                itensPorPagina: input.limit,
                temPaginaAnterior: input.page < response.totalPages,
                temProximaPagina: input.page > 1
            }
        }
    }
}