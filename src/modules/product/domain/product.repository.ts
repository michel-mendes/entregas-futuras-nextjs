import { ProductEntity, ProductCategory } from './product.entity';

export type ProductStatusFilter = "ACTIVE" | "INACTIVE" | "ALL";

export interface ProductFilter {
    page: number;
    limit: number;
    name?: string;
    skuCode?: string;
    category?: ProductCategory | "ALL";
    active?: ProductStatusFilter;
}

export interface FindAllProductsResponse {
    data: ProductEntity[];
    totalPages: number;
    totalRecords: number;
}

export interface ProductRepository {
    findById(id: string): Promise<ProductEntity | null>;
    findBySkuCode(skuCode: string): Promise<ProductEntity | null>;
    findAll(filter: ProductFilter): Promise<FindAllProductsResponse>;
    save(product: ProductEntity): Promise<ProductEntity | null>;
    softDelete(id: string): Promise<void>;
    existsBySkuCode(skuCode: string): Promise<boolean>;
}