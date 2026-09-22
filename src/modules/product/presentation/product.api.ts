import { ApiResponse } from '@/types/api-response.types';
import { ProductProps } from '../domain/product.entity';
import { ProductFilter } from '../domain/product.repository';
import { CreateProductInput, UpdateProductInput } from '../application/product.validator';
import { handleApiResponse } from '@/lib/api/api-response-handler';

const BASE_URL = '/api/products';

export const productsApi = {

    async fetchProducts(params: ProductFilter): Promise<ApiResponse<ProductProps[]>> {
        const url = new URL(BASE_URL, window.location.origin);

        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                url.searchParams.append(key, String(value));
            }
        });

        const response = await fetch(url.toString(), {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });

        return await handleApiResponse<ProductProps[]>(response);
    },

    async getProductById(id: string): Promise<ApiResponse<ProductProps>> {
        const response = await fetch(`${BASE_URL}/${id}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });

        return await handleApiResponse<ProductProps>(response);
    },

    async createProduct(input: CreateProductInput): Promise<ApiResponse<ProductProps>> {
        const response = await fetch(BASE_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(input),
        });

        return await handleApiResponse<ProductProps>(response);
    },

    async updateProduct(id: string, input: UpdateProductInput): Promise<ApiResponse<ProductProps>> {
        const response = await fetch(`${BASE_URL}/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(input),
        });

        return await handleApiResponse<ProductProps>(response);
    },

    async deleteProduct(id: string): Promise<ApiResponse<{ message: string; }>> {
        const response = await fetch(`${BASE_URL}/${id}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
        });

        return await handleApiResponse<{ message: string; }>(response);
    },

    async toggleProductStatus(id: string, active: boolean): Promise<ApiResponse<ProductProps>> {
        const response = await fetch(`${BASE_URL}/${id}/toggle-status`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ active })
        });

        return await handleApiResponse<ProductProps>(response);

    }
}